// src/models/Workspace.js

import Request from "util/Request";
import stream from "mithril/stream";
import moment from "moment";

const r = new Request();
const workspaces = stream();

const Workspace = id => {
	if (!id) throw "ID required";

	const currentWorkspace = workspaces.map(
		ws => ws && Workspace.findCurrentWorkspace(ws, id)
	);

	currentWorkspace.map(ws => {
		if (ws) localStorage.setItem("currentWorkspace", ws.id);
	});

	return {
		currentWorkspace,
		workspaces,
		getAll: () => Workspace.loadAllWorkspaces(),
		loadCurrentWorkspace: () => Workspace.loadAllWorkspaces(),
		getDevices: () =>
			r.requestWithToken({
				method: "GET",
				url: `/workspace/${id}/device`
			}),
		getAllRacks: () =>
			r.requestWithToken({
				method: "GET",
				url: `/workspace/${id}/rack`
			}),

        // TODO: replace this with a method in `model/Racks.js` that calls the `/rack` endpoint instead
		getRackById: rackId =>
			r
				.requestWithToken({
					method: "GET",
					url: `/workspace/${id}/rack/${rackId}`
				})
				.then(res => {
					res.slots = res.slots.reduce((obj, curr) => {
						obj[curr.rack_unit_start] = curr;
						return obj;
					}, {});
					return Promise.resolve(res);
				}),

        // TODO: replace this with a method in `model/Racks.js` that calls the `/rack` endpoint instead
		setRackLayout: (rackId, layout) =>
			r.requestWithToken({
				method: "POST",
				url: `/workspace/${id}/rack/${rackId}/layout`,
				data: layout
			})
	};
};

Workspace.findCurrentWorkspace = (ws, id) => {
	if (!ws) throw "Must supply workspaces";

	// check for the passed in workspace ID
	if (id) {
		let found = ws.find(w => w.id === id);
		if (found) return found;
	}

	// check for a stored ID
	const storedId = localStorage.getItem("currentWorkspace");

	if (storedId) {
		let found = ws.find(w => w.id === storedId);
		if (found) return found;
	}

	// check for GLOBAL
	const global = ws.find(w => w.name === "GLOBAL");
	if (global) return global;

	// just return the first one
	return ws[0];
};

Workspace.loadAllWorkspaces = () => {
	return r
		.requestWithToken({
			method: "GET",
			url: "/workspace"
		})
		.then(workspaces);
};

export { Workspace as default };
