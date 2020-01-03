import Sidebar from '../Sidebar.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import * as auth from '@api/authentication.js';
import * as conchApi from '@api/conchApiVersion.js';

// Fixture
import users from '@src/__fixtures__/users.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('../../../api/request.js');
jest.spyOn(auth, 'logout');
jest.spyOn(conchApi, 'getApiVersion');

describe('Sidebar.vue', () => {
    let mocks;
    let state;
    let store;
    let stubs;
    let wrapper;

    beforeEach(() => {
        mocks = { $router: [] };
        state = { currentUser: users[0] };
        store = new Vuex.Store({ state });
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
});
