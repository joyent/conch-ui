import m from "mithril";
import { ViewTitleHero } from "views/component/";
import User from "models/User";

const StatusTile = {
	view: ({ children }) =>
		m(".tile.is-parent", m("article.tile.is-child.box", children))
};

const passwordTile = () => {
	let password = null;
    const user = new User;

	return {
		view: () => {
			return m(StatusTile, [
				m("p.Title", "Password"),
				m(
					"form",
					{
						onsubmit: e => {
							e.preventDefault();
							user.updatePassword(password);
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
	view: () =>
		m(
			"section.info-tiles",
			m(".tile"),
			m(".tile.is-ancestor", m(passwordTile), m(StatusTile))
		)
};

export default () => {
	return {
		view: () => {
			return [
				m(ViewTitleHero, {
					title: "User profile",
					subtitle: "Update password and profile settings"
				}),
				m(statusTiles)
			];
		}
	};
};
