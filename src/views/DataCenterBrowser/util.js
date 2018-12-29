import moment from "moment";

export const deviceToProgress = device => {
	if (device == null) return "unassigned";
	if (device.graduated) return "graduated";
	if (device.validated) return "validated";
	if (device.health.toLowerCase() === "fail") return "failing";
	if (moment().diff(moment(device.last_seen), "second") <= 300)
		return "active";
	return "in progress";
};

export const rackToProgress = rack => {
	if (rack["device_progress"]["FAIL"]) {
		return "failing";
	} else if (rack["device_progress"]["PASS"]) {
		return "in progress";
	} else if (rack["device_progress"]["VALID"]) {
		return "validated";
	} else {
		return "not started";
	}
};

export default {
    deviceToProgress,
    rackToProgress,
};
