import { requestWithToken } from './request.js';

/**
 * Get all datacenter rooms
 *
 * @type   {GET}
 * @return {Response Object}
 */
export const getDatacenterRooms = () => {
    return requestWithToken({
        method: 'GET',
        url: '/room',
    });
};

export default { getDatacenterRooms };
