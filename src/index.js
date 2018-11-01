// app.js
import "styles/main.scss";

import m from "mithril";
import stream from "mithril/stream";
import O from "patchinko/constant";
import Navigator from "Navigator";

// models
import User from "models/User";

// Views
import App from "app";
import LoginView from "views/Login";
import LogoutView from "views/Logout";
import StatusView from "views/Status";
import UserView from "views/User";

const update = stream();

const navigator = new Navigator(update);

navigator.registerPages({
	Login: new LoginView({ navigator, update }),
	Logout: new LogoutView({ navigator, update }),
	Status: new StatusView({ navigator, update }),
	User: new UserView({ navigator, update })
});

const app = new App({ navigator, update });

const models = stream.scan(O, app.model(), update);
models.map(model => m.render(document.body, m(app, { model })));

/*
const route = page => ({
	onmatch: (params, path) => {
		return app
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
			.then(update)
			.then(m(app, { page, model: models() }));
	},
	render: () => m(app, { page, model: models() })
});

m.route(document.body, "/", {
	"/": route("DefaultRoute"),
	"/login": route("Login"),
	"/logout": route("Logout"),
	"/:wid/status": authedRoute("Status"),
	"/:wid/status/device/:deviceId": authedRoute("Status"),
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
	"/user": authedRoute("User")
});
    */
