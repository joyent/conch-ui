import EditUserModal from '../EditUserModal.vue';
import { mount } from '@vue/test-utils';
import * as usersApi from '@api/users.js';

// Fixture
import users from '@src/__fixtures__/users.js';

jest.mock('@api/request.js');

describe('EditUserModal.vue', () => {
    let propsData;
    let user;
    let wrapper;

    beforeEach(() => {
        user = users[0];
        propsData = { action: 'create', user };
        wrapper = mount(EditUserModal, { propsData });
    });

    // Helper function
    const clickSaveChanges = () => {
        wrapper.find('a.edit').trigger('click');
    };

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
            wrapper = mount(EditUserModal, { propsData });
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
            wrapper.setData({ email: '' });
            wrapper.setData({ name: '' });

            clickSaveChanges();

            expect(
                wrapper
                    .find('.field.name')
                    .find('.error')
                    .exists()
            ).toBeTruthy();
            expect(
                wrapper
                    .find('.field.email')
                    .find('.error')
                    .exists()
            ).toBeTruthy();
        });

        test('should remove the error message for the name input if name is submitted', () => {
            const nameField = wrapper.find('.field.name');

            wrapper.setData({ name: '' });

            // Trigger error message
            clickSaveChanges();

            // Set name and resubmit
            wrapper.setData({ name: 'User Name' });
            clickSaveChanges();

            expect(nameField.find('.error').exists()).toBeFalsy();
        });

        test('should remove the error message for the email input if a valid email', () => {
            const emailField = wrapper.find('.field.email');

            wrapper.setData({ email: '' });

            // Trigger error message
            clickSaveChanges();

            // Set email and resubmit
            wrapper.setData({ email: 'user@joyent.com' });
            clickSaveChanges();

            expect(emailField.find('.error').exists()).toBeFalsy();
        });
    });
});
