import UserManagement from '../UserManagement.vue';
import Vuex from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';

// Fixture
import users from '@src/__fixtures__/users.js';
import workspaces from '@src/__fixtures__/workspaces.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@api/request.js');

describe('UserManagement.vue', () => {
    let actions;
    let mocks;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = { setUsers: jest.fn() };
        mocks = { $router: [] };
        state = { users };
        store = new Vuex.Store({ actions, state });
        wrapper = mount(UserManagement, { localVue, mocks, store });
    });

    // Helper function
    const clickDropdownTrigger = () => {
        wrapper.findAll('.dropdown-trigger button').at(1).trigger('click');
    };

    test('should display loading indicator when users are not available', () => {
        state.users = [];
        store = new Vuex.Store({ actions, state });
        wrapper = mount(UserManagement, { localVue, mocks, store });

        expect(wrapper.find('.spinner').exists()).toBeTruthy();
    });

    test('should filter displayed users to only admins when "Admins" filter is selected', () => {
        wrapper.setData({ userFilter: 'admins' });

        expect(wrapper.findAll('tr').length).toEqual(1);
        expect(wrapper.vm.filteredUsers.length).toEqual(1);
        expect(wrapper.vm.filteredUsers[0].is_admin).toBeTruthy();
    });

    test('should filter displayed users to only regular users when "Users" filter is selected', () => {
        wrapper.setData({ userFilter: 'users' });

        expect(wrapper.findAll('tr').length).toEqual(1);
        expect(wrapper.vm.filteredUsers.length).toEqual(1);
        expect(wrapper.vm.filteredUsers[0].is_admin).toBeFalsy();
    });

    test('should filter users based on search input', () => {
        wrapper.find('input.search').setValue('Another');

        expect(wrapper.findAll('tr').length).toEqual(1);
        expect(wrapper.vm.filteredUsers.length).toEqual(1);
        expect(wrapper.vm.filteredUsers[0].name).toContain('Another');
    });

    test('should not display UserModal component on initial render', () => {
        expect(wrapper.find('usermodal-stub').exists()).toBeFalsy();
    });

    test('should not display UserActionModal component on initial render', () => {
        expect(wrapper.find('useractionmodal-stub').exists()).toBeFalsy();
    });

    test('should display UserModal component when "Edit User" button is clicked', () => {
        clickDropdownTrigger();
        wrapper.find('.dropdown-item.edit').trigger('click');

        expect(wrapper.find('.user-modal').exists()).toBeTruthy();
    });

    test('should display UserModal when "Create User" button is clicked', () => {
        wrapper.find('button.create').trigger('click');

        expect(wrapper.find('.user-modal').exists()).toBeTruthy();
    });

    test('should display a tag with "None" for users with no issues', () => {
        expect(wrapper.find('.tag.none').exists()).toBeTruthy();
    });

    test('should display a tag with "Password Change Required" when force_password_change is true', () => {
        expect(wrapper.find('.tag.pwd-change').exists()).toBeTruthy();
    });

    test('should display a tag with "Session Auth Refused" when refuse_session_auth is true', () => {
        expect(wrapper.find('.tag.sess-auth').exists()).toBeTruthy();
    });

    test('should not display any dropdown menus on initial render', () => {
        expect(wrapper.find('.dropdown-menu').exists()).toBeFalsy();
    });

    test('should open the dropdown menu when the dropdown trigger is clicked', () => {
        clickDropdownTrigger();

        expect(wrapper.find('.dropdown-menu').exists()).toBeTruthy();
    });

    test('should close the dropdown menu when the dropdown trigger is clicked a second time', () => {
        clickDropdownTrigger();
        clickDropdownTrigger();

        expect(wrapper.find('.dropdown-menu').exists()).toBeFalsy();
    });

    test('should not diplay workspace name search input on user list view', () => {
        expect(wrapper.find('.input.search.workspaces').exists()).toBeFalsy();
    });

    test('should display workspace name search input on workspaces view', () => {
        wrapper.findAll('.tabs .tab').at(1).trigger('click');

        expect(wrapper.find('.input.search.workspaces').exists()).toBeTruthy();
    });

    test('should filter table rows based on workspace name search input', () => {
        state.workspaces = workspaces;
        store = new Vuex.Store({ actions, state });
        wrapper = mount(UserManagement, { localVue, mocks, store });

        wrapper.find('.workspaces-tab').trigger('click');
        wrapper.find('.input.search.workspaces').setValue('staging');

        expect(wrapper.find('.workspace-name').text()).toEqual(workspaces[3].name);
    });

    describe('tabs', () => {
        test('should switch to the workspaces table view when the workspace tab is clicked', () => {
            wrapper.find('.workspaces-tab').trigger('click');

            expect(wrapper.find('.workspace-view').exists()).toBeTruthy();
        });

        test('should switch to the users list table when the users tab is clicked', () => {
            wrapper.find('.workspaces-tab').trigger('click');
            wrapper.find('.users-tab').trigger('click');

            expect(wrapper.find('.users-table').exists()).toBeTruthy();
        });
    });

    describe('statistic filters', () => {
        test('should filter the results to show all users when the "All Users" statistic box is clicked', () => {
            const allUsersCount = users.length;
            wrapper.find('.filter-admin').trigger('click');
            wrapper.find('.filter-all').trigger('click');

            expect(wrapper.findAll('.username').length).toEqual(allUsersCount);
        });

        test('should filter the results to show admin users when the "Admin Users" statistic box is clicked', () => {
            const adminUsersCount = users.filter(user => user.is_admin).length;
            wrapper.find('.filter-admin').trigger('click');

            expect(wrapper.findAll('.username').length).toEqual(adminUsersCount);
        });

        test('should filter the results to show regular users when the "Regular User" statistic box is clicked', () => {
            const regularUsersCount = users.filter(user => user.is_admin === false).length;
            wrapper.find('.filter-regular').trigger('click');

            expect(wrapper.findAll('.username').length).toEqual(regularUsersCount);
        });

        test('should filter the results to show inactive users when the "Inactive Users" statistic box is clicked', () => {
            const inactiveUsersCount = users.filter(user => user.last_login === null).length;
            wrapper.find('.filter-inactive').trigger('click');

            expect(wrapper.findAll('.username').length).toEqual(inactiveUsersCount);
        });

        test('should filter the results to show users with auth issues when the "Authentication Issues" statistic box is clicked', () => {
            const authIssuesUsersCount = users.filter(user => {
                if (user.force_password_change || user.refuse_session_auth) {
                    return user;
                }
            }).length;
            wrapper.find('.filter-auth-issues').trigger('click');

            expect(wrapper.findAll('.username').length).toEqual(authIssuesUsersCount);
        });
    });
});
