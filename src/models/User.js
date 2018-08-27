// src/models/User.js

import Request from "util/Request";

export default () => {
	const r = new Request();
	return {
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
			return r.refreshToken();
		},

		logout() {
			return r
				.request({
					method: "POST",
					url: "/logout"
				})
				.then(result => {
					r.clearToken();
					return true;
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
					return true;
				});
		}
	};
};
