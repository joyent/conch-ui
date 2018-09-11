// src/models/User.js

import Request from "util/Request";
import stream from "mithril/stream";

export default () => {
	const r = new Request();
	return {
		loggedIn: stream(false),
		login(email, pass) {
			return r
				.request({
					method: "POST",
					url: "/login",
					data: { user: email, password: pass }
				})
				.then(result => {
					if (result && result.jwt_token) {
						r.setToken(result.jwt_token);
					}
					return result;
				});
		},

		refreshToken() {
			return r.refreshToken().then(result => {
				this.loggedIn(true);
				return Promise.resolve(result);
			});
		},

		logout() {
			return r
				.request({
					method: "POST",
					url: "/logout"
				})
				.then(result => {
					r.clearToken();
					this.loggedIn(false);
					return Promise.resolve(true);
				});
		},

		updatePassword(newPassword) {
			return r
				.request({
					method: "POST",
					url: "/user/me/password",
					data: { password: newPassword }
				})
				.then(() => {
					this.loggedIn(false);
					return Promise.resolve(true);
				});
		}
	};
};
