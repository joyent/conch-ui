import m from "mithril";

export default model => {
	const menuItem = (name, link, ...children) =>
		m(
			"li",
			m(
				`a[href=/${m.route.param("wid")}/${link}]`,
				{
					oncreate: m.route.link,
					//class:
					//name.toLowerCase() === model.sidebar.active.toLowerCase() &&
					//"is-active",
				},
				name
			),
			children.length > 0 && m("ul", children)
		);

	return {
		view: ({ attrs }) =>
			m(
				"aside.menu",
				m("p.menu-label", "General"),
				m(
					"ul.menu-list",
					menuItem("Status", "status"),
					menuItem(
						"Datacenter",
						"datacenter",
						menuItem("Map", "rack"),
						menuItem("Rack Assignment", "rack")
					),
					menuItem(
						"Devices",
						"device",
						menuItem("Services"),
						menuItem("Inventory"),
						menuItem("Validation Status")
					),
					menuItem("Relays")
				),
				attrs.isWorkspaceAdmin && [
					m("p.menu-label", "Workspace Admin"),
					m(
						"ul.menu-list",
						menuItem("Users"),
						menuItem("Datacenter Racks")
					),
				],
				attrs.isGlobalAdmin && [
					m("p.menu-label", "Global Admin"),
					m(
						"ul.menu-list",
						menuItem("Datacenters"),
						menuItem("Validations"),
						menuItem("Hardware Products")
					),
				]
			),
	};
};
