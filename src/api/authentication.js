import {
    clearToken,
    getToken,
    setToken,
    request,
    requestWithToken,
} from './request.js';
import store from '@src/store/store.js';

export const isLoggedIn = () => !!getToken();

/**
 * Login to Conch
 *
 * @param {String} email                    This is the user's email address
 * @param {String} password                 This is the user's password
 * @return {Response Object}
 */
export const login = (email, password) => {
    return request({
        method: 'POST',
        url: '/login',
        data: { email, password },
    }).then(response => {
        const data = response.data;

        if (data && data.jwt_token) {
            setToken(data.jwt_token);
        }

        store.dispatch('clearInvalidCredentials');

        return response;
    });
};

// TODO: As of this moment the server doesn't require authentication for `/logout` but it probably should
export const logout = () => {
    return requestWithToken({
        method: 'POST',
        url: '/logout',
    }).then(clearToken());
};

export default {
    isLoggedIn,
    login,
    logout,
};
