import UserModal from '../UserModal.vue';
import { shallowMount } from '@vue/test-utils';
import * as usersApi from '@api/users.js';

// Fixture
import users from '@src/__fixtures__/users.js';

jest.mock('@api/request.js');

describe('UserModal.vue', () => {
    let propsData;
    let user;
    let wrapper;

    beforeEach(() => {
        user = users[0];
        propsData = { action: 'create', user };
        wrapper = shallowMount(UserModal, { propsData });
    });

    // Helper function
    const clickCreateUser = () => {
        wrapper.find('a.create').trigger('click');
    };

    test('should not display the result modal on initial render', () => {
        expect(wrapper.find('resultmodal-stub').exists()).toBeFalsy();
    });

    test('should display the result modal when an action is completed', () => {
        wrapper.setData({ actionComplete: true });
        expect(wrapper.find('resultmodal-stub').exists()).toBeTruthy();
    });

    describe('method createUser', () => {
        test('should call createUser method when "Create User" button is clicked', () => {
            const spy = jest.spyOn(usersApi, 'createUser');
            const data = {
                email: 'user@joyent.com',
                name: 'New User',
                isAdmin: true,
                password: 'abcdefg',
            };

            wrapper.setData(data);
            clickCreateUser();

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('method editUser', () => {
        test('should call editUser method when "Save Changes" button is clicked', () => {
            const spy = jest.spyOn(usersApi, 'editUser');
            const data = {
                email: 'user@joyent.com',
                name: 'New User',
                isAdmin: true,
                password: 'abcdefg',
            };
            propsData.action = 'edit';
            wrapper = shallowMount(UserModal, { propsData })
            wrapper.setData(data);
            wrapper.find('a.edit').trigger('click');

            expect(spy).toHaveBeenCalled();
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

    describe('form input errors', () => {
        test('should not display any errors on initial render', () => {
            expect(wrapper.find('.error').exists()).toBeFalsy();
        });

        // REDO with field.input_name
        test('should display error messages for each text input field if they are submitted empty', () => {
            clickCreateUser();

            expect(wrapper.find('.field.name').find('.error').exists()).toBeTruthy();
            expect(wrapper.find('.field.email').find('.error').exists()).toBeTruthy();
            expect(wrapper.find('.field.password').find('.error').exists()).toBeTruthy();
        });

        test('should remove the error message for the name input if name is submitted', () => {
            const nameField = wrapper.find('.field.name');

            // Trigger error message
            clickCreateUser();

            // Set name and resubmit
            wrapper.setData({ name: 'User Name' });
            clickCreateUser();

            expect(nameField.find('.error').exists()).toBeFalsy();
        });

        test('should remove the error message for the email input if a valid email', () => {
            const emailField = wrapper.find('.field.email');

            // Trigger error message
            clickCreateUser();

            // Set email and resubmit
            wrapper.setData({ email: 'user@joyent.com' });
            clickCreateUser();

            expect(emailField.find('.error').exists()).toBeFalsy();
        });

        test('should remove the error message for the password input if a valid password is submitted', () => {
            const passwordField = wrapper.find('.field.password');

            // Trigger error message
            clickCreateUser();

            // Set password and resubmit
            wrapper.setData({ password: 'abcdefg' });
            clickCreateUser();

            expect(passwordField.find('.error').exists()).toBeFalsy();
        });
    });
});
