import { requestWithToken } from './request.js';

export const getValidations = () => {
  return requestWithToken({
    method: 'GET',
    url: '/validation',
  });
};

export default {
  getValidations,
};
