import axios from 'axios';
import router from '@src/router.js';
import store from '@src/store/store.js';
import { logout } from '@api/authentication.js';

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
        let errorResponse;

        if (error.response) {
            errorResponse = error.response;
        } else {
            return Promise.reject(error);
        }

        if (errorResponse.status && errorResponse.status === 401) {
            logout()
                .then(() => {
                    store.dispatch('setInvalidCredentials');
                    router.push({ name: 'signIn' });
                });
        }

        return Promise.reject(errorResponse);
    });
};

export default {
    clearToken,
    getToken,
    setToken,
    request,
    requestWithToken,
};
