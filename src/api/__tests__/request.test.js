import axios from 'axios';
import {
    clearToken,
    getToken,
    setToken,
    request,
    requestWithToken,
} from '../request.js';

jest.mock('axios');

describe('request API', () => {
    describe('setToken', () => {
        test('should set a token in session storage', () => {
            expect(localStorage.getItem('token')).toBeNull();
            setToken('my-token');
            expect(localStorage.getItem('token')).toEqual('my-token');

            localStorage.removeItem('token');
        });
    });

    describe('getToken', () => {
        test('should get a token from session storage', () => {
            localStorage.setItem('token', 'abcdefg');
            const token = getToken();

            expect(token).toEqual('abcdefg');
            localStorage.removeItem('token');
        });
    });

    describe('clearToken', () => {
        test('should clear token from session storage', () => {
            // Set token in session storage and assert it exists
            localStorage.setItem('token', '12345');
            expect(localStorage.getItem('token')).toEqual('12345');

            clearToken();
            expect(localStorage.getItem('token')).toBeNull();
            localStorage.removeItem('token');
        });
    });

    describe('request', () => {
        test('should return axios call with args', async () => {
            const args = {
                method: 'GET',
                url: '/do-nothing',
                data: {
                    user: 'user@joyent.com',
                    password: 'abcdefg',
                },
            };
            const response = {
                status: 200,
                data: { userId: '12345' },
            };

            axios.mockResolvedValueOnce(response);

            const req = await request(args);
            expect(req).toMatchObject(response);
        });
    });

    describe('requestWithToken', () => {
        let args;
        let response;

        beforeEach(() => {
            args = {
                method: 'GET',
                url: '/do-nothing',
                data: {
                    user: 'user@joyent.com',
                    password: 'abcdefg',
                },
            };
            response = {
                status: 200,
                data: { userId: '12345' },
            };
        });

        test('should return a promise rejection when token is not set in session storage', async () => {
            await expect(requestWithToken(args)).rejects.toEqual(false);
        });

        test('should call the request method with the Authorization header set in args', async () => {
            axios.mockResolvedValueOnce(response);
            localStorage.setItem('token', 'a1b2c3d4');

            const req = await requestWithToken(args);
            expect(req).toMatchObject(response);
        });
    });
});
