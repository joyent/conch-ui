// src/models/Device

import Request from "util/Request";
import stream from "mithril/stream";
import moment from "moment";

export default id => {
	const r = new Request();
	const o = {
		id: id,
		details: stream({}),
		settings: stream({}),
		interfaces() {
			if (!this.details().latest_report) {
				return {};
			}
			return this.details().latest_report.interfaces;
		},
		isFailing() {
			return this.health.toLowerCase() === "fail";
		},
		isPassing() {
			return this.health.toLowerCase() === "pass";
		},
		isHealthUnknown() {
			return this.health.toLowerCase() === "unknown";
		},
		isFirmwareUpdating() {
			return this.firmware_updating === "updating";
		},
		isValidated() {
			return this.validated;
		},
		isGraduated() {
			return this.graduated;
		},
		isTritonSetup() {
			return this.triton_setup;
		},
		uptimeSince() {
			return moment(this.uptime_since);
		},
		lastSeen() {
			return moment(this.last_seen);
		},
		rebootCount() {
			return this.settings()["build.reboot_count"] || 0;
		},
		isFirmwareCurrent() {
			return this.firmware === "current";
		},
		hasBurnInStarted() {
			return this.isFirmwareCurrent ? false : true;
		},
		tags() {
			// create a new object based on settings filtered for anything that starts with 'tag.';
			return Object.assign(
				...Object.keys(this.settings())
					.filter(key => key.indexOf("tag.") === 0)
					.map(key => ({ [key]: object[key] })),
				{}
			);
		},
		ready() {
            // capture device object so we can use it inside the functions below
			const device = this;
			return device.getDeviceDetails().then(ret => {
				// "lift" all the properties into first class properties
				Object.keys(ret).map(key =>
					device.liftProperty("details", key)
				);

				device.getDeviceSettings().then(ret => {
					Object.keys(ret).map(key =>
						device.liftProperty("settings", key)
					);
				});
			});
		},
		getDeviceDetails() {
			return r
				.requestWithToken({
					method: "GET",
					url: "/device/" + id
				})
				.then(this.details);
		},
		getDeviceSettings() {
			return r
				.requestWithToken({
					method: "GET",
					url: "/device/" + id + "/settings"
				})
				.then(this.settings);
		},
		liftProperty(attribute, key) {
			Object.defineProperty(this, key, {
				get: () => {
					const data = this[attribute];
					return data()[key];
				}
			});
		}
	};

	return o;
};
