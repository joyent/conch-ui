export const isForcePasswordChange = () => {
    return Promise.resolve(true);
};

export const isLoggedIn = token => (
    !!token ? Promise.resolve(true) : Promise.reject(false)
);

export const login = (data) => {
    return new Promise((resolve, reject) => {
        const { user, password } = data;

        if (!user || !password) {
            reject({ error: '"user" and "password" are both required' });
        } else if (user !== 'validuser@joyent.com') {
            reject({ error: 'unauthorized' });
        } else if (password.length < 5) {
            reject({ error: 'Password must be at least 5 characters' });
        } else if (password !== 'goodPassword') {
            reject({ error: 'unauthorized' });
        }

        resolve({ jwt_token: true });
    });
};

export const logout = () => (Promise.resolve(true));

export const updatePassword = (password) => {
    return new Promise((resolve, reject) => {
        if (password.length < 5) {
            reject({ error: 'Password must be at least 5 characters' });
        }

        resolve(true);
    });
};

export default {
    isForcePasswordChange,
    isLoggedIn,
    login,
    logout,
    updatePassword,
};
