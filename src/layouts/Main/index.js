import m from "mithril";
import O from "patchinko/constant";
import keyBy from "lodash/keyBy";

import Workspaces from "models/WorkspaceList";

import NavbarComponent from "layouts/Main/Navbar";
import SidebarComponent from "layouts/Main/Sidebar";

export default update => {
	const sidebar = new SidebarComponent(update);
	const navbar = new NavbarComponent(update);

	const loadWorkspaces = model =>
		Workspaces.getAll()
			.then(wss => keyBy(wss, "id"))
			.then(wss => O(model, { workspaces: wss }));

	const setCurrentWorkspace = model => {
		if (model.params && model.params.wid) {
			O(model, { currentWorkspace: model.params.wid });
		} else {
			const cws = Object.values(model.workspaces).find(
				w => w.name === "GLOBAL"
			);
			O(model, { currentWorkspace: cws.id });
		}
		return model;
	};

	return {
		navigatingTo: ({ page, model }) =>
			loadWorkspaces(model).then(setCurrentWorkspace),
		view: ({ attrs: { model }, children: [contentView] }) => [
			m(navbar, { model }),
			m(
				".section",
				m(
					".columns",
					m(".column.is-2", m(sidebar, { model })),
					m(".column.is-10", contentView)
				)
			)
		]
	};
};
