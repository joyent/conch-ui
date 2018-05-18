import m from "mithril";

export default model => {
	const workspaces = model.workspaces || ["GLOBAL"];
	const currentWorkspace = "us-east-1-exp1";

	const asWorkspaceLink = w =>
		m(
			"a.navbar-item",
			{
				//onclick: () => model.setActiveWorkspace(w)
			},
			w
		);
	return {
		view: ({attrs}) =>
			m(
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

							m("a.navbar-link", currentWorkspace),
							m(
								".navbar-dropdown",
								workspaces.map(asWorkspaceLink)
							)
						)
					)
				)
			),
	};
};
