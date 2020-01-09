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

export const getWorkspaceRacks = workspaceId => {
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

export const getWorkspaces = () => {
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
    getWorkspaceRacks,
    getDevices,
    getWorkspaces,
    removeUserFromWorkspace,
};
