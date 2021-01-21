import { requestWithToken } from './request.js';

export const createToken = name => {
  return requestWithToken({
    method: 'POST',
    url: '/user/me/token',
    data: { name },
  });
};

// system admin endpoint
export const createUser = user => {
  return requestWithToken({
    method: 'POST',
    url: '/user',
    data: user,
  }).catch(error => {
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

export const deleteToken = name => {
  return requestWithToken({
    method: 'DELETE',
    url: `/user/me/token/${name}`,
  });
};

export const demoteUser = userId => {
  return requestWithToken({
    method: 'POST',
    url: `/user/${userId}`,
    data: { is_admin: false },
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
    params,
  });
};

export const forcePasswordChange = userId => {
  return requestWithToken({
    method: 'DELETE',
    url: `/user/${userId}/password`,
  });
};

export const getCurrentUser = () => {
  return requestWithToken({
    method: 'GET',
    url: '/user/me',
  });
};

export const getToken = name => {
  return requestWithToken({
    method: 'GET',
    url: `/user/me/token/${name}`,
  });
};

export const getTokens = () => {
  return requestWithToken({
    method: 'GET',
    url: '/user/me/token',
  });
};

export const getUser = userId => {
  return requestWithToken({
    method: 'GET',
    url: `/user/${userId}`,
  });
};

export const getUserTokens = userId => {
  return requestWithToken({
    method: 'GET',
    url: `/user/${userId}/token`,
  });
};

// system admin endpoint
export const getUsers = () => {
  return requestWithToken({
    method: 'GET',
    url: '/user',
  });
};

export const promoteUser = userId => {
  return requestWithToken({
    method: 'POST',
    url: `/user/${userId}`,
    data: { is_admin: true },
  });
};

export const updateCurrentUser = (email, isAdmin, name) => {
  return requestWithToken({
    method: 'POST',
    url: '/user/me',
    data: {
      email,
      is_admin: isAdmin,
      name,
    },
    params: {
      send_mail: 1,
    },
  });
};

export const updatePassword = (password, params) => {
  return requestWithToken({
    method: 'POST',
    url: '/user/me/password',
    data: { password },
    params,
  });
};

export const updateUser = (userId, email, isAdmin, name) => {
  return requestWithToken({
    method: 'POST',
    url: `/user/${userId}`,
    data: {
      email,
      is_admin: isAdmin,
      name,
    },
    params: {
      send_mail: 1,
    },
  }).catch(error => {
    return Promise.reject(error);
  });
};

export default {
  createToken,
  createUser,
  deactivateUser,
  deleteToken,
  deleteUserToken,
  deleteUserTokens,
  demoteUser,
  forcePasswordChange,
  getCurrentUser,
  getToken,
  getTokens,
  getUser,
  getUsers,
  promoteUser,
  updatePassword,
  updateCurrentUser,
  updateUser,
};
