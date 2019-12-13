import { requestWithToken } from './request.js';

/**
 * Add a device to a build
 *
 * @type   {POST}
 * @param  {String} buildId                 The ID of the build being updated
 * @param  {String} deviceId                The ID of the device being added
 * @return {Response Object}
 */
export const addDeviceToBuild = (buildId, deviceId) => {
    return requestWithToken({
        method: 'POST',
        url: `/build/${buildId}/device/${deviceId}`,
    });
};

/**
 * Add an organization to a build
 *
 * @type   {POST}
 * @param  {String} buildId                 The ID of the build being updated
 * @param  {String} organizationId          The ID of the organization being added
 * @param  {String} role                    This is the role of the organization
 * @return {Response Object}
 */
export const addOrganizationToBuild = (buildId, organizationId, role) => {
    return requestWithToken({
        method: 'POST',
        url: `/build/${buildId}/organization`,
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
 * Add a rack to a build
 *
 * @type   {POST}
 * @param  {String} buildId                 The ID of the build being updated
 * @param  {String} deviceId                The ID of the rack being added
 * @return {Response Object}
 */
export const addRackToBuild = (buildId, rackId) => {
    return requestWithToken({
        method: 'POST',
        url: `/build/${buildId}/rack/${rackId}`,
    });
};

/**
 * Add a user to an existing build
 *
 * @type {POST}
 * @param {String} buildId                  The ID of the build being updated
 * @param {String} userId                   The ID of the user being added
 * @param {String} role                     The role of the user for the build
 * @return {Response Object}
 */
export const addUserToBuild = (buildId, userId, role) => {
    return requestWithToken({
        method: 'POST',
        url: `/build/${buildId}/user`,
        data: {
            user_id: userId,
            role: role,
        },
        params: {
            send_mail: 1,
        },
    });
};

/**
 * Create a device and add it to an existing build
 *
 * @type {POST}
 * @param {String} buildId                  The ID of the build being updated
 * @param {String} serial_number            The serial number of the device
 * @param {String} sku                      The SKU of the device
 * @param {Array} links                     An array of relevant links for the device
 * @return {Response Object}
 */
export const createDeviceAddToBuild = (buildId, serial_number, sku, links) => {
    return requestWithToken({
        method: 'POST',
        url: `/build/${buildId}/device`,
        data: [
            {
                sku,
                serial_number,
                links,
            },
        ],
    });
};

/**
 * Create a new build
 *
 * @type  {POST}
 * @param {String} name                     The name of the build
 * @param {String} description              The description of the build
 * @param {Array} admins                    An array of admin users for the build
 * @return {Response Object}
 */
export const createBuild = (name, description, admins) => {
    return requestWithToken({
        method: 'POST',
        url: '/build',
        data: { name, description, admins },
    });
};

/**
 * Get a build
 *
 * @type {GET}
 * @param {String} buildId                  The ID of the build
 * @return {Response Object}
 */
export const getBuild = buildId => {
    return requestWithToken({
        method: 'GET',
        url: `/build/${buildId}`,
    });
};

/**
 * Get the devices of a build
 *
 * @type {GET}
 * @param {String} buildId                  The ID of the build
 * @return {Response Object}
 */
export const getBuildDevices = buildId => {
    return requestWithToken({
        method: 'GET',
        url: `/build/${buildId}/device`,
    });
};

/**
 * Get the organizations of a build
 *
 * @type {GET}
 * @param {String} buildId                  The ID of the build
 * @return {Response Object}
 */
export const getBuildOrganizations = buildId => {
    return requestWithToken({
        method: 'GET',
        url: `/build/${buildId}/organization`,
    });
};

/**
 * Get the racks of a build
 *
 * @type {GET}
 * @param {String} buildId                  The ID of the build
 * @return {Response Object}
 */
export const getBuildRacks = buildId => {
    return requestWithToken({
        method: 'GET',
        url: `/build/${buildId}/rack`,
    });
};

/**
 * Get the users of a build
 *
 * @type {GET}
 * @param {String} buildId                  The ID of the build
 * @return {Response Object}
 */
export const getBuildUsers = buildId => {
    return requestWithToken({
        method: 'GET',
        url: `/build/${buildId}/user`,
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

/**
 * Update a build
 *
 * @type {POST}
 * @param {String} buildId                  The ID of the build being updated
 * @param {JSON Object} updatedData         The data being updated. May include description, started (date-time), or completed (date-time)
 * @return {Response Object}
 */
export const updateBuild = (buildId, updatedData) => {
    const data = {};
    const { description, started, completed } = updatedData;

    if (description) {
        data.description = description;
    }

    if (updatedData.started) {
        data.started = started;
    }

    if (updatedData.completed) {
        data.completed = completed;
    }

    return requestWithToken({
        method: 'POST',
        url: `/build/${buildId}`,
        data,
    });
};

/**
 * Remove a device from a build
 *
 * @type {DELETE}
 * @param {String} buildId                  The ID of the build being updated
 * @param {String} deviceId                 The ID of the device being removed
 * @return {Response Object}
 */
export const removeDeviceFromBuild = (buildId, deviceId) => {
    return requestWithToken({
        method: 'DELETE',
        url: `/build/${buildId}/device/${deviceId}`,
    });
};

/**
 * Remove an organization from a build
 *
 * @type {DELETE}
 * @param {String} buildId                  The ID of the build being updated
 * @param {String} organizationId           The ID of the organization being removed
 * @return {Response Object}
 */
export const removeOrganizationFromBuild = (buildId, organizationId) => {
    return requestWithToken({
        method: 'DELETE',
        url: `/build/${buildId}/organization/${organizationId}`,
        params: {
            send_mail: 1,
        },
    });
};

/**
 * Remove a rack from a build
 *
 * @type {DELETE}
 * @param {String} buildId                  The ID of the build being updated
 * @param {String} rackId                   The ID of the rack being removed
 * @return {Response Object}
 */
export const removeRackFromBuild = (buildId, rackId) => {
    return requestWithToken({
        method: 'DELETE',
        url: `/build/${buildId}/rack/${rackId}`,
    });
};

/**
 * Remove a user from a build
 *
 * @type {DELETE}
 * @param {String} buildId                  The ID of the build being updated
 * @param {String} userId                   The ID of the user being removed
 * @return {Response Object}
 */
export const removeUserFromBuild = (buildId, userId) => {
    return requestWithToken({
        method: 'DELETE',
        url: `/build/${buildId}/user/${userId}`,
        params: {
            send_mail: 1,
        },
    });
};

export default {
    addDeviceToBuild,
    addOrganizationToBuild,
    addRackToBuild,
    addUserToBuild,
    createBuild,
    getBuild,
    getBuildDevices,
    getBuildOrganizations,
    getBuildRacks,
    getBuildUsers,
    getBuilds,
    removeDeviceFromBuild,
    removeOrganizationFromBuild,
    removeRackFromBuild,
    removeUserFromBuild,
    updateBuild,
};
