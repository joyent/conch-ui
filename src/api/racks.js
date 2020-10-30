import { requestWithToken } from './request.js';

/**
 * Get rack
 *
 * @type   {GET}
 * @param rackId                            The id of the rack being retrieved
 * @return {Response Object}
 */
export const getRack = rackId => {
  return requestWithToken({
    method: 'GET',
    url: `/rack/${rackId}`,
  });
};

/**
 * Get the assignment of a rack
 *
 * @type   {GET}
 * @param rackId                            The id of the rack being retrieved
 * @return {Response Object}
 */
export const getRackAssignment = rackId => {
  return requestWithToken({
    method: 'GET',
    url: `/rack/${rackId}/assignment`,
  });
};

export const setRackPhase = (rackId, data, params) => {
  return requestWithToken({
    method: 'POST',
    url: `/rack/${rackId}/phase`,
    data,
    params,
  });
};

export const updateRackAssignment = (rackId, data) => {
  return requestWithToken({
    method: 'POST',
    url: `/rack/${rackId}/assignment`,
    data,
  });
};

export default {
  getRack,
  getRackAssignment,
  setRackPhase,
  updateRackAssignment,
};
