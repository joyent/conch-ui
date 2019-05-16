import UsersTable from '../UsersTable.vue';
import { shallowMount } from '@vue/test-utils';

// Fixture
import users from '@src/__fixtures__/users.js';

describe('UsersTable.vue', () => {
    let propsData;
    let wrapper;

    beforeEach(() => {
        propsData = { users };
        wrapper = shallowMount(UsersTable, { propsData });
    });

    test('should call the viewTokens method when view tokens link on action dropdown menu is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'viewTokens');

        wrapper.find('button.actions').trigger('click');
        wrapper.find('a.tokens').trigger('click');

        expect(spy).toHaveBeenCalled();
    });
});
