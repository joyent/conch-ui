import { requestWithToken } from './request.js';

/**
 * Get all racks
 *
 * @type   {GET}
 * @return {Response Object}
 */
export const getRacks = () => {
    return requestWithToken({
        method: 'GET',
        url: '/rack',
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

export default { getRacks, setRackPhase, updateRackAssignment };
