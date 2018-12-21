import axios from 'axios';

export const get = () => {
    return axios({
        method: 'GET',
        url: '/version'
    });
};

export default {
    get,
};
