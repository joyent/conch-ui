import { requestWithToken } from './request.js';

/**
 * Get all rooms
 *
 * @type   {GET}
 * @return {Response Object}
 */
export const getRooms = () => {
    return requestWithToken({
        method: 'GET',
        url: '/room',
    });
};

/**
 * Get the racks of a data center room
 *
 * @type   {GET}
 * @param {String} id                       ID of data center room
 * @return {Response Object}
 */
export const getDataCenterRoomRacks = id => {
    return requestWithToken({
        method: 'GET',
        url: `/room/${id}/rack`,
    });
};

/**
 * Get the devices of a rack
 *
 * @type   {GET}
 * @param {String} roomId                       ID of data center room
 * @param {String} rackId                       ID of the rack
 * @return {Response Object}
 */
export const getDataCenterRackAssignment = (roomId, rackId) => {
    return requestWithToken({
        method: 'GET',
        url: `/room/${roomId}/rack/${rackId}/assignment`,
    });
};

export default {
    getDataCenterRackAssignment,
    getDataCenterRoomRacks,
    getRooms,
};
