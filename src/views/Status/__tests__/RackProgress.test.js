import RackProgress from '../RackProgress.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import rackRooms from '@src/__fixtures__/rackRooms';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('RackProgress.vue', () => {
    let propsData;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        propsData = { group: '' };
        state = { rackRooms: rackRooms };
        store = new Vuex.Store({ state });
        wrapper = shallowMount(RackProgress, { localVue, propsData, store });
    });

    test('', () => {});
});
