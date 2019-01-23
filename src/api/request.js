import axios from 'axios';

export const clearToken = () => {
    return localStorage.removeItem('token');
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const setToken = (token) => {
    localStorage.setItem('token', token);
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
