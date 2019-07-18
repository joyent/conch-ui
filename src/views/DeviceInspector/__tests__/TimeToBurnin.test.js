import TimeToBurnin from '../TimeToBurnin.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixtures
import deviceDetails from '@src/__fixtures__/deviceDetails.js';
import deviceSettings from '@src/__fixtures__/deviceSettings.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('TimeToBurnin.vue', () => {
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        state = {
            activeDeviceDetails: deviceDetails,
            activeDeviceSettings: deviceSettings,
        };
        store = new Vuex.Store({ state });
        wrapper = shallowMount(TimeToBurnin, { localVue, store });
    });

    test('should display loading indicator when activeDeviceSettings is undefined', () => {
        expect(wrapper.find('.spinner')).toBeTruthy();
    });

    test('should display "Burn-in Complete" when percentage is 100', () => {
        expect(wrapper.html()).toContain('Burn-in Complete');
    });

    test('should display the expected burn-in time when percentage is not 100', () => {
        state.activeDeviceSettings['build.reboot_count'] = '1';
        wrapper = shallowMount(TimeToBurnin, { localVue, store });

        expect(wrapper.html()).toContain('Should have finished');
    });

    test('should display the RadialProgress component when required data is present and device health is pass', () => {
        const wrapperHtml = wrapper.html();

        expect(wrapperHtml).toContain('radialprogress-stub');
        expect(wrapperHtml).toContain('Should have finished');
    });

    test('should display the RadialProgress component when required data is present and device health is fail', () => {
        state.activeDeviceDetails.health = 'fail';
        wrapper = shallowMount(TimeToBurnin, { localVue, store });
        const wrapperHtml = wrapper.html();

        expect(wrapperHtml).toContain('radialprogress-stub');
        expect(wrapperHtml).toContain('Failing validation');
    });

    test('should display "Burn-in not started" when firmware is not equal to "current"', () => {
        state.activeDeviceSettings.firmware = '';
        wrapper = shallowMount(TimeToBurnin, { localVue, store });

        expect(wrapper.html()).toContain('Burn-in not started');
    });

    test('should display "Device has not reported" when last_seen is null', () => {
        state.activeDeviceDetails.last_seen = null;
        wrapper = shallowMount(TimeToBurnin, { localVue, store });

        expect(wrapper.html()).toContain('Device has not reported');
    });
});
