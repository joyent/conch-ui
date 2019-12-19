import isEmpty from 'lodash/isEmpty';
import { getDevices, getWorkspaces } from '@api/workspaces.js';
import store from '@src/store/store.js';

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

export const setGlobalWorkspaceId = () => {
    return getWorkspaces().then(response => {
        const globalWorkspaceId = response.data.find(
            workspace => workspace.name === 'GLOBAL'
        ).id;

        store.dispatch('setGlobalWorkspaceId', globalWorkspaceId);
    });
};

export default { getWorkspaceDevices, setGlobalWorkspaceId };
