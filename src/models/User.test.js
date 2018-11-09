import User from "models/User";
jest.mock("util/Request");

test("user throws on failure", () => {
	expect.assertions(1);
	const user = new User();
	return expect(user.login("", "")).rejects.toHaveProperty(
		"error",
		'"user" and "password" required'
	);
});

test("user handles bad password", () => {
	expect.assertions(1);
	const user = new User();
	return expect(
		user.login("chris.prather@joyent.com", "BAD PASSWORD")
	).rejects.toHaveProperty("error", "unauthorized");
});

test("user handles login+logout", () => {
	expect.assertions(2);
	const user = new User();
	return user.login("chris.prather@joyent.com", "NewPassword").then(auth => {
        expect(auth).toMatchObject({"jwt_token": "true"});
		return expect(user.logout()).resolves.toBeTruthy();
	});
});

test("user handles token refresh", () => {
	expect.assertions(1);
	const user = new User();
	return user.login("chris.prather@joyent.com", "NewPassword").then(() => {
		return expect(user.refreshToken()).resolves.toBeTruthy();
	});
});

test("user can update password", () => {
	expect.assertions(1);
	const user = new User();
	return user.login("chris.prather@joyent.com", "NewPassword").then(() => {
		return expect(user.updatePassword("NewPassword")).resolves.toBeTruthy();
	});
});
