import SettingsTab from '../SettingsTab.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import deviceSettings from '@src/__fixtures__/deviceSettings.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('SettingsTab.vue', () => {
    let state = { activeDeviceSettings: {} };
    let store = new Vuex.Store({ state });
    let wrapper = shallowMount(SettingsTab, { localVue, store });

    test('should display "No settings details available" when device settings details are unavailable', () => {
        expect(wrapper.html()).toContain('No settings details available');
    });

    test('should display expected data when device settings details are available', () => {
        state.activeDeviceSettings = deviceSettings;
        store = new Vuex.Store({ state });
        wrapper = shallowMount(SettingsTab, { localVue, store });

        expect(wrapper.find('table').exists()).toBeTruthy();
    });
});
