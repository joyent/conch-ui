import { requestWithToken } from './request.js';

export const addUserToWorkspace = (workspaceId, data) => {
    return requestWithToken({
        method: 'POST',
        url: `/workspace/${workspaceId}/user`,
        data,
        params: {
            send_mail: 1,
        },
    });
};

export const getAllRacks = workspaceId => {
    return requestWithToken({
        method: 'GET',
        url: `/workspace/${workspaceId}/rack`,
    });
};

export const getDevices = workspaceId => {
    return requestWithToken({
        method: 'GET',
        url: `/workspace/${workspaceId}/device`,
    });
};

export const getRackById = (workspaceId, rackId) => {
    return requestWithToken({
        method: 'GET',
        url: `/workspace/${workspaceId}/rack/${rackId}`,
    }).then(response => {
        const data = response.data;

        if (data.slots) {
            data.slots = data.slots.reduce((obj, curr) => {
                obj[curr.rack_unit_start] = curr;
                return obj;
            }, {});
        }

        return Promise.resolve(data);
    });
};

export const loadAllWorkspaces = () => {
    return requestWithToken({
        method: 'GET',
        url: '/workspace',
    });
};

export const removeUserFromWorkspace = (workspaceId, userId) => {
    return requestWithToken({
        method: 'DELETE',
        url: `/workspace/${workspaceId}/user/${userId}`,
        params: {
            send_mail: 1,
        },
    });
};

export default {
    addUserToWorkspace,
    getAllRacks,
    getDevices,
    getRackById,
    loadAllWorkspaces,
    removeUserFromWorkspace,
};
