// src/models/User.js

import Request from "util/Request";
import stream from "mithril/stream";

export default () => {
	const r = new Request();
	return {
		loggedIn: () => (r.getToken() ? true : false),

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
				return Promise.resolve(result);
			});
		},

		logout() {
            //TODO As of this moment the server doesn't require authentication for `/logout` but it probably should.
			return r
				.requestWithToken({
					method: "POST",
					url: "/logout"
				})
				.then(r.clearToken());
		},

		updatePassword(newPassword) {
			return r
				.requestWithToken({
					method: "POST",
					url: "/user/me/password",
					data: { password: newPassword }
				})
				.then(r.clearToken());
		}
	};
};
