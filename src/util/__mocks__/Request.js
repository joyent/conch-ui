export default () => {
	return {
		mockResponse: jest.fn(args => {
			const data = args.data;
			return new Promise((resolve, reject) => {
				process.nextTick(() => {
					if (args.url == "/logout") {
						resolve(true);
					} else if (args.url == "/login") {
						if (!data.user && !data.password) {
							reject({ error: '"user" and "password" required' });
						} else if (data.password != "NewPassword") {
							reject({ error: "unauthorized" });
						} else if (data.password == "NewPassword") {
							resolve({ jwt_token: "true" });
						}
					} else if (args.url == "/refresh_token") {
						resolve({ jwt_token: "true" });
					} else if (args.url == "/user/me/password") {
						resolve(true);
					} else {
						reject(false);
					}
				});
			});
		}),
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
			return this.mockResponse(args);
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
					return Promise.resolve(true);
				}
				return Promise.reject(false);
			});
		}
	};
};
