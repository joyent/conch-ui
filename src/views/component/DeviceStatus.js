import m from "mithril";
import Icons from "views/component//Icons";
import Device from "models/Device";

// Given a Device, renders icons in a <div> showing the current status.
export default {
	view: ({ attrs }) => {
		const device = attrs.device;
		if (device) {
			let healthIcon;
			const health = device.health.toLowerCase();
			if (health === "pass") {
				healthIcon = Icons.passValidation;
			} else if (health === "fail") {
				healthIcon = Icons.failValidation;
			} else {
				healthIcon = Icons.noReport;
			}

			return m(
				".device-status",
				healthIcon,
				Device.isActive(device) ? Icons.deviceReporting : null
			);
		}
		return m(".device-status");
	}
};
