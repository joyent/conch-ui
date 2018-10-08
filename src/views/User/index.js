import m from "mithril";
import { ViewTitleHero } from "views/component/";

const StatusTile = {
	view: ({ children }) =>
		m(".tile.is-parent", m("article.tile.is-child.box", children))
};

const passwordTile = () => {
	let password = null;

	return {
		view: ({ attrs: { user } }) => {
			return m(StatusTile, [
				m("p.Title", "New Password"),
				m(
					"form",
					{
						onsubmit: e => {
							e.preventDefault();
							user.updatePassword(password).then(() => {
								m.route.set("/");
							});
						}
					},
					[
						m(
							"input.input.is-small[type=password][placeholder=New Password]",
							{
								oninput: m.withAttr("value", value => {
									password = value;
								}),
								value: password
							}
						),
						m("button[type=submit].button.is-primary", "Save")
					]
				)
			]);
		}
	};
};

const statusTiles = {
	view: ({ attrs: { user } }) =>
		m(
			"section.info-tiles",
			m(".tile"),
			m(".tile.is-ancestor", m(passwordTile, { user }), m(StatusTile))
		)
};

export default update => {
	return {
		name: "User",
		layout: true,
		view: ({ attrs: { model } }) => {
			return [
				m(ViewTitleHero, {
					title: "User profile",
					subtitle: "Update password and profile settings"
				}),
				m(statusTiles, { user: model.user })
			];
		}
	};
};
