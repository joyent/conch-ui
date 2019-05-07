import UserActionModal from '../UserActionModal.vue';
import { mount } from '@vue/test-utils';
import * as usersApi from '@api/users.js';

// Fixture
import users from '@src/__fixtures__/users.js';

jest.mock('@api/request.js');

describe('UserActionModal.vue', () => {
    let propsData;
    let wrapper;

    beforeEach(() => {
        propsData = { action: 'deactivate', user: users[0] };
        wrapper = mount(UserActionModal, { propsData });
    });

    test('should not display the success modal on initial render', () => {
        expect(wrapper.find('basemodal-stub').exists()).toBeFalsy();
    });

    test('should display the success modal when an action is successful', () => {
        wrapper.setData({ success: true });

        expect(wrapper.html()).toContain('Success!');
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
        test('should display warning text containing "demote" if the action prop is "demote"', () => {
            propsData.action = 'demote';
            wrapper = mount(UserActionModal, { propsData });

            expect(wrapper.find('.subtitle').html()).toContain('demote');
        });

        test('should display the fa-arrow-alt-circle-down icon if the action prop is "demote"', () => {
            wrapper.setProps({ action: 'demote'});

            expect(wrapper.find('.fa-arrow-alt-circle-down').exists()).toBeTruthy();
        });

        test('should call the demoteUser method when action prop is "demote" and confirm button is clicked', () => {
            const spy = jest.spyOn(usersApi, 'demoteUser');

            wrapper.setProps({ action: 'demote' });
            wrapper.find('a.confirm').trigger('click');

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('action "promote"', () => {
        test('should display warning text containing "promote" if the action prop is "promote"', () => {
            propsData.action = 'promote';
            wrapper = mount(UserActionModal, { propsData });

            expect(wrapper.find('.subtitle').html()).toContain('promote');
        });

        test('should display the fa-arrow-alt-circle-up icon if the action prop is "promote"', () => {
            wrapper.setProps({ action: 'promote'});

            expect(wrapper.find('.fa-arrow-alt-circle-up').exists()).toBeTruthy();
        });

        test('should call the promoteUser method when action prop is "promote" and confirm button is clicked', () => {
            const spy = jest.spyOn(usersApi, 'promoteUser');

            wrapper.setProps({ action: 'promote' });
            wrapper.find('a.confirm').trigger('click');

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('action "reset-pwd"', () => {
        test('should display warning text containing "reset" if the action prop is "reset-pwd"', () => {
            propsData.action = 'reset-pwd';
            wrapper = mount(UserActionModal, { propsData });

            expect(wrapper.find('.subtitle').html()).toContain('reset the password');
        });

        test('should display the fa-unlock-alt icon if the action prop is "reset-pwd"', () => {
            wrapper.setProps({ action: 'reset-pwd'});

            expect(wrapper.find('.fa-unlock-alt').exists()).toBeTruthy();
        });

        test('should call the forcePasswordChange method when action prop is "reset-pwd" and confirm button is clicked', () => {
            const spy = jest.spyOn(usersApi, 'forcePasswordChange');

            wrapper.setProps({ action: 'reset-pwd' });
            wrapper.find('a.confirm').trigger('click');

            expect(spy).toHaveBeenCalled();
        });
    });
});
