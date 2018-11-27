import Request from "util/Request";
import m from "mithril";

test.nock("request can make a plain request", () => {
	const r = new Request();
	return expect(
		r.request({
			method: "GET",
			url: "/version" // need a unsecured GET uri
		})
	).resolves.toBeTruthy();
});

test.nock("request can make fetch a new jwt", () => {
	expect.assertions(3);
	const r = new Request();
	return r
		.request({
			method: "POST",
			url: "/login",
			data: { user: "chris.prather@joyent.com", password: "NewPassword" }
		})
		.then(result => {
			expect(result).toHaveProperty("jwt_token");
			// test that we can store and retrieve the token
			// this serves as a backdoor promise so we can test alternates to window.localStorage
			expect(r.setToken(result.jwt_token)).toBeTruthy();
			expect(r.getToken()).toBe(result.jwt_token);
		});
});

test.nock("request can make fetch with jwt", () => {
	expect.assertions(1);
	const r = new Request();

	r
		.request({
			method: "POST",
			url: "/login",
			data: { user: "chris.prather@joyent.com", password: "NewPassword" }
		})
		.then(result => {
			r.setToken(result.jwt_token);
		});

	return expect(
		r.requestWithToken({
			method: "GET",
			url: "/me"
		})
	).resolves.toBe(null);
});

test.nock("request refresh a token", () => {
	expect.assertions(2);
	const r = new Request();
    let firstToken;
	return r
		.request({
			method: "POST",
			url: "/login",
			data: { user: "chris.prather@joyent.com", password: "NewPassword" }
		})
		.then(result => {
			r.setToken(result.jwt_token);
            firstToken = result.jwt_token
			return r.refreshToken(); // okay now we try refreshing the token
		})
		.then(() => {
			expect(r.getToken()).toBeTruthy(); // we should still have a token
			expect(r.getToken()).not.toBe(firstToken); // and it should be different
		});
});
