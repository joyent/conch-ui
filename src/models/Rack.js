// src/models/Rack.js

import Request from "util/Request";
import stream from "mithril/stream";

export default workspaceId => {
	const r = new Request();
	return {
		loadRack(id) {
			return r.requestWithToken({
				method: "GET",
				url: `/workspace/${workspaceId}/rack/${id}`
			});
		}
	};
};
