import axios from 'axios';

export const get = () => {
    return axios({
        method: 'GET',
        url: '/hardware_product',
    });
};

export default {
    get,
};
