import m from "mithril";
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

let state = {};

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
			state.currentWorkspace = state.workspaces[0];
		});
}

function requiresLogin(view) {
	if (state.loggedIn) return Promise.resolve(view);
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
				return loadWorkspaces().then(() => view);
			},
			() => Promise.reject(Login)
		);
}

function dispatch(root, routes) {
	let layout;
	const table = Object.keys(routes).reduce((accTable, route) => {
		let workspacePrefixedRoute = "/:wid" + route;
		accTable[workspacePrefixedRoute] = {
			onmatch(args, pendingRoute) {
				return requiresLogin(routes[route]).then(comp => {
					let workspaceId = args.wid;
					state.currentWorkspace =
						state.workspaces.find(w => w.id === workspaceId) ||
						state.currentWorkspace;
					layout = comp.layout;
					return {
						view: () => m(comp.view || comp, state),
					};
				}, () => Login);
			},
			render(vnode) {
				return layout ? m(Main, state, vnode) : vnode;
			},
		};

		return accTable;
	}, {});

	table["/"] = {
		onmatch() {
			return requiresLogin(null).then(comp => {
				m.route.set(`/${state.currentWorkspace.id}/status`);
			}, () => Login);
		},
	};

	m.route(root, "/", table);
}

dispatch(document.body, {
	"/status": { layout: Main, view: Status },
	"/rack": { layout: Main, view: Rack },
});

//m.route(document.body, "/status", {
//"/status": {
//onmatch() {
//return requiresLogin(Status);
//},
//render(vnode) {
//if (vnode.tag !== "div") return vnode;
//return m(Main, m(Status));
//},
//},
//"/rack": {
//onmatch() {
//return requiresLogin(Status);
//},
//render(vnode) {
//if (vnode.tag !== "div") return vnode;
//return m(Main, m(Rack));
//},
//},
//"/rack/:id": {
//onmatch(attrs) {
//return requiresLogin({
//view: () =>
//m(
//Layout.threePane,
//{ active: 2, title: "Rack" },
//m(Rack.allRacks),
//m(Rack.rackLayout, attrs)
//),
//});
//},
//},
//"/problem": {
//onmatch() {
//return requiresLogin({
//view: () =>
//m(
//Layout.threePane,
//{ active: 1, title: "Problems" },
//m(Problem.selectProblemDevice),
//m(Problem.makeSelection)
//),
//});
//},
//},
//"/problem/:id": {
//onmatch(attrs) {
//return requiresLogin({
//view: () =>
//m(
//Layout.threePane,
//{ active: 2, title: "Problem" },
//m(Problem.selectProblemDevice, attrs),
//m(Problem.showDevice, attrs)
//),
//});
//},
//},
//"/device": {
//onmatch(attrs) {
//return requiresLogin({
//view: () =>
//m(
//Layout.threePane,
//{ active: 1, title: "Device Reports" },
//m(Device.allDevices),
//m(Device.makeSelection)
//),
//});
//},
//},
//"/device/:id": {
//onmatch(attrs) {
//return requiresLogin({
//view: () =>
//m(
//Layout.threePane,
//{ active: 2, title: "Report" },
//m(Device.allDevices),
//m(Device.deviceReport, attrs)
//),
//});
//},
//},
//"/relay": {
//onmatch(attrs) {
//attrs.active = 1;
//return requiresLogin(RelayView, attrs);
//},
//},
//"/relay/:id": {
//onmatch(attrs) {
//attrs.active = 2;
//return requiresLogin(RelayView, attrs);
//},
//},
//"/login": Login,
//});
