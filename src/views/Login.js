import m from "mithril";

import User from "models/User";
import Workspace from "models/Workspace";

export default () => {
	let badLoginAttempt = false;
	let emailAddress = "";
	let password = "";
	const user = new User();

	return {
		view() {
			return m(
				"section.hero.is-fullheight",
				m(
					".hero-body",
					m(
						".container.has-text-centered",
						m(".column.is-4.is-offset-4", [
							m(".box", [
								m("h3.title", "Login to Conch"),
								badLoginAttempt &&
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
													value: emailAddress,
													oninput: m.withAttr(
														"value",
														value =>
															(emailAddress = value)
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
													value: password,
													oninput: m.withAttr(
														"value",
														value =>
															(password = value)
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
											onclick(e) {
												e.target.classList.add(
													"is-loading"
												);
												e.preventDefault();
												user
													.login(
														emailAddress,
														password
													)
													.then(() => {
														badLoginAttempt = false;
														user.isForcePasswordChange()
															.then(isForcePasswordChange => {
																if (isForcePasswordChange) {
																	Workspace.loadAllWorkspaces()
																		.then(Workspace.findBestWorkspace)
																		.then(w => m.route.set(`/${w.id}/user`, {
																			forcePasswordUpdate: true
																		}));
																} else {
																	m.route.set("/");
																}
															});
													})
													.catch(() => {
														badLoginAttempt = true;
														password = "";
													})
													.then(() => {
														e.target.classList.remove(
															"is-loading"
														);
													});
											}
										},
										"Login"
									)
								)
							])
						])
					)
				)
			);
		}
	};
};
