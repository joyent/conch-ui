import { requestWithToken } from './request.js';

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
 * Create a new organization
 *
 * @type   {POST}
 * @param  {String} name                    The name of the new organization
 * @param  {String} description             The description of the new organization
 * @param  {Array} admins                   An array of admin users for the organization
 * @return {Response Object}
 */
export const createOrganization = (name, description, admins) => {
    return requestWithToken({
        method: 'POST',
        url: '/organization',
        data: {
            name,
            description,
            admins,
        },
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
    addUserToOrganization,
    createOrganization,
    getOrganization,
    getOrganizations,
    removeUserFromOrganization,
};
