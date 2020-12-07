import { requestWithToken } from './request.js';

/**
 * Get a data center
 *
 * @type   {GET}
 * @param {String} id                       ID of data center
 * @return {Response Object}
 */
export const getDataCenter = id => {
  return requestWithToken({
    method: 'GET',
    url: `/dc/${id}`,
  });
};

/**
 * Get the rooms of a data center
 *
 * @type   {GET}
 * @param {String} id                       ID of data center
 * @return {Response Object}
 */
export const getDataCenterRooms = id => {
  return requestWithToken({
    method: 'GET',
    url: `/dc/${id}/rooms`,
  });
};

/**
 * Get data centers
 *
 * @type   {GET}
 * @return {Response Object}
 */
export const getDataCenters = () => {
  return requestWithToken({
    method: 'GET',
    url: '/dc',
  });
};

export default { getDataCenter, getDataCenterRooms, getDataCenters };
