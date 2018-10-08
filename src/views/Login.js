import m from "mithril";
import stream from "mithril/stream";

import User from "models/User";

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
					badLoginAttempt(true);
					password("");
				})
				.then(auth => {
					badLoginAttempt(false);
					update({ auth });
				})
				.finally(() => e.target.classList.remove("is-loading"))
				.then(actions.loadDefaultPage);
		},
		loadDefaultPage: () => m.route.set("/")
	};

	return {
		name: "Login",
		navigatingTo: () => {},
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
