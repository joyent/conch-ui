import axios from 'axios';

export const get = () => {
    return axios({
        method: 'GET',
        url: '/validation'
    });
};

export default {
    get,
};
