import Sidebar from '../Sidebar.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import * as auth from '@api/authentication.js';
import * as conchApi from '@api/conchApiVersion.js';

// Fixture
import users from '@src/__fixtures__/users.js';
import workspaces from '@src/__fixtures__/workspaces.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('../../../api/request.js');
jest.spyOn(auth, 'logout');
jest.spyOn(conchApi, 'getApiVersion');

describe('Sidebar.vue', () => {
    let getters;
    let mocks
    let state;
    let store;
    let stubs;
    let wrapper;

    beforeEach(() => {
        getters = { currentWorkspaceId: jest.fn() };
        mocks = { $router :[] };
        state = { currentUser: users[0], currentWorkspace: workspaces[0] };
        store = new Vuex.Store({ state, getters });
        stubs = ['router-link'];
        wrapper = shallowMount(Sidebar, { localVue, mocks, store, stubs });
    });

    test('should call signOut method when "Log out" link is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'signOut');

        wrapper.find('.sign-out').trigger('click');

        return expect(spy).toHaveBeenCalled();
    });

    test('should call logout from auth API when signOut is called', () => {
        wrapper.find('.sign-out').trigger('click');

        return expect(auth.logout).toHaveBeenCalled();
    });

    test('should call getApiVersion from conchApiVersion API on created lifecycle hook', () => {
        return expect(conchApi.getApiVersion).toHaveBeenCalled();
    });

    test('should display a loading indicator when the currentWorkspace is being loaded', () => {
        state.currentWorkspace = {};
        store = new Vuex.Store({ state, getters });
        wrapper = shallowMount(Sidebar, { localVue, mocks, store, stubs });

        expect(wrapper.find('spinner-stub').exists()).toBeTruthy();
    });
});
