import * as authentication from '../authentication.js';

jest.mock('../authentication.js');

describe('authentication API', () => {
    const errorCredentialsRequired = {
        error: '"user" and "password" are both required',
    };
    const errorUnauthorized = { error: 'unauthorized' };
    const errorPwdLength = { error: 'Password must be at least 5 characters' };

    describe('login', () => {
        let data;

        beforeEach(() => {
            data = { password: '', user: '' };
        });

        test('should return an error if user is empty', () => {
            expect.assertions(1);
            data = { password: 'goodPassword' };
            return expect(authentication.login(data)).rejects.toMatchObject(
                errorCredentialsRequired
            );
        });

        test('should return an error if password is empty', () => {
            expect.assertions(1);
            data = { user: 'validuser@joyent.com' };
            return expect(authentication.login(data)).rejects.toMatchObject(
                errorCredentialsRequired
            );
        });

        test('should return an error if password is not at least 5 characters', () => {
            expect.assertions(1);
            data = { password: 'abcd', user: 'validuser@joyent.com' };
            return expect(authentication.login(data)).rejects.toMatchObject(
                errorPwdLength
            );
        });

        test('should return an error if password does not have a match in the db', () => {
            expect.assertions(1);
            data = { password: 'badPassword', user: 'validuser@joyent.com' };
            return expect(authentication.login(data)).rejects.toMatchObject(
                errorUnauthorized
            );
        });

        test('should return an error if the user does not have a match in the db', () => {
            expect.assertions(1);
            data = { password: 'goodPassword', user: 'user@joyent.com' };
            return expect(authentication.login(data)).rejects.toMatchObject(
                errorUnauthorized
            );
        });

        test('should return jwt_token upon successful login', () => {
            expect.assertions(1);
            data = { password: 'goodPassword', user: 'validuser@joyent.com' };
            return expect(authentication.login(data)).resolves.toMatchObject({
                jwt_token: true,
            });
        });
    });

    describe('logout', () => {
        test('should return true upon successful logout', () => {
            expect.assertions(1);
            return expect(authentication.logout()).resolves.toBeTruthy();
        });
    });

    describe('isLoggedIn', () => {
        let data;

        beforeEach(() => {
            data = { user: '', password: '' };
        });

        test('should return true if user is logged in', async () => {
            expect.assertions(1);
            data = { user: 'validuser@joyent.com', password: 'goodPassword' };
            const login = await authentication.login(data);

            expect(authentication.isLoggedIn(login)).resolves.toBeTruthy();
        });

        test('should return rejected promise if user is not logged in', () => {
            expect.assertions(1);
            return expect(authentication.isLoggedIn(null)).rejects.toEqual(
                false
            );
        });
    });
});
