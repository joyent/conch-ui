import axios from 'axios';

export const get = (id) => {
    return axios({
        method: 'GET',
        url: '/validation'
    });
};

export default {
    get,
};
