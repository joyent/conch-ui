import m from "mithril";

export default () => {
	return {
		getToken() {
			return sessionStorage.getItem("token");
		},
		setToken(token) {
			sessionStorage.setItem("token", token);
			return Promise.resolve(true);
		},
		clearToken() {
			return sessionStorage.removeItem("token");
		},
		request(args) {
			args.withCredentials = true;
			return m.request(args);
		},
		requestWithToken(args) {
			const token = this.getToken();
			if (!token) {
				return Promise.reject(false);
			}
			// TODO add support for headers being passed in
			args.headers = {
				Authorization: "Bearer " + token
			};
			return this.request(args).catch(e => {
				this.clearToken();
				Promise.reject(e);
			});
		},
		refreshToken() {
			return this.requestWithToken({
				method: "POST",
				url: "/refresh_token"
			}).then(result => {
				if (result && result.jwt_token) {
					this.setToken(result.jwt_token);
					return Promise.resolve(result.jwt_token);
				}
				this.clearToken();
				return Promise.reject(false);
			});
		}
	};
};
