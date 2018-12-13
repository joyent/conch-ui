// src/models/ConchVersions.js

import m from "mithril";

export const getVersion = (repository)=> {
	return m.request({
			method: "GET",
			url: `https://api.github.com/repos/joyent/${repository}/releases/latest`
		})
		.then(response => {
			return response;
		});
};

export default {
	getVersion,
};
