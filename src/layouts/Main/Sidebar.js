import m from "mithril";
import stream from "mithril/stream";
import { conchApi } from "config";
import { request } from "mithril";

export default () => {
	const activeItem = stream();

	const menuItem = (name, link, ...children) => {
		let route = `/${m.route.param("wid")}/${link}`;
		return m(
			"li",
			m(
				`a[href=${route}]`,
				{
					// onupdate instead of oncreate required to update links
					// when currentWorkspace changes
					onupdate: m.route.link,
					onclick: () => activeItem(link),
					class: m.route.get().startsWith(route) > 0 && "is-active"
				},
				name
			),
			children.length > 0 && m("ul", children)
		);
	};

	return {
		view: ({ attrs: { loggedIn } }) =>
			m(
				"aside.menu",
				m("p.menu-label", "Datacenter Builds"),
				m(
					"ul.menu-list",
					menuItem("Status", "status"),
					menuItem("Browse", "datacenter"),
					menuItem("Devices", "device")
				),
				m("p.menu-label", "Conch"),
				m(
					"ul.menu-list",
                    menuItem("Profile", "user"),
					m(
						"li",
						m(
							"a",
							{
								onclick: () => {
									request({
										method: "POST",
										url: `${conchApi}/logout`,
										withCredentials: true
									}).then(() => {
										loggedIn(false);
										m.route.set("/");
									});
								}
							},
							"Log out"
						)
					)
				)
			)
	};
};
