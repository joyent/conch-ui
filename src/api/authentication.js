import axios from 'axios';

export const login = (data) => {
    return axios({
        method: 'POST',
        url: '/login',
        data
    });
};

export const logout = () => {
    return axios({
        method: 'POST',
        url: '/logout'
    })
    .then(clearToken());
};

export const clearToken = () => {
    return localStorage.removeItem('token');
};

/* TODO: Should this be a Promise? */
export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const isLoggedIn = () => (getToken() ? true : false);

export default {
    getToken,
    isLoggedIn,
    login,
    setToken,
};
