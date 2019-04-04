import PageNotFound from '../PageNotFound.vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import router from '../../../router.js';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import workspaces from '@src/__fixtures__/workspaces.js';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('PageNotFound.vue', () => {
    let getters;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        getters = {
            currentWorkspaceId: jest.fn(),
            loadCurrentWorkspace: jest.fn(),
        };
        state = { workspaces };
        store = new Vuex.Store({ getters, state });
        wrapper = shallowMount(PageNotFound, { localVue, router, store });
    });

    // Helper function
    const clickWorkspaceButton = () => {
        wrapper.findAll('a.button').at(0).trigger('click');;
    };

    test('should render correctly on initial render', () => {
        expect(wrapper.html()).toMatchSnapshot();
    });

    test('should redirect user to status page when "Last Known Workspace" button clicked', () => {
        clickWorkspaceButton();

        expect(wrapper.vm.$route.name).toEqual('status');
        expect(wrapper.vm.$route.params).toHaveProperty('currentWorkspace');
    });

    test('should call routeLastKnownWorkspace when "Last Known Workspace" button clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'routeLastKnownWorkspace');

        // Needed in order for test to pass. It seems like Jest doesn't know
        // how to handle getters that take arguments. It seems to identify such
        // calls as method calls and looks for a corresponding item in the
        // 'methods' object of the Vue component.
        Object.defineProperty(wrapper.vm, 'loadCurrentWorkspace', { value: jest.fn() });

        clickWorkspaceButton();

        expect(spy).toHaveBeenCalled();
    });
});
