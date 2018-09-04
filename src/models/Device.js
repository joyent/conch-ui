// src/models/Device

import Request from "util/Request";
import stream from "mithril/stream";

export default id => {
	const r = new Request();
	return {
		id: id,
		settings: stream(),
		getDeviceDetails() {
			return r.requestWithToken({
				method: "GET",
				url: "/device/" + id
			});
		},
		getDeviceSettings() {
			return r
				.requestWithToken({
					method: "GET",
					url: "/device/" + id + "/settings"
				})
				.then(this.settings);
		}
	};
};
