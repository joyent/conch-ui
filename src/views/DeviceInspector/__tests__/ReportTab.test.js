import ReportTab from '../ReportTab.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import deviceDetails from '../../../__fixtures__/deviceDetails';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('ReportTab.vue', () => {
    let state;
    let store;
    let wrapper;

    test('should display a JSON object containing report data if latest_report is not empty or null', () => {
        state = { activeDeviceDetails: deviceDetails };
        store = new Vuex.Store({ state });
        wrapper = shallowMount(ReportTab, { localVue, store });

        expect(wrapper.find('pre').text()).not.toEqual('{}');
    });

    test('should display empty JSON object when latest_report is empty or null', () => {
        state.activeDeviceDetails.latest_report = null;
        store = new Vuex.Store({ state });
        wrapper = shallowMount(ReportTab, { localVue, store });

        expect(wrapper.find('pre').text()).toEqual('{}');
    });
});
