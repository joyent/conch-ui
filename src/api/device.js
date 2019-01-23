import { requestWithToken } from './request.js';

export const getDeviceDetails = (id) => {
    return requestWithToken({
        method: "GET",
        url: `/device/ ${id}`
    });
};

export const getDeviceSettings = (id) => {
    return requestWithToken({
        method: "GET",
        url: `/device/${id}/settings`
    });
};

export const getDeviceValidations = (id) => {
    return requestWithToken({
        method: 'GET',
        url: `/device/${id}/validation_state`
    });
};

export const getLocation = (id) => {
    return requestWithToken({
        method: "GET",
        url: `/device/${id}/location`
    });
};

export const setAssetTag = (id, assetTag) => {
    return requestWithToken({
        method: "POST",
        url: `/device/${id}/asset_tag`,
        data: {
            asset_tag: assetTag
        },
        background: true
    });
};

export default {
    getDeviceDetails,
    getDeviceSettings,
    getDeviceValidations,
    getLocation,
    setAssetTag,
};
