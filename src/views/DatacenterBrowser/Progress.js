import m from "mithril";
import moment from "moment";


const deviceToProgress = device => {
    console.log(device);
	if (device == null) return "unassigned";
	if (device.validated) return "validated";
	if (device.health.toLowerCase() === "fail") return "failing";
    //if (moment().diff(moment(device.last_seen), "second") <= 300)
    if (device.last_seen != null)
        return "active";
	return "in progress";
};

const rackToProgress = rack => {
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

// A room is "failing" if one rack is failing, or "passing" if
// one rack is passing, or "validated" if *every* rack is
// validated. Otherwise, it's considered "not started".
const roomToProgress = racks => {
	if (racks.some(rack => rack["device_progress"]["FAIL"])) {
		return "failing";
	} else if (racks.some(rack => rack["device_progress"]["PASS"])) {
		return "in progress";
	} else if (racks.every(rack => rack["device_progress"]["VALID"])) {
		return "validated";
	} else {
		return "not started";
	}
};

const ProgressIcon = {
	view: ({ attrs: { progress } }) => {
		switch (progress) {
			case "failing":
				return m("span.has-text-danger", m("i.fas fa-exclamation"));
			case "in progress":
				return m("span.has-text-info", m("i.fas fa-spinner"));
            case "active":
                return m("span.has-text-info", m("i.fas fa-sync"));
			case "validated":
				return m("span", m("i.fas fa-check-circle"));
			default:
				return m("span", m("i.fas fa-ellipsis-h"));
		}
	}
};

export { ProgressIcon, deviceToProgress, rackToProgress, roomToProgress };
