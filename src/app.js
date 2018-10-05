// app.js
import m from "mithril";
import MainLayout from "layouts/Main";

export default ({ update, pages }) => {
	const layout = new MainLayout(update);
	return {
		pages,
		// merge the models from all the page back in to the app model
		model: () => ({
			loggedIn: false,
			workspaces: [],
			currentWorkspace: false
		}),
		view: ({ attrs: { page, model } }) => {
			console.log(model);
			return page.layout
				? m(layout, { model }, m(page, { model }))
				: m(page, { model });
		}
	};
}
