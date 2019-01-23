import { clearToken, getToken, setToken, request, requestWithToken } from './request.js';

export const isLoggedIn = () => (getToken() ? true : false);

export const login = (data) => {
    return request({
        method: 'POST',
        url: '/login',
        data
    })
    .then(response => {
        let data = response.data;

        if (data && data.jwt_token) {
            setToken(data.jwt_token);
        }

        return data;
    });
};

export const logout = () => {
    return requestWithToken({
        method: 'POST',
        url: '/logout'
    })
    .then(clearToken());
};

export const updatePassword = (password) => {
    return requestWithToken({
        method: 'POST',
        url: '/user/me/password',
        data: { password }
    })
    .then(clearToken());
};

export default {
    isLoggedIn,
    login,
    logout,
    updatePassword,
};
