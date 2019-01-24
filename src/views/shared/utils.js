import moment from 'moment';

export const deviceToProgress = device => {
	if (device == null) {
        return 'unassigned';
    } else if (device.graduated) {
        return 'graduated';
    } else if (device.validated) {
        return 'validated';
    } else if (device.health.toLowerCase() === 'fail') {
        return 'failing';
    } else if (moment().diff(moment(device.last_seen), 'second') <= 300) {
        return 'active';
    }

	return 'in progress';
};

export const getRackRooms = rooms => {
    return Object.keys(rooms)
        .sort()
        .reduce((acc, name) => {
            let racks = rooms[name];
            let progress = roomToProgress(racks);
            acc.push({
                name,
                racks,
                progress,
            });

            return acc;
        }, []);
};

export const roomToProgress = racks => {
    if (racks.some(rack => rack['device_progress']['FAIL'])) {
        return 'failing';
    } else if (racks.some(rack => rack['device_progress']['PASS'])) {
        return 'in progress';
    } else if (racks.every(rack => rack['device_progress']['VALID'])) {
        return 'validated';
    }

    return 'not started';
};

export default {
    deviceToProgress,
    getRackRooms,
    roomToProgress,
};
