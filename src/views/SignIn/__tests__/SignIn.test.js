import SignIn from '../SignIn.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import * as authentication from '@api/authentication.js';
import * as users from '@api/users.js';
import * as conchApiVersion from '@api/conchApiVersion.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@api/request.js');
jest.mock('@api/authentication.js');
jest.mock('@api/conchApiVersion.js');

describe('SignIn.vue', () => {
    let actions;
    let getters;
    let mocks;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = {
            setCurrentUser: jest.fn(),
            setCurrentWorkspace: jest.fn(),
            setForcePasswordChange: jest.fn(),
            setWorkspaces: jest.fn(),
        };
        getters = {
            currentWorkspaceId: jest.fn(),
            loadCurrentWorkspace: jest.fn(),
        };
        mocks = { $router: [] };
        state = { workspaces: {} };
        store = new Vuex.Store({ actions, getters, state });
        wrapper = shallowMount(SignIn, { localVue, mocks, store });
    });

    test('should call signIn method when Login button is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'signIn');
        wrapper.find('button').trigger('click');

        expect(spy).toHaveBeenCalled();
    });

    test('should not display warning text on initial render', () => {
        expect(wrapper.html()).not.toContain(
            'Invalid email address or password'
        );
    });

    test('should not display a disabled Login button on initial render', () => {
        expect(
            wrapper.find('button.sign-in').attributes('disabled')
        ).toBeFalsy();
    });

    test('should display warning text when bad login info is submitted', () => {
        wrapper.vm.badLoginAttempt = true;
        expect(wrapper.html()).toContain('Invalid email address or password');
    });

    test('should display warning when empty input fields are submitted', () => {
        wrapper.find('button').trigger('click');

        expect(wrapper.html()).toContain('Invalid email address or password');
    });

    test('should call setForcePasswordChange method when force_password_change is true', async () => {
        jest.spyOn(users, 'getCurrentUser').mockReturnValueOnce(
            Promise.resolve({
                data: {
                    name: 'Valid User',
                    email: 'validuser@joyent.com',
                    password: 'abcdefg',
                    force_password_change: true,
                },
            })
        );

        wrapper.setData({
            emailAddress: 'validuser@joyent.com',
            password: 'goodPassword',
        });
        wrapper.find('button').trigger('click');

        await new Promise(resolve =>
            setTimeout(() => {
                expect(actions.setForcePasswordChange).toHaveBeenCalled();
                resolve();
            }, 100)
        );
    });

    test('should call the login method', () => {
        const spy = jest.spyOn(authentication, 'login');

        // Needed in order for test to pass. It seems like Jest doesn't know
        // how to handle getters that take arguments. It seems to identify such
        // calls as method calls and looks for a corresponding item in the
        // 'methods' object of the Vue component.
        Object.defineProperty(wrapper.vm, 'loadCurrentWorkspace', {
            value: jest.fn(),
        });

        wrapper.setData({
            emailAddress: 'validuser@joyent.com',
            password: 'goodPassword',
        });
        wrapper.find('button').trigger('click');

        expect(spy).toHaveBeenCalledWith({
            user: 'validuser@joyent.com',
            password: 'goodPassword',
        });
    });

    describe('bad API version', () => {
        beforeEach(() => {
            jest.spyOn(conchApiVersion, 'getApiVersion').mockReturnValue(
                Promise.resolve({
                    data: {
                        version: '2.25.0',
                    },
                })
            );

            wrapper = shallowMount(SignIn, { localVue, mocks, store });
        });

        test('should display a notification if API version does not meet requirements', () => {
            expect(
                wrapper.find('.api-version-notification').exists()
            ).toBeTruthy();
        });

        test('should disable login button if API version does not meet requirements', () => {
            expect(
                wrapper.find('button.sign-in').attributes('disabled')
            ).toBeTruthy();
        });
    });
});
