import User from "models/User";

test.nock("user throws on failure", () => {
	expect.assertions(1);
	const user = new User();
	return expect(user.login("", "")).rejects.toHaveProperty(
		"error",
		'unauthorized'
	);
});

test.nock("user handles bad password", () => {
	expect.assertions(1);
	const user = new User();
	return expect(
		user.login("chris.prather@joyent.com", "BAD PASSWORD")
	).rejects.toHaveProperty("error", "unauthorized");
});

test.nock("user handles login+logout", () => {
	expect.assertions(2);
	const user = new User();
	return user.login("chris.prather@joyent.com", "NewPassword").then(auth => {
        expect(auth.jwt_token).toMatch(/\w+/);
		return expect(user.logout()).resolves.toBeTruthy();
	});
});

test.nock("user handles token refresh", () => {
	expect.assertions(1);
	const user = new User();
	return user.login("chris.prather@joyent.com", "NewPassword").then(() => {
		return expect(user.refreshToken()).resolves.toBeTruthy();
	});
});

test.nock("user can update password", () => {
	expect.assertions(1);
	const user = new User();
	return user.login("chris.prather@joyent.com", "NewPassword").then(() => {
		return expect(user.updatePassword("NewPassword")).resolves.toBeTruthy();
	});
});
