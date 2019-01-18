export const roomToProgress = racks => {
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

export default {
    roomToProgress,
};
