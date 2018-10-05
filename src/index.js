// app.js
import "styles/main.scss";

import stream from "mithril/stream";
import m from "mithril";
import O from "patchinko/immutable";


import LoginView from "views/Login";
import UserView from "views/User";
import StatusView from "views/Status";

import App from "app";

const update = stream();

const app = new App({
	update,
	pages: {
		Login: new LoginView(update),
		Logout: {
			view() {
				update(O), m.route.set("/");
			}
		},
		Status: new StatusView(update),
		User: new UserView(update)
	}
});

const models = stream.scan(O, app.model(), update);

const route = page => ({
	onmatch: (params, path) => update({ params, path }),
	render: () => m(app, { page, model: models() })
});

const authedRoute = page => ({
	onmatch: (params, path) => {
		const model = models();
		if (!model.loggedIn) {
			update(O); // clear the model
			m.route.set("/login");
		}
		update({ page, params, path });
	},
	render: () => m(app, { page, model: models() })
});

m.route(document.body, "/", {
	"/": route(app.pages.Login),
	"/login": route(app.pages.Login),
	"/logout": route(app.pages.Logout),
	"/:wid/status": authedRoute(app.pages.Status),
	/*
	"/:wid/status/device/:deviceId": authedRoute(app.pages.Status),
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
