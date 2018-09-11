// src/models/Device

import Request from "util/Request";
import stream from "mithril/stream";

export default () => {
	const r = new Request();

	return {
		get() {
			return r.requestWithToken({
				method: "GET",
				url: "/hardware_product"
			});
		}
	};
};
