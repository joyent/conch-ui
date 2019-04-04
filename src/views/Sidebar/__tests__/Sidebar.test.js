import Sidebar from '../Sidebar.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import * as auth from '../../../api/authentication.js';
import * as conchApi from '../../../api/conchApiVersion.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('../../../api/request.js');
jest.spyOn(auth, 'logout');
jest.spyOn(conchApi, 'getApiVersion');

describe('Sidebar.vue', () => {
    let getters;
    let mocks
    let store;
    let stubs;
    let wrapper;

    beforeEach(() => {
        getters = { currentWorkspaceId: jest.fn() };
        mocks = { $router :[] };
        store = new Vuex.Store({ getters });
        stubs = ['router-link'];
        wrapper = shallowMount(Sidebar, { localVue, mocks, store, stubs });
    });

    test('should render correctly on initial render', () => {
        wrapper.setData({
            conchVersion: 'v2.21.2-10-gabc90b5f',
            conchUIVersion: 'v2.22.1-31-gece90b5f',
        });

        expect(wrapper.html()).toMatchSnapshot();
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
});
