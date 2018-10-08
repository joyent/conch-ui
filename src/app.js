// app.js
import m from "mithril";

import MainLayout from "layouts/Main";
import Request from "util/Request";

const r = new Request();

const isEmpty = o => Object.keys(o).length === 0 && o.constructor === Object;
const pipe = (...functions) => input =>
	functions.reduce((chain, func) => chain.then(func), Promise.resolve(input));

export default ({ update, pages }) => {
	const layout = new MainLayout(update);

	return {
		navigatingTo: ({ page, model }) => {
			return Promise.all([
				page.layout && layout.navigatingTo({ page, model }),
				page.navigatingTo && page.navigatingTo({ page, model })
			]);
		},
		pages,
		model: () => ({
			auth: r.getToken() ? { jwt_token: r.getToken() } : false,
			workspaces: {},
			currentWorkspace: false
		}),
		view: ({ attrs: { page, model } }) => {
			//console.log(model);
			return page.layout
				? m(layout, { model }, m(page, { model }))
				: m(page, { model });
		}
	};
};
