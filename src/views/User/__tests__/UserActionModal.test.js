import UserActionModal from '../UserActionModal.vue';
import Vuex from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';
import * as usersApi from '@api/users.js';

// Fixture
import userAuthTokens from '@src/__fixtures__/userAuthTokens.js';
import users from '@src/__fixtures__/users.js';

jest.mock('@api/request.js');

describe('UserActionModal.vue', () => {
    let propsData;
    let wrapper;

    describe('success modal', () => {
        beforeEach(() => {
            propsData = { action: 'deactivate', user: users[0] };
            wrapper = mount(UserActionModal, { propsData });
        });

        test('should not display the success modal on initial render', () => {
            expect(wrapper.html()).not.toContain('Success!');
        });

        test('should display a success modal when an action is successful', () => {
            wrapper.setData({ success: true });

            expect(wrapper.html()).toContain('Success!');
        });
    });

    describe('closing the modal', () => {
        let spy;

        beforeEach(() => {
            spy = jest.spyOn(wrapper.vm, 'closeModal');
        });

        test('should close the modal when modal background is clicked', () => {
            wrapper.find('.modal-background').trigger('click');

            expect(spy).toHaveBeenCalled();
        });

        test('should close the modal when modal close button is clicked', () => {
            wrapper.find('button.delete').trigger('click');

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('action "deactivate"', () => {
        test('should display warning text containing "deactivate" if the action prop is "deactivate"', () => {
            expect(wrapper.find('.subtitle').html()).toContain('deactivate');
        });

        test('should display the fa-user-slash icon if the action prop is "deactivate"', () => {
            expect(wrapper.find('.fa-user-slash').exists()).toBeTruthy();
        });

        test('should call the deactivateUser method when action prop is "deactivate" and confirm button is clicked', () => {
            const spy = jest.spyOn(usersApi, 'deactivateUser');

            wrapper.find('a.confirm').trigger('click');

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('action "demote"', () => {
        beforeEach(() => {
            propsData.action = 'demote';
            wrapper = mount(UserActionModal, { propsData });
        });

        test('should display warning text containing "demote" if the action prop is "demote"', () => {
            wrapper = mount(UserActionModal, { propsData });

            expect(wrapper.find('.subtitle').html()).toContain('demote');
        });

        test('should display the fa-arrow-alt-circle-down icon if the action prop is "demote"', () => {
            expect(wrapper.find('.fa-arrow-alt-circle-down').exists()).toBeTruthy();
        });

        test('should call the demoteUser method when action prop is "demote" and confirm button is clicked', () => {
            const spy = jest.spyOn(usersApi, 'demoteUser');
            wrapper.find('a.confirm').trigger('click');

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('action "promote"', () => {
        beforeEach(() => {
            propsData.action = 'promote';
            wrapper = mount(UserActionModal, { propsData });
        });

        test('should display warning text containing "promote" if the action prop is "promote"', () => {
            wrapper = mount(UserActionModal, { propsData });

            expect(wrapper.find('.subtitle').html()).toContain('promote');
        });

        test('should display the fa-arrow-alt-circle-up icon if the action prop is "promote"', () => {
            expect(wrapper.find('.fa-arrow-alt-circle-up').exists()).toBeTruthy();
        });

        test('should call the promoteUser method when action prop is "promote" and confirm button is clicked', () => {
            const spy = jest.spyOn(usersApi, 'promoteUser');
            wrapper.find('a.confirm').trigger('click');

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('action "reset-pwd"', () => {
        beforeEach(() => {
            propsData.action = 'reset-pwd';
            wrapper = mount(UserActionModal, { propsData });
        });

        test('should display warning containing "reset" when action prop is "reset-pwd"', () => {
            expect(wrapper.find('.subtitle').html()).toContain('reset the password');
        });

        test('should display the fa-unlock-alt icon if the action prop is "reset-pwd"', () => {
            expect(wrapper.find('.fa-unlock-alt').exists()).toBeTruthy();
        });

        test('should call the forcePasswordChange method when action prop is "reset-pwd" and confirm button is clicked', () => {
            const spy = jest.spyOn(usersApi, 'forcePasswordChange');

            wrapper.find('a.confirm').trigger('click');

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('action "delete-auth-tokens"', () => {
        let state;
        let store;
        const localVue = createLocalVue();
        localVue.use(Vuex);

        jest.spyOn(usersApi, 'getUserTokens').mockReturnValue(
            Promise.resolve({
                data: userAuthTokens,
            })
        );

        beforeEach(() => {
            propsData.action = 'delete-auth-tokens';
            state = { currentUser: users[1] };
            store = new Vuex.Store({ state });

            wrapper = mount(UserActionModal, { localVue, propsData, store });
        });

        test('should display warning containing "delete the auth tokens" when action prop is "delete-auth-tokens"', async () => {
            expect(wrapper.find('.subtitle').html()).toContain('delete the auth tokens');
        });

        test('should display the fa-times-circle icon when action prop is "delete-auth-tokens"', async () => {
            expect(wrapper.find('.fa-times-circle').exists()).toBeTruthy();
        });

        test('should call the deleteUserTokens method when action prop is "delete-auth-tokens" and confirm button is clicked', () => {
            const spy = jest.spyOn(usersApi, 'deleteUserTokens');
            wrapper.find('a.confirm').trigger('click');

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('action "delete-login-tokens"', () => {
        beforeEach(() => {
            propsData.action = 'delete-login-tokens';
            wrapper = mount(UserActionModal, { propsData });
        });

        test('should display warning text containing "delete the login tokens" when action prop is "delete-login-tokens"', async () => {
            expect(wrapper.find('.subtitle').html()).toContain('delete the login tokens');
        });

        test('should display the fa-times-circle icon when action prop is "delete-login-tokens"', () => {
            expect(wrapper.find('.fa-times-circle').exists()).toBeTruthy();
        });

        test('should call the deleteUserTokens method when action prop is "delete-login-tokens" and confirm button is clicked', () => {
            const spy = jest.spyOn(usersApi, 'deleteUserTokens');

            wrapper.find('a.confirm').trigger('click');

            expect(spy).toHaveBeenCalled();
        });
    });
});
