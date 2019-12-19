import SignIn from '../SignIn.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import * as authentication from '@api/authentication.js';
import * as conchApiVersion from '@api/conchApiVersion.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@api/request.js');
jest.mock('@api/authentication.js');
jest.mock('@api/conchApiVersion.js');

describe('SignIn.vue', () => {
    let actions;
    let mocks;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = {
            setCurrentUser: jest.fn(),
            setForcePasswordChange: jest.fn(),
            setGlobalWorkspaceId: jest.fn(),
        };
        mocks = { $router: [] };
        state = { workspaces: {} };
        store = new Vuex.Store({ actions, state });
        wrapper = shallowMount(SignIn, { localVue, mocks, store });
    });

    test('should not display error icons on initial render', () => {
        expect(
            wrapper.find('.material-icons.has-text-danger').exists()
        ).toBeFalsy();
    });

    test('should display error icons when bad input is entered', () => {
        wrapper.find('.button-sign-in').trigger('click');

        expect(
            wrapper.find('.material-icons.has-text-danger').exists()
        ).toBeTruthy();
    });

    test('should not display a disabled Login button on initial render', () => {
        expect(
            wrapper.find('.button-sign-in').attributes('disabled')
        ).toBeFalsy();
    });

    test('should call signIn method when Login button is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'signIn');
        wrapper.find('.button-sign-in').trigger('click');

        expect(spy).toHaveBeenCalled();
    });

    test('should call the login method', () => {
        const spy = jest.spyOn(authentication, 'login');

        wrapper.setData({
            emailAddress: 'validuser@joyent.com',
            password: 'goodPassword',
        });
        wrapper.find('.button-sign-in').trigger('click');

        expect(spy).toHaveBeenCalledWith(
            'validuser@joyent.com',
            'goodPassword'
        );
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
                wrapper.find('.button-sign-in').attributes('disabled')
            ).toBeTruthy();
        });
    });
});
