import { requestWithToken } from './request.js';

/**
 * Get a datacenter room rack
 *
 * @type   {GET}
 * @param datacenterRoomId                  The id of the datacenter room the rack is in
 * @param rackId                            The id of the rack being retrieved
 * @return {Response Object}
 */
export const getDatacenterRoomRack = (datacenterRoomId, rackId) => {
    return requestWithToken({
        method: 'GET',
        url: `/room/${datacenterRoomId}/rack/${rackId}`,
    });
};

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

export default { getDatacenterRoomRack, getDatacenterRooms };
