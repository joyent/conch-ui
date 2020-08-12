import { requestWithToken } from './request.js';

export const createHardwareProduct = data => {
    return requestWithToken({
        method: 'POST',
        url: '/hardware_product',
        data,
    });
};

export const deleteHardwareProduct = id => {
    return requestWithToken({
        method: 'DELETE',
        url: `/hardware_product/${id}`,
    });
};

export const editHardwareProduct = (id, data) => {
    return requestWithToken({
        method: 'POST',
        url: `/hardware_product/${id}`,
        data,
    });
};

export const getHardwareProduct = id => {
    return requestWithToken({
        method: 'GET',
        url: `/hardware_product/${id}`,
    });
};

export const getHardwareProducts = () => {
    return requestWithToken({
        method: 'GET',
        url: '/hardware_product',
    });
};

export default {
    createHardwareProduct,
    deleteHardwareProduct,
    editHardwareProduct,
    getHardwareProduct,
    getHardwareProducts,
};
