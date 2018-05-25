import m from "mithril";

const asWorkspaceLink = w =>
	m(
		"a.navbar-item",
		{
			onclick() {
				const route = m.route.get();
				const nonWorkspaceRoute = route.substring(
					route.indexOf("/", 1)
				);
				m.route.set(`/${w.id}${nonWorkspaceRoute}`);
			},
		},
		w.name
	);

export default {
	view: ({ attrs: { currentWorkspace, workspaces } }) => {
		return m(
			".navbar[role=navigation]",
			m(
				".navbar-brand",
				m(".navbar-item", m("a.title", "Conch")),
				m(".navbar-burger", m("span"), m("span"), m("span"))
			),
			m(
				".navbar-menu",
				m(
					".navbar-end",
					m(
						".navbar-item.has-dropdown.is-hoverable",
						m("a.navbar-link", currentWorkspace().name),
						m(
							".navbar-dropdown.is-right",
							workspaces.map(asWorkspaceLink)
						)
					)
				)
			)
		);
	},
};
