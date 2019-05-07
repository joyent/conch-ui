import AuthenticationTokens from '../AuthenticationTokens.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import authTokens from '@src/__fixtures__/authTokens.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('AuthenticationTokens.vue', () => {
    let actions;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = { setAuthTokens: jest.fn() };
        state = { authTokens };
        store = new Vuex.Store({ actions, state });
        wrapper = shallowMount(AuthenticationTokens, { localVue, store });
    });

    test('', () => {

    });
});
