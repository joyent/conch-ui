import Device from "models/Device";
import User from "models/User";
//import m from "mithril";

jest.unmock("mithril");

test("can fetch a device", () => {
	const user = new User();
	/*
	m.request.mockReturnValueOnce(
		new Promise(resolve => {
			resolve({ jwt_token: "TOKEN_HERE" });
		})
	);
	m.request.mockReturnValueOnce(
		new Promise(resolve => {
			resolve(true);
		})
	);
    */
	expect.assertions(1);
	return user.login("chris.prather@joyent.com", "NewPassword").then(() => {
		const device = new Device("S17496627630011");
		return expect(device.ready()).resolves.toBeTruthy();
	});
});
