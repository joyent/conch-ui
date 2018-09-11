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
		getRacks() {
			return r.requestWithToken({
				method: "GET",
				url: `/workspace/${id}/rack`
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
