import { requestWithToken } from './request.js';

export const getAllRacks = id => {
    return requestWithToken({
        method: 'GET',
        url: `/workspace/${id}/rack`,
    });
};

export const getDevices = id => {
    return requestWithToken({
        method: 'GET',
        url: `/workspace/${id}/device`,
    });
};

export const getRackById = (id, rackId) => {
    return requestWithToken({
        method: 'GET',
        url: `/workspace/${id}/rack/${rackId}`,
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

export default {
    getAllRacks,
    getDevices,
    getRackById,
    loadAllWorkspaces,
};
