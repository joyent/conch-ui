// app.js
import "styles/main.scss";

import m from "mithril";
import stream from "mithril/stream";
import O from "patchinko/constant";

import App from "app";
import LoginView from "views/Login";
import StatusView from "views/Status";
import User from "models/User";
import UserView from "views/User";

const LogoutView = update => ({
	view: () => {
		const user = new User();
		user.logout().then(() => {
			update(O);
			m.route.set("/login");
		});
	}
});

const DefaultRoute = model => ({
	layout: false,
	view: ({ attrs: { model } }) => {
		if (!model.auth) return m.route.set("/login");
		if (model.currentWorkspace) return m.route.set("/user");
		return m.route.set(`/${model.currentWorkspace}/status`);
	}
});

const update = stream();

const app = new App({
	update,
	pages: {
		Login: new LoginView(update),
		Logout: new LogoutView(update),
		Status: new StatusView(update),
		User: new UserView(update)
	}
});

const models = stream.scan(O, app.model(), update);

const route = page => ({
	onmatch: (params, path) => {
		return app
			.navigatingTo({ page, model: O(models(), { params, path }) })
			.then(update)
			.then(m(app, { page, model: models() }));
	},
	render: () => m(app, { page, model: models() })
});

const authedRoute = page => ({
	onmatch: (params, path) => {
		if (!models().auth) {
			update(O);
			m.route.set("/login");
			return Promise.reject();
		}
		return app
			.navigatingTo({ page, model: O(models(), { params, path }) })
			.then(update)
			.then(m(app, { page, model: models() }));
	},
	render: () => m(app, { page, model: models() })
});

m.route(document.body, "/", {
	"/": route(DefaultRoute),
	"/login": route(app.pages.Login),
	"/logout": route(app.pages.Logout),
	"/:wid/status": authedRoute(app.pages.Status),
	"/:wid/status/device/:deviceId": authedRoute(app.pages.Status),
	/*
	"/:wid/device": authedRoute(app.pages.Device),
	"/:wid/device/:deviceId": authedRoute(app.pages.Device),
	"/:wid/datacenter": authedRoute(app.pages.Datacenter),
	"/:wid/datacenter/:roomName/rack": authedRoute(app.pages.Datacenter),
	"/:wid/datacenter/:roomName/rack/:rackId/device": authedRoute(
		app.pages.Datacenter
	),
	"/:wid/datacenter/:roomName/rack/:rackId/device/:deviceId": authedRoute(
		app.pages.Datacenter
	),
    */
	"/user": authedRoute(app.pages.User)
});
