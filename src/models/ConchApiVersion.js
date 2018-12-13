// src/models/ConchVersions.js

import Request from 'util/Request';

export const get = ()=> {
	const r = new Request();

	return r.request({
		method: "GET",
		url: `/version`
	});
};

export default {
	get,
};
