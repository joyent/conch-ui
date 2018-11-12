export default () => {
	const token = "true";
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
							resolve({ jwt_token: token });
						}
					} else if (args.url == "/refresh_token") {
						resolve({ jwt_token: token });
					} else if (args.url == "/user/me/password") {
						resolve(true);
					} else if (args.url.match("/workspace/[^/]+/device$")) {
						resolve([
							{
								asset_tag: null,
								created: "2017-09-07T08:23:01.585974Z",
								graduated: null,
								hardware_product:
									// totally random UUID pulled from DDG
									"c9786257-5120-464e-8560-c02a7ff1decf",
								health: "PASS",
								hostname: null,
								id: "3P5VMK2",
								last_seen: "2018-05-16T17:29:06.394189Z",
								latest_triton_reboot: null,
								state: "ONLINE",
								system_uuid:
									// totally random UUID pulled from DDG
									"dd5908aa-c6d6-4ee3-bcfe-c4ac09369072",
								triton_setup: null,
								triton_uuid: null,
								updated: "2017-09-23T15:41:02.765913Z",
								uptime_since: "2017-09-23T15:00:01.000Z",
								validated: "2017-12-01T15:31:50.344880Z"
							}
						]);
					} else if (args.url.match("/workspace/[^/]+/rack$")) {
						resolve([
							{
								device_progress: { VALID: 13 },
								VALID: 13,
                                // Random UUID pulled from DDG
								id: "d0ecf8a2-fdf7-4ef8-8d7f-15986fa3fd85",
								name: "A01",
								role: "MANTA",
								size: 45
							}
						]);
					} else {
						reject(false);
					}
				});
			});
		}),
		getToken() {
			return token;
		},
		setToken(token) {
			return Promise.resolve(true);
		},
		clearToken(token) {
			return token;
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
