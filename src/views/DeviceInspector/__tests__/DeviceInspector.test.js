import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import DeviceInspector from '../DeviceInspector.vue';

// Fixture
import activeDevice from '@src/__fixtures__/activeDevice.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('../../../api/request.js');

describe('DeviceInspector.vue', () => {
    let actions;
    let getters;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = {
            clearShowDeviceInRack: jest.fn(),
            setActiveDeviceDetails: jest.fn(),
            setActiveDeviceSettings: jest.fn(),
            setActiveDeviceValidations: jest.fn(),
            setActiveRoomName: jest.fn(),
            setRackLayout: jest.fn(),
            setValidations: jest.fn(),
        };
        getters = { activeDeviceId: jest.fn() };
        state = { activeDevice };
        store = new Vuex.Store({ actions, getters, state });
        wrapper = shallowMount(DeviceInspector, { localVue, store });
    });

    test('should display a loading indicator if there is no activeDevice', () => {
        state.activeDevice = {};

        expect(wrapper.find('spinner-stub').exists()).toBeTruthy();
        expect(wrapper.find('.tabs-container').exists()).toBeFalsy();
    });

    test('should display tabs if there is an activeDevice', () => {
        expect(wrapper.find('.tabs-container').exists()).toBeTruthy();
    });

    test('should display the Overview Tab by default on inital render', () => {
        expect(wrapper.find('overviewtab-stub').exists()).toBeTruthy();
    });

    test('should call setActiveTab method with new active tab when tab is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'setActiveTab');
        const settingsTab = wrapper.findAll('a').at(2);

        settingsTab.trigger('click');

        expect(spy).toHaveBeenCalledWith('SettingsTab');
    });

    test('should call clearShowDeviceInRack if showDeviceInRack is true on mount', () => {
        state.showDeviceInRack = true;
        shallowMount(DeviceInspector, { localVue, store });

        expect(actions.clearShowDeviceInRack).toHaveBeenCalled();
    });
});
