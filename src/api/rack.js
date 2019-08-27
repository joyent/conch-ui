import { requestWithToken } from './request.js';

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

export default { setRackPhase, updateRackAssignment };
