import WorkspaceView from '../WorkspaceView.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import workspaces from '@src/__fixtures__/workspaces.js';
import users from '@src/__fixtures__/users.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('WorkspaceView.vue', () => {
    let propsData;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        propsData = { users };
        state = { workspaces };
        store = new Vuex.Store({ state });
        wrapper = shallowMount(WorkspaceView, { localVue, propsData, store });
    });

    test('should not display any UserTable components on initial render', () => {
        expect(wrapper.find('usertable-stub').exists()).toBeFalsy();
    });

    test('should not show any rows as selected on initial render', () => {
        expect(wrapper.find('.is-selected').exists()).toBeFalsy();
    });

    test('should sort workspace names when the "Workspace Name" header is clicked', () => {
        wrapper.find('.table-header-filter').trigger('click');
        const workspaceRows = wrapper.findAll('.workspace-name');

        expect(workspaceRows.at(0).text()).toEqual(workspaces[1].name);
    });

    test('should show a row as selected when clicked', () => {
        wrapper.find('.workspace-row').trigger('click');

        expect(wrapper.find('.workspace-row').classes()).toContain(
            'is-selected'
        );
    });

    test('should display a UsersTable component when a workspace is clicked', () => {
        wrapper.find('.workspace-row').trigger('click');

        expect(wrapper.find('userstable-stub').exists()).toBeTruthy();
    });
});
