import UserProfile from '../UserProfile.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('../../../api/request.js');

describe('UserProfile.vue', () => {
    let methods;
    let mocks;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        methods = { closeModal: jest.fn() };
        mocks = { $router: [] };
        state = {};
        store = new Vuex.Store({ state });
        wrapper = shallowMount(UserProfile, {
            localVue,
            methods,
            mocks,
            store,
        });
    });

    test('should display the account settings component on initial render', () => {
        expect(wrapper.find('accountsettingstab-stub').exists()).toBeTruthy();
    });

    test('should display the authentication tokens component when the tab is clicked', () => {
        wrapper.find('.tab-tokens').trigger('click');

        expect(
            wrapper.find('authenticationtokenstab-stub').exists()
        ).toBeTruthy();
    });

    describe('Password Reset Modal', () => {
        let actions;

        beforeEach(() => {
            actions = { clearForcePasswordChange: jest.fn() };
            methods = {
                closeModal: () => {
                    wrapper.vm.$data.showModal = false;
                },
            };
            mocks = { $router: [] };
            state = { forcePasswordChange: true };
            store = new Vuex.Store({ actions, state });
            wrapper = shallowMount(UserProfile, {
                localVue,
                methods,
                mocks,
                store,
            });
        });

        test('should display the forcePasswordChange modal when forcePasswordChange is true', () => {
            expect(wrapper.find('.modal').exists()).toBeTruthy();
        });

        test('should close modal when modal background is clicked', () => {
            wrapper.find('.modal-background').trigger('click');

            expect(wrapper.find('.modal').exists()).toBeFalsy();
        });

        test('should close modal when close (x) button is clicked', () => {
            wrapper.find('button.delete').trigger('click');

            expect(wrapper.find('.modal').exists()).toBeFalsy();
        });

        test('should close modal when the Update Password button is clicked', () => {
            wrapper.find('.update-password').trigger('click');

            expect(wrapper.find('.modal').exists()).toBeFalsy();
        });
    });
});
