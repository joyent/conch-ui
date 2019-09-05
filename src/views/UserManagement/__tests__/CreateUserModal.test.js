import CreateUserModal from '../CreateUserModal.vue';
import Vuex from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';
import * as usersApi from '@api/users.js';

// Fixture
import users from '@src/__fixtures__/users.js';
import workspaces from '@src/__fixtures__/workspaces.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@api/request.js');

describe('CreateUserModal.vue', () => {
    let propsData;
    let state;
    let store;
    let user;
    let wrapper;

    beforeEach(() => {
        state = { workspaces };
        user = users[0];
        propsData = { user };
        store = new Vuex.Store({ state });
        wrapper = mount(CreateUserModal, { localVue, propsData, store });
    });

    const clickCreateUser = () => {
        wrapper.find('a.create').trigger('click');
    };

    const clickAddWorkspaces = () => {
        wrapper.find('a.add-workspaces').trigger('click');
    };

    describe('initial render', () => {
        test('should not display workspace selection on initial render', () => {
            expect(wrapper.find('h1.title').text()).not.toEqual(
                'Add User to Workspaces'
            );
        });
    });

    describe('workspace selection', () => {
        beforeEach(() => {
            const data = {
                email: 'user@joyent.com',
                name: 'New User',
                isAdmin: true,
                password: 'abcdefg',
            };

            wrapper.setData(data);
            clickAddWorkspaces();
        });

        // Helper function
        const clickWorkspaceCheckbox = () => {
            wrapper
                .findAll('.checkbox-round')
                .at(0)
                .trigger('click');
        };

        test('should switch to the workspace selection pane after valid user info is submitted', () => {
            expect(wrapper.find('h1.title').text()).toEqual(
                'Add User to Workspaces'
            );
        });

        test('should not display any permissions selectors on initial render', () => {
            expect(wrapper.find('.select.permissions').exists()).toBeFalsy();
        });

        test('should display permissions selector when a workspace is selected', () => {
            clickWorkspaceCheckbox();
            expect(wrapper.find('.select.permissions').exists()).toBeTruthy();
        });

        test('should not display a permissions selector when a workspace is deselected', () => {
            clickWorkspaceCheckbox();
            clickWorkspaceCheckbox();

            expect(wrapper.find('.select.permissions').exists()).toBeFalsy();
        });

        test('should filter workspace results when search text is entered', () => {
            wrapper.find('input.search').setValue('Conch');

            expect(wrapper.findAll('tr.workspace')).toHaveLength(2);
        });

        test('should call the createUser method', () => {
            const spy = jest.spyOn(usersApi, 'createUser');

            clickCreateUser();

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
            clickAddWorkspaces();

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
            expect(
                wrapper
                    .find('.field.password')
                    .find('.error')
                    .exists()
            ).toBeTruthy();
        });

        test('should remove the error message for the name input if name is submitted', () => {
            const nameField = wrapper.find('.field.name');

            // Trigger error message
            clickAddWorkspaces();

            // Set name and resubmit
            wrapper.setData({ name: 'User Name' });
            clickAddWorkspaces();

            expect(nameField.find('.error').exists()).toBeFalsy();
        });

        test('should remove the error message for the email input if a valid email', () => {
            const emailField = wrapper.find('.field.email');

            // Trigger error message
            clickAddWorkspaces();

            // Set email and resubmit
            wrapper.setData({ email: 'user@joyent.com' });
            clickAddWorkspaces();

            expect(emailField.find('.error').exists()).toBeFalsy();
        });

        test('should remove the error message for the password input if a valid password is submitted', () => {
            const passwordField = wrapper.find('.field.password');

            // Trigger error message
            clickAddWorkspaces();

            // Set password and resubmit
            wrapper.setData({ password: 'abcdefg' });
            clickAddWorkspaces();

            expect(passwordField.find('.error').exists()).toBeFalsy();
        });
    });
});
