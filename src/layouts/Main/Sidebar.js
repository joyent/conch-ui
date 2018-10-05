import m from "mithril";

export default update => {
	const actions = {
		navigateTo: route => e => {
			e.preventDefault;
			m.route.set(route);
		}
	};

	const menuItem = (name, route) => {
		return m(
			"li",
			m(
				`a[href=${route}]`,
				{
					// onupdate instead of oncreate required to update links
					// when currentWorkspace changes
                    onupdate: m.route.link,
                    oncreate: m.route.link,
					onclick: actions.navigateTo(route),
					class: m.route.get().startsWith(route) > 0 && "is-active"
				},
				name
			)
		);
	};

	return {
		view: ({ attrs: { model } }) => {
			const currentWorkspace = model.workspaces[model.currentWorkspace];
			const workspaceRoute = link => `/${currentWorkspace.id}` + link;
			return m(
				"aside.menu",
				m("p.menu-label", "Datacenter Builds"),
				m(
					"ul.menu-list",
					menuItem("Status", workspaceRoute("/status")),
					menuItem("Browse", workspaceRoute("/datacenter")),
					menuItem("Devices", workspaceRoute("/device"))
				),
				m("p.menu-label", "Conch"),
				m(
					"ul.menu-list",
					menuItem("Profile", "/user"),
					menuItem("Logout", "/logout")
				)
			);
		}
	};
};
