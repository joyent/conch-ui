import m from "mithril";
import { conchApi } from "config";

const Auth = {
	loginEmail: "",
	password: "",
	_loggedIn: false,
	requireLogin(next) {
		if (Auth._loggedIn) return next();
		m
			.request({
				method: "GET",
				url: `${conchApi}/me`,
				withCredentials: true,
				extract(xhr) {
					return {
						status: xhr.status,
						body: xhr.response ? JSON.parse(xhr.response) : null
					};
				}
			})
			.then(_res => {
				Auth._loggedIn = true;
				return next();
			})
			.catch(e => {
				if (e.status === 401) {
					Auth._loggedIn = false;
					m.route.set("/login");
				} else {
					throw e;
				}
			});
	},
	setLoginEmail(value) {
		Auth.loginEmail = value;
	},
	setPassword(value) {
		Auth.password = value;
	},
	login() {
		return m
			.request({
				method: "POST",
				url: `${conchApi}/login`,
				withCredentials: true,
				data: { user: Auth.loginEmail, password: Auth.password },
				extract(xhr) {
					return {
						status: xhr.status,
						body: xhr.response ? JSON.parse(xhr.response) : null
					};
				}
			})
			.then(res => {
				Auth._loggedIn = true;
				Auth.loginEmail = "";
				Auth.password = "";
				return true;
			})
			.catch(e => {
				if (e.status === 401) {
					Auth.password = "";
					return false;
				} else {
					throw e;
				}
			});
	},
	logout() {
		return m
			.request({
				method: "POST",
				url: `${conchApi}/logout`,
				withCredentials: true
			})
			.then(res => {
				Auth._loggedIn = false;
			});
	}
};

export default Auth;
