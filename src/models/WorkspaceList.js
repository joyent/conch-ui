// src/models/Workspace.js
import Request from "util/Request";
const r = new Request();

export default {
	getAll() {
		return r.requestWithToken({
			method: "GET",
			url: "/workspace"
		});
	}
};
