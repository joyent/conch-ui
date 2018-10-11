// src/models/Device

import Request from "util/Request";
import stream from "mithril/stream";
import moment from "moment";

export default id => {
	const r = new Request();

	return {
		id: id,
		getLocation() {
			return r.requestWithToken({
				method: "GET",
				url: `/device/${id}/location`
			});
		},
		getDeviceDetails() {
			return r.requestWithToken({
				method: "GET",
				url: "/device/" + id
			});
		},
		getDeviceSettings() {
			return r.requestWithToken({
				method: "GET",
				url: "/device/" + id + "/settings"
			});
		},
		getDeviceValidations() {
			return r.requestWithToken({
				method: "GET",
				url: `/device/${id}/validation_state`
			});
		},
		setAssetTag(assetTag) {
			return r.requestWithToken({
				method: "POST",
				url: `/device/${id}/asset_tag`,
				data: {
					asset_tag: assetTag
				},
				background: true
			});
		}
	};
};
