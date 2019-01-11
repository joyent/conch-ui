import axios from 'axios';

export const getHardwareProduct = () => {
    return axios({
        method: 'GET',
        url: '/hardware_product',
    });
};

export default {
    getHardwareProduct,
};
