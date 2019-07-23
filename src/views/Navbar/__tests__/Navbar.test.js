import Navbar from '../Navbar.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import workspaces from '@src/__fixtures__/workspaces.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Navbar.vue', () => {
    const actions = { setCurrentWorkspace: jest.fn() };
    const getters = { currentWorkspaceName: jest.fn() };
    const mocks = { $route: {}, $router: [] };
    const state = { workspaces };
    const store = new Vuex.Store({ actions, getters, state });
    const wrapper = shallowMount(Navbar, { localVue, mocks, store });

    test('should call changeWorkspace with the selected workspaceId', () => {
        const spy = jest.spyOn(wrapper.vm, 'changeWorkspace');
        const navbarItem = wrapper.findAll('a.navbar-item').at(0);

        // Needed in order for test to pass. It seems like Jest doesn't know
        // how to handle getters that take arguments. It seems to identify such
        // calls as method calls and looks for a corresponding item in the
        // 'methods' object of the Vue component.
        Object.defineProperty(wrapper.vm, 'loadCurrentWorkspace', {
            value: jest.fn(),
        });

        navbarItem.trigger('click');
        expect(spy).toHaveBeenCalledWith(workspaces[0].id);
    });
});
