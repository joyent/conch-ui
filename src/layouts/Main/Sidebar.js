import m from "mithril";
import stream from "mithril/stream";
import ConchVersions from "../../models/ConchVersions";

export default () => {
	const activeItem = stream();
	let conchVersion = '';
	let conchUIVersion = '';
	let conchReleaseUrl = '';
	let conchUIReleaseUrl = '';

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
		oninit: () => {
			ConchVersions.getVersion('conch')
				.then(response => {
					conchVersion = response.tag_name;
					conchReleaseUrl = response.html_url;
				});
			ConchVersions.getVersion('conch-ui')
				.then(response => {
					conchUIVersion = response.tag_name;
					conchUIReleaseUrl = response.html_url;
				});
		},
		view: ({ attrs: { user }}) => {
			return m(
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
									user.logout().then(() => {
										m.route.set("/");
									});
								}
							},
							"Log out"
						)
					)
				),
				m("br"),
				m(".box.conch-versions", [
					m("p.heading", "Conch Versions:"),
					m(".tags-container", [
						m(".tags.has-addons", [
							m(".tag.is-primary", "conch-api"),
							m("a", { href: conchReleaseUrl, target: "_blank" },
								m(".tag.is-dark", conchVersion)
							)
						]),
						m(".tags.has-addons", [
							m(".tag.is-primary", "conch-ui"),
							m("a", { href: conchUIReleaseUrl, target: "_blank" },
								m(".tag.is-dark", conchUIVersion)
							)
						])
					])
				])
			)
		}
	};
};
