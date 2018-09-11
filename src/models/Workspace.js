// src/models/Workspace.js

import Request from "util/Request";
import stream from "mithril/stream";
import moment from "moment";

export default id => {
	const r = new Request();

	return {
		getAll() {
			return r.requestWithToken({
				method: "GET",
				url: "/workspace"
			});
		},
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
