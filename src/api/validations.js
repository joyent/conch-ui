import axios from 'axios';

export const getValidations = () => {
    return axios({
        method: 'GET',
        url: '/validation'
    });
};

export default {
    getValidations,
};
