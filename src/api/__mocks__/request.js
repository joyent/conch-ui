import axios from 'axios';

jest.mock('axios');

axios.mockImplementation(args => {
    args.data = {};

    return Promise.resolve(args)
});

const token = true;

export const clearToken = () => {
    return token;
};

export const getToken = () => {
    return token;
};

export const setToken = () => {
    return Promise.resolve(true);
};

export const request = (args) => {
    args.withCredentials = true;
    return axios(args);
};

export const requestWithToken = (args) => {
    const token = getToken();

    if (!token) {
        return Promise.reject(false);
    }

    args.headers = {
        Authorization: `Bearer ${token}`
    };

    return request(args).catch(error => {
        clearToken();
        Promise.reject(error);
    });
};

export default {
    clearToken,
    getToken,
    setToken,
    request,
    requestWithToken,
};
