import { requestWithToken } from './request.js';

/**
 * Add an organization
 *
 * @type   {POST}
 * @param  {JSON Object} data               JSON Object containing organization name, description and admin user list
 * @return {Response Object}
 */
export const addOrganization = data => {
    return requestWithToken({
        method: 'POST',
        url: '/organization',
        data,
    });
};

/**
 * Add a user to an organization
 *
 * @type   {POST}
 * @param  {int} organizationId             This is the organizationId
 * @param  {String} role                    This is the user's role in the organization
 * @param  {int} userId                     This is the userId
 * @return {Response Object}
 */
export const addUserToOrganization = (organizationId, role, userId) => {
    return requestWithToken({
        method: 'POST',
        url: `/organization/${organizationId}/user`,
        params: {
            send_mail: 1,
        },
        data: { role, user_id: userId },
    });
};

/**
 * Get an organization
 *
 * @type   {GET}
 * @param  {int} organizationId             This is the organizationId
 * @return {Response Object}
 */
export const getOrganization = organizationId => {
    return requestWithToken({
        method: 'GET',
        url: `/organization/${organizationId}`,
    });
};

/**
 * Get all organizations
 *
 * @type   {GET}
 * @return {Response Object}
 */
export const getOrganizations = () => {
    return requestWithToken({
        method: 'GET',
        url: '/organization',
    });
};

/**
 * Remove user from organization
 *
 * @type   {DELETE}
 * @param  {int} organizationId             This is the organizationId
 * @param  {int} userId                     This is the userId
 * @return {Response Object}
 */
export const removeUserFromOrganization = (organizationId, userId) => {
    return requestWithToken({
        method: 'DELETE',
        url: `/organization/${organizationId}/user/${userId}`,
        params: {
            send_mail: 1,
        },
    });
};

export default {
    addOrganization,
    addUserToOrganization,
    getOrganization,
    getOrganizations,
    removeUserFromOrganization,
};
