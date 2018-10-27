// app.js
import m from "mithril";

import Request from "util/Request";

const r = new Request();

export default ({ update, navigator }) => {
	return {
		model: () => ({
			pageId: "DefaultRoute",
			auth: r.getToken() ? { jwt_token: r.getToken() } : false,
			workspaces: {},
			currentWorkspace: false
		}),
		view: ({ attrs: { model } }) => {
			console.log(JSON.parse(JSON.stringify(model)));
			const layout = navigator.getLayout(model);
			const page = navigator.getPage(model);
			return layout
				? m(layout, { model }, m(page, { model }))
				: m(page, { model });
		}
	};
};
