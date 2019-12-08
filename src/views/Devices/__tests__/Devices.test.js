import Devices from '../Devices.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixtures
import devices from '@src/__fixtures__/devices.js';
import hardwareProductLookup from '@src/__fixtures__/hardwareProductLookup.js';

const localVue = createLocalVue();
localVue.use(Vuex);

sessionStorage.setItem('token', 'my-token');
jest.mock('../../../api/request.js');

describe('Devices.vue', () => {
    let actions;
    let getters;
    let mocks;
    let store;
    let stubs;
    let wrapper;

    beforeEach(() => {
        actions = {
            clearActiveDevice: jest.fn(),
            clearActiveRoomName: jest.fn(),
            clearRackLayout: jest.fn(),
            setHardwareProducts: jest.fn(),
        };
        getters = {
            activeDeviceId: jest.fn(),
            currentWorkspaceId: jest.fn(),
            currentWorkspaceName: jest.fn(),
        };
        mocks = { $route: { path: '', params: {} }, $router: [] };
        store = new Vuex.Store({ actions, getters });
        stubs = ['router'];
        wrapper = shallowMount(Devices, { localVue, store, mocks, stubs });
    });

    test('should display loading indicator when workspaceDevices are not available', () => {
        expect(wrapper.html()).toContain('spinner-stub');
    });

    test('should display the DevicesPanel component when workspaceDevices are available', () => {
        wrapper.setData({
            hardwareProductLookup,
            workspaceDevices: devices,
        });

        expect(wrapper.html()).toContain('devicespanel-stub');
    });

    test('should call clearActiveData when component instance is destroyed', () => {
        const spy = jest.spyOn(wrapper.vm, 'clearActiveData');
        wrapper.destroy();

        expect(spy).toHaveBeenCalled();
    });
});
