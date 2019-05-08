import UserAuthTokens from '../UserAuthTokens.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import userAuthTokens from '@src/__fixtures__/userAuthTokens.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@src/api/request.js');

describe('UserAuthTokens.vue', () => {
    let actions;
    let state;
    let store;
    let mocks;
    let wrapper;

    beforeEach(() => {
        actions = { setUserAuthTokens: jest.fn() };
        state = { userAuthTokens: [] };
        store = new Vuex.Store({ actions, state });
        mocks = { $nextTick: jest.fn() };
        wrapper = shallowMount(UserAuthTokens, { localVue, mocks, store });
    });

    test('should not display modal on initial render', () => {
        expect(wrapper.find('.modal').exists()).toBeFalsy();
    });

    test('should not display any token details on initial render', () => {
        expect(wrapper.html()).toContain('You do not have any tokens.');
    });

    test('should display a warning modal when user attempts to delete a token', () => {
        state.userAuthTokens = userAuthTokens;
        store = new Vuex.Store({ actions, state });
        wrapper = shallowMount(UserAuthTokens, { localVue, mocks, store });

        wrapper.find('.delete-token').trigger('click');
        expect(wrapper.find('basemodal-stub').exists()).toBeTruthy();
    });

    test('should not display any input fields on initial render', () => {
        expect(wrapper.find('input').exists()).toBeFalsy();
    });

    test('should display an input field after user clicks "Add Token" button', () => {
        wrapper.find('a.add').trigger('click');
        expect(wrapper.find('input').exists()).toBeTruthy();
    });

    test('should remove the input field when user clicks "Cancel" button', () => {
        wrapper.find('a.add').trigger('click');
        wrapper.find('a.cancel').trigger('click');

        expect(wrapper.find('input').exists()).toBeFalsy();
    });

    test('should display tokens added by the user', () => {
        wrapper.setData({
            tokens: [
                {
                    created: "2019-05-06T16:42:38.189157-07:00",
                    expires: "2024-05-04T16:42:38.000-07:00",
                    last_used: null,
                    name: "test 1",
                },
            ],
        });

        expect(wrapper.html()).toContain('test 1');
    });
});
