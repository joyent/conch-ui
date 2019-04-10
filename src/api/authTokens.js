import { requestWithToken } from './request.js';

export const createToken = (name) => {
    return requestWithToken({
        method: 'POST',
        url: '/user/me/token',
        data: { name },
    });
};

export const deleteToken = (name) => {
    return requestWithToken({
        method: 'DELETE',
        url: `/user/me/token/${name}`,
    });
};

export const getToken = (name) => {
    return requestWithToken({
        method: 'GET',
        url: `/user/me/token/${name}`,
    });
};

export const getTokens = () => {
    return requestWithToken({
        method: 'GET',
        url: '/user/me/tokens',
    });
};

export default { createToken, deleteToken, getToken, getTokens };
