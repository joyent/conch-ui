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

    test('should call the viewTokens method when view tokens link on action dropdown menu is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'viewTokens');

        wrapper.find('button.actions').trigger('click');
        wrapper.find('a.tokens').trigger('click');

        expect(spy).toHaveBeenCalled();
    });

    test('should sort users by username when "User Name" header is clicked', () => {
        wrapper.find('.table-header-filter').trigger('click');

        expect(wrapper.find('.username').text()).toEqual(secondUserName);
    });

    test('should reverse sort users by username when "User Name" header is clicked', () => {
        wrapper.find('.table-header-filter').trigger('click');
        wrapper.find('.table-header-filter').trigger('click');

        expect(wrapper.find('.username').text()).toEqual(firstUserName);
    });

    test('should sort users by role when the "Role" header is clicked', () => {
        wrapper.findAll('.table-header-filter').at(1).trigger('click');

        expect(wrapper.find('.username').text()).toEqual(secondUserName);
    });

    test('should sort users by authenticaiton issues when "Authentication Issues" header is clicked', () => {
        wrapper.findAll('.table-header-filter').at(2).trigger('click');

        expect(wrapper.find('.username').text()).toEqual(firstUserName);
    });

    test('should sort users by last active date when "Last Active" header is clicked', () => {
        wrapper.findAll('.table-header-filter').at(3).trigger('click');

        expect(wrapper.find('.username').text()).toEqual(firstUserName);
    });
});
