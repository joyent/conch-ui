import axios from 'axios';

export const getLocation = (id) => {
    return axios({
        method: 'GET',
        url: `/device${id}/location`
    });
};

export const getDeviceDetails = (id) => {
    return axios({
        method: 'GET',
        url: `/device/${id}`
    });
};

export const getDeviceSettings = (id) => {
    return axios({
        method: 'GET',
        url: `/device/${id}/settings`
    });
};

export const getDeviceValidations = (id) => {
    return axios({
        method: 'GET',
        url: `/device/${id}/validation_state`
    });
};

export const setAssetTag = (id, assetTag) => {
    return axios({
        method: 'POST',
        url: `/device/${id}/asset_tag`,
        data: {
            asset_tag: assetTag
        },
        background: true
    });
};

export default {
    getLocation,
    getDeviceDetails,
    getDeviceSettings,
    getDeviceValidations,
    setAssetTag,
};
