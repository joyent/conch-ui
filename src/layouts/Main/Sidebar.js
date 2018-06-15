import m from "mithril";
import stream from "mithril/stream";
import { conchApi } from "config";
import { request } from "mithril";

const MenuItem = {
	view: ({ attrs: { name, link }, children }) => {
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
					class: m.route.get().split("/")[2] === link && "is-active"
				},
				name
			),
			children.length > 0 && m("ul", children)
		);
	}
};

export default () => {
	const activeItem = stream();

	return {
		view: ({ attrs: { loggedIn } }) =>
			m(
				"aside.menu",
				m("p.menu-label", "Datacenter Builds"),
				m(
					"ul.menu-list",
					m(MenuItem, { name: "Status", link: "status" }),
					m(MenuItem, { name: "Browse", link: "datacenter" }),
					m(MenuItem, { name: "Devices", link: "device" })
				),
				m("p.menu-label", "Global Admin"),
				m(
					"ul.menu-list",
					m(MenuItem, {
						name: "Datacenter Designer",
						link: "designer"
					})
				),
				m("p.menu-label", "Conch"),
				m(
					"ul.menu-list",
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
