import {
    clearToken,
    getToken,
    setToken,
    request,
    requestWithToken
} from './request.js';

export const isLoggedIn = () => !!getToken();

export const login = (data) => {
    return request({
        method: 'POST',
        url: '/login',
        data
    })
    .then(response => {
        const data = response.data;

        if (data && data.jwt_token) {
            setToken(data.jwt_token);
        }

        return data;
    });
};

// TODO: As of this moment the server doesn't require authentication for `/logout` but it probably should
export const logout = () => {
    return requestWithToken({
        method: 'POST',
        url: '/logout'
    })
    .then(clearToken());
};

export default {
    isLoggedIn,
    login,
    logout,
};
