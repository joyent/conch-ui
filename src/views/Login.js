import m from "mithril";

import { conchApi } from "config";

export default () => {
	let badLoginAttempt = false;
	let emailAddress = "";
	let password = "";

	const login = (email, pass) =>
		m
			.request({
				method: "POST",
				url: `${conchApi}/login`,
				withCredentials: true,
				data: { user: email, password: pass },
				extract(xhr) {
					return {
						status: xhr.status,
						body: xhr.response ? JSON.parse(xhr.response) : null
					};
				}
			})
			.catch(e => {
				if (e.status === 401) {
					this.reject();
				} else {
					throw e;
				}
			});

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
												login(emailAddress, password)
													.then(
														() => {
															badLoginAttempt = false;
															m.route.set(
																m.route.get()
															);
														},
														() => {
															badLoginAttempt = true;
															password = "";
														}
													)
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
