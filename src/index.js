import m from "mithril";
import stream from "mithril/stream";
import t from "i18n4v";
import moment from "moment";

import { conchApi } from "../config";
import "./styles/main.scss";

import Device from "./views/Device";
import Layout from "./views/Layout";
import Login from "./views/Login";
import Problem from "./views/Problem";
import Rack from "./views/Rack";
import Status from "./views/Status";
import RelayView from "./views/Relay";

import Main from "./views/component/Main";

import korean from "./languages/ko.js";
import english from "./languages/en.js";
const languages = {
	en: english,
	ko: korean,
	"ko-KR": korean,
};

t.selectLanguage(["en", "ko", "ko-KR"], (err, lang) => {
	moment.locale(lang ? lang.slice(0, 2) : "en");
	t.translator.add(languages[lang] ? languages[lang] : languages.en);
});

const state = {};

const currentWorkspace = stream();

function loadWorkspaces() {
	if (state.workspaces != null) return Promise.resolve();
	return m
		.request({
			method: "GET",
			url: `${conchApi}/workspace`,
			withCredentials: true,
		})
		.then(workspaces => {
			state.workspaces = workspaces;
			currentWorkspace(workspaces[0]);
		});
}

function setupSession() {
	if (state.loggedIn) return loadWorkspaces();
	return m
		.request({
			method: "GET",
			url: `${conchApi}/login`,
			withCredentials: true,
			extract(xhr) {
				return {
					status: xhr.status,
					body: xhr.response ? JSON.parse(xhr.response) : null,
				};
			},
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
				state.loggedIn = true;
				return loadWorkspaces();
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
				return setupSession().then(() => {
					let comp = routes[route];
					let workspaceId = args.wid;
					if (currentWorkspace().id !== workspaceId) {
						currentWorkspace(
							state.workspaces.find(w => w.id === workspaceId) ||
								currentWorkspace()
						);
					}
					layout = comp.layout;
					view = comp.view;
					return {
						view: () =>
							m(comp.view || comp, {
								currentWorkspace,
								workspaces: state.workspaces,
							}),
					};
				}, () => Login);
			},
			render(vnode) {
				return layout && view
					? m(
							layout,
							{ currentWorkspace, workspaces: state.workspaces },
							m(view, {
								currentWorkspace,
								workspaces: state.workspaces,
							})
					  )
					: vnode;
			},
		};

		return accTable;
	}, {});

	table["/"] = {
		onmatch() {
			return setupSession().then(comp => {
				m.route.set(`/${currentWorkspace().id}/status`);
			}, () => Login);
		},
	};

	m.route(root, "/", table);
}

dispatch(document.body, {
	"/status": { layout: Main, view: Status },
	"/datacenter": { layout: Main, view: Rack },
	"/datacenter/:roomName/rack": { layout: Main, view: Rack },
	"/datacenter/:roomName/rack/:rackId/device": { layout: Main, view: Rack },
	"/datacenter/:roomName/rack/:rackId/device/:deviceId": {
		layout: Main,
		view: Rack,
	},
});
