// src/models/Device
import Request from "util/Request";
import stream from "mithril/stream";

export default id => {
	const r = new Request();

	const loadDeviceSettings = device => {
		return r
			.requestWithToken({
				method: "GET",
				url: `/device/${device.id}/settings`
			})
			.then(raw => {
				// filter out non-tag settings
				Object.entries(raw)
					.sort()
					.map(([key, value]) => {
						key.indexOf("tag.") === 0
							? device.addTag([key, value])
							: (device.settings()[key] = value);
					});
				return Promise.resolve(raw);
			});
	};

	return {
		id: id,
		settings: stream({}),
		tags: stream([]),
        addTag(tuple) {
            this.tags.push(tuple);
        },
		getLocation() {
			r.requestWithToken({
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
			return loadDeviceSettings(this).then(() =>
				Promise.resolve(this.settings())
			);
		},
		getDeviceTags() {
			return loadDeviceSettings(this).then(() => Promise.resolve(this.tags()));
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
