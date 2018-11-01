// app.js
import m from "mithril";

import Request from "util/Request";

const r = new Request();

// layouts
import MainLayout from "layouts/Main";

export default ({ navigator, update }) => {
	const layout = new MainLayout({ navigator, update });

	return {

		model: () => ({
			pageId: "DefaultRoute",
			auth: r.getToken() ? { jwt_token: r.getToken() } : false,
			workspaces: {},
			currentWorkspace: false
		}),

		view: ({ attrs: { model } }) => {
			console.log(JSON.parse(JSON.stringify(model)));
			const page = navigator.getCurrentPage(model);
			return page.layout
				? m(layout, { model }, m(page, { model }))
				: m(page, { model });
		}
	};
};
