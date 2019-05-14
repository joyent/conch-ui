import { clearToken, request, requestWithToken } from './request.js';

export const createUser = (user) => {
    return requestWithToken({
        method: 'POST',
        url: '/user',
        data: user,
    })
    .catch(error => {
        return Promise.reject(error);
    });
};

export const deactivateUser = (userId, params) => {
    return requestWithToken({
        method: 'DELETE',
        url: `/user/${userId}`,
        params,
    });
};

export const demoteUser = (userId) => {
    return requestWithToken({
        method: 'POST',
        url: `/user/${userId}`,
        data: { is_admin: false },
    });
};

export const editUser = (user) => {
    const data = {};

    data.is_admin = user.is_admin;

    if (user.email) {
        data.email = user.email;
    }

    if (user.name) {
        data.name = user.name;
    }

    return requestWithToken({
        method: 'POST',
        url: `/user/${user.id}`,
        data
    })
    .catch(error => {
        return Promise.reject(error);
    });
};

export const forcePasswordChange = (userId) => {
    return requestWithToken({
        method: 'DELETE',
        url: `/user/${userId}/password`,
    });
};

export const getCurrentUser = () => {
    return request({
        method: 'GET',
        url: '/user/me',
    });
};

export const getUser = (userId) => {
    return request({
        method: 'GET',
        url: `/user/${userId}`,
    });
};

export const getUsers = () => {
    return requestWithToken({
        method: 'GET',
        url: '/user',
    });
};

export const promoteUser = (userId) => {
    return requestWithToken({
        method: 'POST',
        url: `/user/${userId}`,
        data: { is_admin: true },
    });
};

export const updatePassword = (password) => {
    return requestWithToken({
        method: 'POST',
        url: '/user/me/password',
        data: { password }
    })
    .then(clearToken());
};

// Tokens

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

// Used?
export const getToken = (name) => {
    return requestWithToken({
        method: 'GET',
        url: `/user/me/token/${name}`,
    });
};

// Profile page
export const getTokens = () => {
    return requestWithToken({
        method: 'GET',
        url: '/user/me/token',
    });
};

export const deleteUserToken = (name, userId) => {
    return requestWithToken({
        method: 'DELETE',
        url: `/user/${userId}/token/${name}`,
    });
};

export const deleteUserTokens = (userId, params) => {
    return requestWithToken({
        method: 'POST',
        url: `/user/${userId}/revoke`,
        params
    });
};

export const getUserTokens = (userId) => {
    return requestWithToken({
        method: 'GET',
        url: `/user/${userId}/token`,
    });
};


export default {
    createToken,
    deleteToken,
    getToken,
    getTokens,
    deleteUserToken,
    deleteUserTokens,

    createUser,
    deactivateUser,
    demoteUser,
    editUser,
    forcePasswordChange,
    getCurrentUser,
    getUser,
    getUsers,
    promoteUser,
    updatePassword,
};
