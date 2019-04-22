import UserAuthTokens from '../UserAuthTokens.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import authTokens from '@src/__fixtures__/authTokens.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('UserAuthTokens.vue', () => {
    let actions;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = { setAuthTokens: jest.fn() };
        state = { userAuthTokens: authTokens };
        store = new Vuex.Store({ actions, state });
        wrapper = shallowMount(UserAuthTokens, { localVue, store });
    });

    test('should not display modal on initial render', () => {
        expect(wrapper.find('.modal').exists()).toBeFalsy();
    });

    test('should not display any token details on initial render', () => {
        expect(wrapper.find('.token-details').exists()).toBeFalsy();
    });

    test('should display token details when token name is clicked', () => {
        wrapper.find('a.name').trigger('click');
        expect(wrapper.find('.token-details').exists()).toBeTruthy();
    });

    test('should display a warning modal when user attempts to delete a token', () => {
        wrapper.find('.delete-token').trigger('click');
        expect(wrapper.find('.modal').exists()).toBeTruthy();
    });

    test('should not display any input fields on initial render', () => {
        expect(wrapper.find('input').exists()).toBeFalsy();
    });

    test('should display an input field after user clicks "Add Token" button', () => {
        wrapper.find('.header .add').trigger('click');
        expect(wrapper.find('input').exists()).toBeTruthy();
    });

    test('should remove the input field when user clicks "Cancel" button', () => {
        wrapper.find('.header .add').trigger('click');
        wrapper.find('.header .cancel').trigger('click');

        expect(wrapper.find('input').exists()).toBeFalsy();
    });

    test('should close warning modal when user clicks the close button', () => {
        wrapper.find('.delete-token').trigger('click');
        wrapper.find('.notification button.delete').trigger('click');
        expect(wrapper.find('.modal').exists()).toBeFalsy();
    });

    test('should close warning modal when user clicks the "Cancel" button', () => {
        wrapper.find('.delete-token').trigger('click');
        wrapper.find('.notification .cancel').trigger('click');
        expect(wrapper.find('.modal').exists()).toBeFalsy();
    });

    test('should close warning modal when user clicks the modal background', () => {
        wrapper.find('.delete-token').trigger('click');
        wrapper.find('.modal-background').trigger('click');
        expect(wrapper.find('.modal').exists()).toBeFalsy();
    });
});
