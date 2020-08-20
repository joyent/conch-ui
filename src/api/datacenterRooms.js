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
 * Get a datacenter room using datacenter room ID
 *
 * @type   {GET}
 * @param id
 * @return {Response Object}
 */
export const getDatacenterRoom = (id) => {
    return requestWithToken({
        method: 'GET',
        url: `/room/${id}`,
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
