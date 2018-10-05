import m from "mithril";
import stream from "mithril/stream";
import keyBy from "lodash/keyBy";

import User from "models/User";
import Workspaces from "models/WorkspaceList";

export default update => {
	const badLoginAttempt = stream(false);
	const emailAddress = stream();
	const password = stream();

	const user = new User();
	const actions = {
		login: e => {
			e.preventDefault();
			e.target.classList.add("is-loading");
			user
				.login(emailAddress(), password())
				.catch(() => {
					e.target.classList.remove("is-loading");
					badLoginAttempt(true);
					password("");
				})
				.then(() => {
					e.target.classList.remove("is-loading");
					badLoginAttempt(false);
					update({ loggedIn: true, hello: "world" });
				})
				.then(() => {
					Workspaces.getAll()
						.then(wss => keyBy(wss, "id"))
						.then(wss => update({ workspaces: wss }))
						.then(() => {
							m.route.set("/user");
						});
				});
		}
	};

	return {
		name: "Login",
		view({ attrs: { model } }) {
			return m(
				"section.hero.is-fullheight",
				m(
					".hero-body.container.has-text-centered.column.is-4.is-offset-4",
					[
						m(".box", [
							m("h3.title", "Login to Conch"),
							badLoginAttempt() &&
								m(
									"p.subtitle.has-text-warning",
									"Invalid email address or password"
								),
							m(
								"form",
								m(
									".field",
									m(
										".control",
										m(
											"input.input.is-info.is-fullwidth.is-rounded",
											{
												value: emailAddress(),
												oninput: m.withAttr(
													"value",
													emailAddress
												),
												type: "email",
												placeholder: "Email address"
											}
										)
									)
								),
								m(
									".field",
									m(
										".control",
										m(
											"input.input.is-info.is-fullwidth.is-rounded",
											{
												value: password(),
												oninput: m.withAttr(
													"value",
													password
												),
												type: "password",
												placeholder: "Password"
											}
										)
									)
								),
								m(
									"button[type=submit].button.is-primary.is-fullwidth",
									{
										onclick: actions.login
									},
									"Login"
								)
							)
						])
					]
				)
			);
		}
	};
};
