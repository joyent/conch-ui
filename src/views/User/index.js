import m from "mithril";
import { ViewTitleHero } from "views/component/";

let showModal = false;

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

export default () => {
	return {
		oninit: () => {
			showModal = m.route.param("forcePasswordUpdate");
		},
		view: ({ attrs: { user } }) => {
			return [
				m(ViewTitleHero, {
					title: "User profile",
					subtitle: "Update password and profile settings"
				}),
				m(statusTiles, { user }),
				showModal &&
					m(
						".modal.is-active",
						m(
							".modal-background",
							{
								onclick(e) {
									e.preventDefault();
									showModal = false;
								}
							}
						),
						m(
							".modal-card",
							m(
								"section.modal-card-body[style=padding:0px;]",
								m(
									"article.message.is-danger.is-medium",
									m(
										".message-header",
										m("p", "Password Update Required"),
										m(
											"button.delete.is-medium[aria-label=delete]",
											{
												onclick(e) {
													e.preventDefault();
													showModal = false;
												}
											}
										),
									),
									m(
										".message-body",
										m(
											"p[style=margin-bottom:20px;]",
											"Your password needs to be updated immediately."
										),
										m(
											"a.button.is-danger",
											{
												onclick(e) {
													e.preventDefault();
													showModal = false;
												}
											},
											"Update Password",
										),
									),
								),
							),
						),
					),
			];
		}
	};
};
