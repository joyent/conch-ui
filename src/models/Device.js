// src/models/Device

import Request from "util/Request";
import stream from "mithril/stream";
import moment from "moment";

export default id => {
	const r = new Request();

	const liftProperty = (object, attribute, key) => {
		Object.defineProperty(object, key, {
			get: () => {
				const data = object[attribute];
				return data()[key];
			}
		});
	};

	const getDeviceDetails = device => {
		return r
			.requestWithToken({
				method: "GET",
				url: "/device/" + id
			})
			.then(device.details);
	};

	const getDeviceSettings = device => {
		return r
			.requestWithToken({
				method: "GET",
				url: "/device/" + id + "/settings"
			})
			.then(res => {
				// filter out non-tag settings
				Object.entries(res)
					.sort()
					.map(([key, value]) => {
						key.indexOf("tag.") === 0
							? device.tags().push([key, value])
							: (device.settings()[key] = value);
					});
				return res;
			});
	};

	return {
		id: id,
		details: stream({}),
		settings: stream({}),
		tags: stream([]),
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
		ready() {
			// capture device object so we can use it inside the functions below
			const device = this;
			return getDeviceDetails(device).then(ret => {
				// "lift" all the properties into first class properties
				Object.keys(ret).map(key =>
					liftProperty(device, "details", key)
				);

				getDeviceSettings(device).then(ret => {
					Object.keys(ret).map(key =>
						liftProperty(device, "settings", key)
					);
				});
                return true;
			});
		}
	};
};
