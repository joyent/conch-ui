import UsersTable from '../UsersTable.vue';
import { shallowMount } from '@vue/test-utils';

// Fixture
import users from '@src/__fixtures__/users.js';

describe('UsersTable.vue', () => {
    const firstUserName = users[0].name;
    const secondUserName = users[1].name;

    let mocks;
    let propsData;
    let wrapper;

    beforeEach(() => {
        mocks = { $router: [] };
        propsData = { users };
        wrapper = shallowMount(UsersTable, { mocks, propsData });
    });

    // Helper function
    const clickElement = element => {
        wrapper.find(element).trigger('click');
    };

    test('should call the viewTokens method when view tokens link on action dropdown menu is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'viewTokens');

        clickElement('button.actions');
        clickElement('a.tokens');

        expect(spy).toHaveBeenCalled();
    });

    test('should sort users by username when "User Name" header is clicked', () => {
        clickElement('.table-header-filter.username');

        expect(wrapper.find('.row .username').text()).toEqual(secondUserName);
    });

    test('should reverse sort users by username when "User Name" header is clicked twice', () => {
        // First click sorts table by user name alphabetically
        clickElement('.table-header-filter.username');
        clickElement('.table-header-filter.username');

        expect(wrapper.find('.row .username').text()).toEqual(firstUserName);
    });

    test('should sort users by role when the "Role" header is clicked', () => {
        clickElement('.table-header-filter.role');

        expect(wrapper.find('.row .username').text()).toEqual(secondUserName);
    });

    test('should sort users by authenticaiton issues when "Authentication Issues" header is clicked', () => {
        clickElement('.table-header-filter.auth-issues');

        expect(wrapper.find('.row .username').text()).toEqual(firstUserName);
    });

    test('should sort users by last active date when "Last Active" header is clicked', () => {
        clickElement('.table-header-filter.last-active');

        expect(wrapper.find('.row .username').text()).toEqual(firstUserName);
    });
});
