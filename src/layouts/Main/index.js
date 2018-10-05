import m from "mithril";

import NavbarComponent from "layouts/Main/Navbar";
import SidebarComponent from "layouts/Main/Sidebar";

export default update => {
	const sidebar = new SidebarComponent(update);
	const navbar = new NavbarComponent(update);

	return {
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
