import m from "mithril";
import stream from "mithril/stream";
import t from "i18n4v";
import moment from "moment";

import { conchApi } from "../config";
import "./styles/main.scss";

import Login from "./views/Login";
import WorkspaceNotFound from "./views/WorkspaceNotFound";
import DatacenterBrowser from "./views/DatacenterBrowser";
import DevicesView from "./views/Devices";
import Status from "./views/Status";

import Main from "./layouts/Main";

import korean from "./languages/ko.js";
import english from "./languages/en.js";
const languages = {
	en: english,
	ko: korean,
	"ko-KR": korean
};

t.selectLanguage(["en", "ko", "ko-KR"], (err, lang) => {
	moment.locale(lang ? lang.slice(0, 2) : "en");
	t.translator.add(languages[lang] ? languages[lang] : languages.en);
});

const state = {};

const currentWorkspace = stream();
const loggedIn = stream(false);
const workspaces = stream();

currentWorkspace.map(ws => {
	if (ws) localStorage.setItem("currentWorkspace", ws.id);
});

function loadWorkspace(urlWorkspaceId) {
	if (currentWorkspace() && currentWorkspace().id === urlWorkspaceId) {
		return Promise.resolve();
	}

	// check the current list of workspaces for the urlWorkspaceId. If not
	// found, continue and refresh workspaces
	if (workspaces() && urlWorkspaceId) {
		let found = workspaces().find(w => w.id === urlWorkspaceId);
		if (found) {
			currentWorkspace(found);
			return Promise.resolve();
		}
	}

	return m
		.request({
			method: "GET",
			url: `${conchApi}/workspace`,
			withCredentials: true
		})
		.then(ws => {
			workspaces(ws);

			// use the workspace ID encoded in the URL if present. Reject and
			// direct to error page if not found
			if (urlWorkspaceId) {
				let found = ws.find(w => w.id === urlWorkspaceId);
				if (!found)
					return Promise.reject(WorkspaceNotFound(urlWorkspaceId));
				currentWorkspace(found);
			} else {
				let current;
				// try to use current workspace in localStorage
				let storedId = localStorage.getItem("currentWorkspace");
				if (storedId) current = ws.find(w => w.id === storedId);

				// if none stored, try to use GLOBAL workspace if available
				if (!current) current = ws.find(w => w.name === "GLOBAL");
				// fallback on first workspace in list
				if (!current) current = ws[0];
				currentWorkspace(current);
			}
		});
}

function setupSession(urlWorkspaceId) {
	if (loggedIn()) return loadWorkspace(urlWorkspaceId);
	return m
		.request({
			method: "GET",
			url: `${conchApi}/login`,
			withCredentials: true,
			extract(xhr) {
				return {
					status: xhr.status,
					body: xhr.response ? JSON.parse(xhr.response) : null
				};
			}
		})
		.catch(e => {
			if (e.status === 401) {
				Promise.reject();
			} else {
				throw e;
			}
		})
		.then(
			() => {
				loggedIn(true);
				return loadWorkspace(urlWorkspaceId);
			},
			() => Promise.reject(Login)
		);
}

function dispatch(root, routes) {
	let layout;
	let view;
	const table = Object.keys(routes).reduce((accTable, route) => {
		let workspacePrefixedRoute = "/:wid" + route;
		accTable[workspacePrefixedRoute] = {
			onmatch(args, pendingRoute) {
				return setupSession(args.wid).then(
					() => {
						let comp = routes[route];
						layout = comp.layout;
						view = comp.view;
						return {
							view: () =>
								m(comp.view || comp, {
									currentWorkspace,
									workspaces
								})
						};
					},
					// e may be an error view or an error in the case of bugs
					e => {
						if (e instanceof Error) console.error(e);
						return e;
					}
				);
			},
			render(vnode) {
				return layout && view
					? m(
							layout,
							{
								currentWorkspace,
								loggedIn,
								workspaces
							},
							m(view, {
								currentWorkspace,
								workspaces
							})
					  )
					: vnode;
			}
		};

		return accTable;
	}, {});

	table["/"] = {
		onmatch() {
			return setupSession().then(
				comp => {
					m.route.set(`/${currentWorkspace().id}/status`);
				},
				// e may be an error view or an error in the case of bugs
				e => {
					if (e instanceof Error) console.error(e);
					return e;
				}
			);
		}
	};

	m.route(root, "/", table);
}

dispatch(document.body, {
	"/status": { layout: Main, view: Status },
	"/status/device/:deviceId": { layout: Main, view: Status },
	"/device": { layout: Main, view: DevicesView },
	"/device/:deviceId": { layout: Main, view: DevicesView },
	"/datacenter": { layout: Main, view: DatacenterBrowser },
	"/datacenter/:roomName/rack": { layout: Main, view: DatacenterBrowser },
	"/datacenter/:roomName/rack/:rackId/device": {
		layout: Main,
		view: DatacenterBrowser
	},
	"/datacenter/:roomName/rack/:rackId/device/:deviceId": {
		layout: Main,
		view: DatacenterBrowser
	}
});
