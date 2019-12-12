import isEmpty from 'lodash/isEmpty';
import { getAllRacks, getDevices } from '@api/workspaces.js';
import store from '@src/store/store.js';

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

export const getWorkspaceRacks = workspaceId => {
    const rackRooms = store.getters.getRackRoomsByWorkspace(workspaceId);

    if (!isEmpty(rackRooms)) {
        return Promise.resolve(Object.values(rackRooms)[0]);
    } else {
        return getAllRacks(workspaceId).then(response => {
            const rooms = response.data;
            const rackRooms = getRackRooms(rooms);
            let workspaceRackRooms = {};

            workspaceRackRooms[workspaceId] = rooms;

            store.dispatch('setRackRoomsByWorkspace', workspaceRackRooms);
            store.dispatch('setAllRooms', rackRooms);

            return rooms;
        });
    }
};

export const getWorkspaceDevices = workspaceId => {
    const devices = store.getters.getDevicesByWorkspace(workspaceId);

    if (!isEmpty(devices)) {
        return Promise.resolve(Object.values(devices)[0]);
    } else {
        return getDevices(workspaceId).then(response => {
            const devices = response.data;
            let workspaceDevices = {};

            store.dispatch('setDevices', devices);

            workspaceDevices[workspaceId] = devices;
            store.dispatch('setDevicesByWorkspace', workspaceDevices);

            return devices;
        });
    }
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
    getRackRooms,
    getWorkspaceDevices,
    getWorkspaceRacks,
    roomToProgress,
};
