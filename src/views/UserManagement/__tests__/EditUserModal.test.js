import EditUserModal from '../EditUserModal.vue';
import Vuex from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';
import * as usersApi from '@api/users.js';

// Fixture
import users from '@src/__fixtures__/users.js';
import workspaces from '@src/__fixtures__/workspaces.js';

jest.mock('@api/request.js');

const localVue = createLocalVue();
localVue.use(Vuex);

describe('EditUserModal.vue', () => {
    let propsData;
    let state;
    let store;
    let user;
    let wrapper;

    beforeEach(() => {
        state = { workspaces };
        store = new Vuex.Store({ state });
        user = users[0];
        propsData = { modalStep: 1, user };
        wrapper = mount(EditUserModal, { localVue, propsData, store });
    });

    // Helper functions
    const clickEditWorkspaces = () => {
        wrapper.find('a.edit-workspaces').trigger('click');
    };

    const clickSaveChanges = () => {
        wrapper.find('a.save-changes').trigger('click');
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
            clickEditWorkspaces();
        });

        test('should switch to the workspace selection pane after valid user info is submitted', () => {
            expect(wrapper.find('h1.title').text()).toEqual(
                'Edit User Workspaces'
            );
        });

        test('should display permissions selector when a workspace is selected', () => {
            expect(wrapper.find('.select.permissions').exists()).toBeTruthy();
        });

        test('should not display a permissions selector when a workspace is deselected', () => {
            wrapper
                .findAll('.checkbox-round')
                .at(0)
                .trigger('click');

            expect(
                wrapper
                    .findAll('.checkbox-round')
                    .at(0)
                    .classes()
            ).not.toContain('is-selected');
        });

        test('should filter workspace results when search text is entered', () => {
            wrapper.find('input.search').setValue('Conch');

            expect(wrapper.findAll('tr.workspace')).toHaveLength(2);
        });

        test('should call the editUser method', () => {
            const spy = jest.spyOn(usersApi, 'editUser');

            wrapper.setData({
                name: 'Edited User',
            });

            clickSaveChanges();

            expect(spy).toHaveBeenCalled();
        });

        test('should not call the editUser method if no information is updated', () => {
            const spy = jest.spyOn(usersApi, 'editUser');

            clickSaveChanges();

            expect(spy).not.toHaveBeenCalled();
        });

        describe('modifying selected workspace permissions', () => {
            test('should add selected workspace to updatedWorkspaces array if permissions are modified', () => {
                wrapper.findAll('option').at(1).element.selected = true;
                wrapper.find('select').trigger('change');

                expect(wrapper.vm.updatedWorkspaces).toHaveLength(1);
            });

            test('should remove workspace that has permissions updated and then reverted', () => {
                // Update workspace permission, which adds workspace to
                // updatedWorkspaces array
                wrapper.findAll('option').at(1).element.selected = true;
                wrapper.find('select').trigger('change');

                // Revert workspace permission change, which removes
                // workspace from updatedWorkspaces array
                wrapper.findAll('option').at(0).element.selected = true;
                wrapper.find('select').trigger('change');

                expect(wrapper.vm.updatedWorkspaces).toHaveLength(0);
            });

            test('should add removed workspace to updatedWorkspaces array', () => {
                // Deselects a workspace, adding it to updatedWorkspaces array
                wrapper
                    .findAll('.checkbox-round')
                    .at(0)
                    .trigger('click');

                expect(wrapper.vm.updatedWorkspaces).toHaveLength(1);
            });

            test('should add newly added workspace to updatedWorksapces array', () => {
                // Selects a workspace, adding it to updatedWorkspaces array
                wrapper
                    .findAll('.checkbox-round')
                    .at(3)
                    .trigger('click');

                expect(wrapper.vm.updatedWorkspaces).toHaveLength(1);
            });

            test('should modify updatedWorkspace action to removed if deselected after permission update', () => {
                // Update workspace permission
                wrapper.findAll('option').at(1).element.selected = true;
                wrapper.find('select').trigger('change');

                // Deselect workspace
                wrapper
                    .findAll('.checkbox-round')
                    .at(0)
                    .trigger('click');

                expect(wrapper.vm.updatedWorkspaces[0].action).toEqual(
                    'remove'
                );
            });
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

        test('should display error messages for each text input field if they are submitted empty', () => {
            wrapper.setData({ email: '' });
            wrapper.setData({ name: '' });

            clickEditWorkspaces();

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
            clickEditWorkspaces();

            // Set name and resubmit
            wrapper.setData({ name: 'User Name' });
            clickEditWorkspaces();

            expect(nameField.find('.error').exists()).toBeFalsy();
        });

        test('should remove the error message for the email input if a valid email', () => {
            const emailField = wrapper.find('.field.email');

            wrapper.setData({ email: '' });

            // Trigger error message
            clickEditWorkspaces();

            // Set email and resubmit
            wrapper.setData({ email: 'user@joyent.com' });
            clickEditWorkspaces();

            expect(emailField.find('.error').exists()).toBeFalsy();
        });
    });
});
