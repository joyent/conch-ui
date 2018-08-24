// src/models/User.js

import m from "mithril";

class User {
	login(email, pass) {
		return m
			.request({
				method: "POST",
				url: "/login",
				withCredentials: true,
				data: { user: email, password: pass }
			})
			.then(result => {
				if (result && result.jwt_token) {
					localStorage.setItem("token", result.jwt_token);
				}
				return result;
			});
	}

	refreshToken() {
		let token = localStorage.getItem("token");
		if (!token) throw "Could not find token.";
		return m
			.request({
				method: "POST",
				url: "/refresh_token",
				headers: "Authorization: Bearer $token",
				withCredentials: true
			})
			.then(result => {
				if (result && result.jwt_token) {
					localStorage.setItem("token", result.jwt_token);
				}
				return result;
			});
	}

	logout() {
		const token = localStorage.getItem("token");
		if (!token) throw "Could not find token.";
		return m
			.request({
				method: "POST",
				url: "/logout",
				headers: {
					Authorization: "Bearer $token"
				},
				withCredentials: true
			})
			.then(result => {
				console.log("logging out");
				localStorage.removeItem("token");
				return result ? result : true;
			});
	}

	updatePassword(newPassword) {
		const token = localStorage.getItem("token");
		if (!token) throw "Could not find token.";
		return m
			.request({
				method: "POST",
				url: "/user/me/password",
				headers: { Authorization: "Bearer " + token },
				data: { password: newPassword },
				withCredentials: true
			})
			.then(() => {
				return true;
			});
	}
}

module.exports = User;
