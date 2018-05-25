import m from "mithril";
import stream from "mithril/stream";

export default () => {
	const activeItem = stream();

	const menuItem = (name, link, ...children) => {
		let route = `/${m.route.param("wid")}/${link}`;
		return m(
			"li",
			m(
				`a[href=${route}]`,
				{
					oncreate: m.route.link,
					onclick: () => activeItem(link),
					class: m.route.get().startsWith(route) > 0 && "is-active",
				},
				name
			),
			children.length > 0 && m("ul", children)
		);
	};

	return {
		view: ({ attrs }) =>
			m(
				"aside.menu",
				m("p.menu-label", "General"),
				m(
					"ul.menu-list",
					menuItem("Status", "status"),
					menuItem("Datacenters", "datacenter"),
					menuItem(
						"Devices",
						"device",
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
