import { request } from './request.js';

export const getApiVersion = () => {
  return request({
    method: 'GET',
    url: '/version',
  });
};

export default {
  getApiVersion,
};
