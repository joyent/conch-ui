import m from "mithril";
import O from "patchinko/constant";
import keyBy from "lodash/keyBy";

import Workspaces from "models/WorkspaceList";

import NavbarComponent from "layouts/Main/Navbar";
import SidebarComponent from "layouts/Main/Sidebar";
export default ({ navigator, update }) => {
	const sidebar = new SidebarComponent({ navigator, update });
	const navbar = new NavbarComponent({ navigator, update });

	const loadWorkspaces = model =>
		Workspaces.getAll()
			.then(wss => keyBy(wss, "id"))
			.then(wss => O(model, { workspaces: wss }));

	return {
		navigate: (model, navigate) => {
            console.log(model);
			loadWorkspaces(model).then(navigate);
		},
		view: ({ attrs: { model }, children: [contentView] }) => {
			console.log(JSON.parse(JSON.stringify(model)));
			return [
				m(navbar, { model }),
				m(
					".section",
					m(
						".columns",
						m(".column.is-2", m(sidebar, { model })),
						m(".column.is-10", contentView)
					)
				)
			];
		}
	};
};
