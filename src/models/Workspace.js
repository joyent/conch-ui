// src/models/Workspace.js

import Request from "util/Request";
import stream from "mithril/stream";
import moment from "moment";

export default id => {
	const r = new Request();

	const workspaces = stream([]);

	const currentWorkspace = stream();
	currentWorkspace.map(ws => {
		if (ws) localStorage.setItem("currentWorkspace", ws.id);
	});

	const loadAllWorkspaces = () => {
		return r
			.requestWithToken({
				method: "GET",
				url: "/workspace"
			})
			.then(workspaces);
	};

	const findWorkspaceById = id => workspaces().find(w => w.id === id);
	const findWorkspaceByName = name => workspaces().find(w => w.name === name);

	// TODO: I'm not sure this is really the right logic we should be using here
	// seems that we should just throw an error if we can't find the workspace in
	// question or return null or something
	const loadCurrentWorkspace = () =>
		loadAllWorkspaces().then(() => {
			let found;
			if (id) found = findWorkspaceById(id);
			if (!found)
				found = findWorkspaceById(
					localStorage.getItem("currentWorkspace")
				);
			if (!found) found = findWorkspaceByName("GLOBAL");
			if (!found) found = workspaces()[0];
			if (!found) return Promise.reject(id);
			return currentWorkspace(found);
		});

	return {
		currentWorkspace,
		workspaces,
		getAll: loadAllWorkspaces,
		loadAllWorkspaces,
		loadCurrentWorkspace,
		getDevices() {
			return r.requestWithToken({
				method: "GET",
				url: `/workspace/${id}/device`
			});
		},
		getAllRacks() {
			return r.requestWithToken({
				method: "GET",
				url: `/workspace/${id}/rack`
			});
		},
		getRackById(rackId) {
			return r
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
		},
		setRackLayout(rackId, layout) {
			return r.requestWithToken({
				method: "POST",
				url: `/workspace/${id}/rack/${rackId}/layout`,
				data: layout
			});
		}
	};
};
