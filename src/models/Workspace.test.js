import Workspace from "models/Workspace";
import User from "models/User";

const GLOBAL_UUID = "496f76b4-8245-4d41-8d97-42fe988401c5";
const RACK_UUID = "84166602-5b56-447a-baa9-cd4624aa952e";

test.nock("workspace can getAll()", () => {
	expect.assertions(1);
	const user = new User();
	const ws = new Workspace(0);
	return user
		.login("chris.prather@joyent.com", "NewPassword")
		.then(() => ws.getAll())
		.then(res =>
			expect(res).toContainEqual({
				description: "Global workspace",
				id: GLOBAL_UUID,
				name: "GLOBAL",
				parent_id: null,
				role: "admin"
			})
		);
});

test.nock("we can load a specific worksapce", () => {
	expect.assertions(2);
	const user = new User();
	const ws = new Workspace(GLOBAL_UUID);
	return user
		.login("chris.prather@joyent.com", "NewPassword")
		.then(() => ws.loadCurrentWorkspace())
		.then(res => {
            expect(res).toMatchObject({id: GLOBAL_UUID});
			expect(ws.currentWorkspace()).toMatchObject({ id: GLOBAL_UUID });
		});
});

test.nock("we can get all devices in a workspace", () => {
	expect.assertions(1);
	const user = new User();
	const ws = new Workspace(GLOBAL_UUID);
	return user
		.login("chris.prather@joyent.com", "NewPassword")
		.then(() => ws.getDevices()) // this will load ever device in the system
		.then(res => {
			expect(res).toContainEqual({
				// this is a random device, and when we add better fixtures will fail
				asset_tag: null,
				created: "2017-09-07T08:23:01.585974Z",
				graduated: null,
				hardware_product: "a57dcc91-d744-4a34-82b8-45add5569caa",
				health: "PASS",
				hostname: null,
				id: "3P5VMK2",
				last_seen: "2018-05-16T17:29:06.394189Z",
				latest_triton_reboot: null,
				state: "ONLINE",
				system_uuid: "4c4c4544-0050-3510-8056-b3c04f4d4b32",
				triton_setup: null,
				triton_uuid: null,
				updated: "2017-09-23T15:41:02.765913Z",
				uptime_since: "2017-09-23T15:00:01.000Z",
				validated: "2017-12-01T15:31:50.344880Z"
			});
		});
});

test.nock("we can getAllRacks() in a workspace", () => {
	expect.assertions(1);
	const user = new User();
	const ws = new Workspace(GLOBAL_UUID);
	return user
		.login("chris.prather@joyent.com", "NewPassword")
		.then(() => ws.getAllRacks()) // this will load every rack in the system
		.then(res => {
			expect(res).toMatchObject({
				"arcadia-planitia-1a": expect.arrayContaining([
					{
						device_progress: {},
						id: RACK_UUID,
						name: "A01",
						role: "TRITON",
						size: 45
					}
				])
			});
		});
});

test.nock("we can getRackById() in a workspace", () => {
	expect.assertions(1);
	const user = new User();
	const ws = new Workspace(GLOBAL_UUID);
	return user
		.login("chris.prather@joyent.com", "NewPassword")
		.then(() => ws.getRackById(RACK_UUID))
		.then(res => {
			expect(res).toMatchObject({});
		});
});

//TODO setRackLayout() test
