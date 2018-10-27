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

import MainLayout from "layouts/Main";

const LogoutView = (navigator, update) => ({
	view: () => {
		const user = new User();
		user.logout().then(() => {
			update(O);
			navigator.navigateTo({ pageId: "Login" });
		});
	}
});

const DefaultRoute = model => ({
	view: ({ attrs: { model } }) => navigator.loadDefaultPage(model)
});

const Navigator = ({ update }) => {
	const layouts = {};
	const pages = {};
	const registerLayouts = newLayouts => O(layouts, newLayouts);
	const registerPages = newPages => O(pages, newPages);

	const getPage = model => pages[model.pageId];

	const getLayout = model =>
		getPage(model) && getPage(model).layout && layouts.DefaultLayout;

	const navigateTo = (pageId, params) => {
		const page = getPage({ pageId });
		const layout = getLayout({ pageId });
		let navigate = Promise.resolve(O({ pageId }, params));
		if (layout && layout.navigate) navigate.then(layout.navigate);
        navigate.then(d => console.log(d) && d);
		if (page && page.navigate) navigate.then(page.navigate);
        navigate.then(d => console.log(d) && d);
		navigate.then(update);
	};

	const loadDefaultPage = model => {
		if (!model.auth) return navigateTo("Login", model);
		if (model.currentWorkspace) navigateTo("Status", model);
		navigateTo("User", model);
	};

	return {
		getLayout,
		getPage,
		loadDefaultPage,
		navigateTo,
		registerLayouts,
		registerPages
	};
};

const update = stream();

const navigator = new Navigator({ update });

navigator.registerLayouts({
	DefaultLayout: new MainLayout({ navigator, update })
});

navigator.registerPages({
	DefaultRoute,
	Login: new LoginView({ navigator, update }),
	Logout: new LogoutView({ navigator, update }),
	Status: new StatusView({ navigator, update }),
	User: new UserView({ navigator, update })
});

const app = new App({
	update,
	navigator
});

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
