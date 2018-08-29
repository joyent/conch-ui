import m from "mithril";

export default () => {
	return {
		getToken() {
			return localStorage.getItem("token");
		},
		setToken(token) {
			localStorage.setItem("token", token);
            return Promise.resolve(true);
		},
		clearToken(token) {
			return localStorage.removeItem("token");
		},
		request(args) {
			args.withCredentials = true;
			return m.request(args);
		},
		requestWithToken(args) {
			const token = this.getToken();
			if (!token) {
				throw "No Token!";
			}
			// TODO add support for headers being passed in
			args.headers = {
				Authorization: "Bearer " + token
			};
			return this.request(args);
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
				return Promise.reject(false);
			});
		}
	};
};
