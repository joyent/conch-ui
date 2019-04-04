import { requestWithToken } from './request.js';

export const getHardwareProduct = () => {
    return requestWithToken({
        method: 'GET',
        url: '/hardware_product',
    });
};

export default {
    getHardwareProduct,
};
