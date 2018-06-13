import m from "mithril";

export default () => {
	let menuActive = false;

	const asWorkspaceLink = w =>
		m(
			"a.navbar-item",
			{
				onclick() {
					menuActive = false;
					const route = m.route.get();
					const nonWorkspaceRoute = route.substring(
						route.indexOf("/", 1)
					);
					m.route.set(`/${w.id}${nonWorkspaceRoute}`);
				}
			},
			w.name
		);

	return {
		view: ({ attrs: { currentWorkspace, workspaces } }) => {
			return m(
				".navbar[role=navigation]",
				m(
					".navbar-brand",
					m(".navbar-item", m("a.title", "Conch")),
					m(
						".navbar-burger",
						{
							onclick() {
								menuActive = !menuActive;
							},
							class: menuActive && "is-active"
						},
						m("span"),
						m("span"),
						m("span")
					)
				),
				m(
					".navbar-menu",
					{ class: menuActive && "is-active" },
					m(
						".navbar-end",
						m(
							".navbar-item.has-dropdown.is-hoverable",
							m("a.navbar-link", currentWorkspace().name),
							m(
								".navbar-dropdown.is-right",
								workspaces().map(asWorkspaceLink)
							)
						)
					)
				)
			);
		}
	};
};
