import { requestWithToken } from './request.js';

/**
 * Add an organization to a build
 *
 * @type   {POST}
 * @param  {int} buildId                    This is the buildId
 * @param  {int} organizationId             This is the organizationId
 * @param  {String} role                    This is the role of the organization
 * @return {Response Object}
 */
export const addOrganizationToBuild = (buildId, organizationId, role) => {
    return requestWithToken({
        method: 'POST',
        url: `/build/${buildId}/organization'`,
        data: {
            organization_id: organizationId,
            role,
        },
        params: {
            send_mail: 1,
        },
    });
};

/**
 * Get all builds
 *
 * @type   {GET}
 * @return {Response Object}
 */
export const getBuilds = () => {
    return requestWithToken({
        method: 'GET',
        url: '/build',
    });
};

export default { addOrganizationToBuild, getBuilds };
