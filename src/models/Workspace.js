// src/models/Workspace.js

import Request from "util/Request";
import stream from "mithril/stream";
import moment from "moment";

const r = new Request();
const workspaces = stream([]);

const findBestWorkspace = ws => {
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

const bestFallback = workspaces.map(findBestWorkspace);

const Workspace = id => {
	if (!id) throw "ID required";

	const currentWorkspace =
		workspaces().find(w => w.id === id) || bestFallback();

	if (currentWorkspace)
		localStorage.setItem("currentWorkspace", currentWorkspace.id);

	const getDevices = () =>
		r.requestWithToken({
			method: "GET",
			url: `/workspace/${id}/device`
		});

	const getAllRacks = () =>
		r.requestWithToken({
			method: "GET",
			url: `/workspace/${id}/rack`
		});

	const getAll = () => Workspace.loadAllWorkspaces();

	// TODO: replace this with a method in `model/Racks.js` that calls the `/rack` endpoint instead
	const getRackById = rackId =>
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
			});

	// TODO: replace this with a method in `model/Racks.js` that calls the `/rack` endpoint instead
	const setRackLayout = (rackId, layout) =>
		r.requestWithToken({
			method: "POST",
			url: `/workspace/${id}/rack/${rackId}/layout`,
			data: layout
		});

	return Object.assign(
		{
			workspaces,
			getAllRacks,
			getDevices,
			getAll,
			getRackById,
			setRackLayout
		},
		currentWorkspace
	);
};

Workspace.findBestWorkspace = findBestWorkspace;

Workspace.loadAllWorkspaces = () => {
	return r
		.requestWithToken({
			method: "GET",
			url: "/workspace"
		})
		.then(workspaces);
};

Workspace.workspaces = workspaces;

export { Workspace as default };
