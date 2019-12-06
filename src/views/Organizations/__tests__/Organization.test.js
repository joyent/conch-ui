import Organization from '../Organization.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('', () => {
    let mocks;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        mocks = {
            $route: {
                params: {},
            },
        };
        state = {};
        store = new Vuex.Store({ state });
        wrapper = shallowMount(Organization, { localVue, mocks, store });
    });

    test('', () => {
        // Seeing error:
        // [vue-test-utils]: could not overwrite property $route, this is usually caused by a plugin that has added the property as a read-only value
    });
});
