// TODO: Replace this with a better, testable implementation.
import RackProgress from '../RackProgress.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

import rackRooms from '@src/__fixtures__/rackRooms';

const localVue = createLocalVue();
localVue.use(Vuex);

/* eslint-disable */
describe.skip('RackProgress.vue', () => {
    let propsData;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        propsData = { group: 'status' };
        state = { rackRooms: rackRooms };
        store = new Vuex.Store({ state });
        wrapper = shallowMount(RackProgress, { localVue, propsData, store });
    });

    test.skip('should render component', () => {});
});
