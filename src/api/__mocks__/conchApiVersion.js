import { minimumApiVersion } from '@src/config.js';

export const getApiVersion = () => {
    return Promise.resolve({
        data: {
            version: minimumApiVersion,
        },
    });
};

export default { getApiVersion };
