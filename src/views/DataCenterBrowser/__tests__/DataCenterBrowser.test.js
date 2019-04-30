import DataCenterBrowser from '../DataCenterBrowser.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixtures
import activeRoom from '@src/__fixtures__/activeRoom.js';
import devices from '@src/__fixtures__/devices.js';
import devicesByWorkspaceId from '@src/__fixtures__/devicesByWorkspace.js';
import datacenterRackRooms from '@src/__fixtures__/datacenterRackRooms.js';
import workspaces from '@src/__fixtures__/workspaces.js';

const localVue = createLocalVue();
localVue.use(Vuex);

sessionStorage.setItem('token', 'my-token');

jest.mock('../../../api/request.js');

describe('DataCenterBrowser.vue', () => {
    let actions;
    let getters;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = {
            clearActiveDevice: jest.fn(),
            clearActiveRoomName: jest.fn(),
            clearRackLayout: jest.fn(),
            setActiveRoomName: jest.fn(),
            setHighlightDeviceId: jest.fn(),
        };
        getters = {
            currentWorkspaceId: jest.fn(() => workspaces[3].id),
            currentWorkspaceName: jest.fn(),
        };
        state = { devicesByWorkspace: devicesByWorkspaceId };
        store = new Vuex.Store({ actions, getters, state });
        wrapper = shallowMount(DataCenterBrowser, { localVue, store });
    });

    test('should display loading indicator on initial render if rack rooms are loading or unavailable', () => {
        expect(wrapper.find('spinner-stub').exists()).toBeTruthy();
    });

    test('should display roomPanel component when rack rooms are available', () => {
        wrapper.setData({ rackRooms: datacenterRackRooms });
        expect(wrapper.find('roompanel-stub').exists()).toBeTruthy();
    });

    test('should not display rackPanel component when a rack room has not been selected', () => {
        wrapper.setData({ rackRooms: datacenterRackRooms });
        expect(wrapper.find('rackpanel-stub').exists()).toBeFalsy();
    });

    test('should display rackPanel component when a rack room is active', () => {
        state.activeRoomName = activeRoom.name;
        store = new Vuex.Store({ actions, getters, state });
        wrapper = shallowMount(DataCenterBrowser, { localVue, store });
        wrapper.setData({ rackRooms: datacenterRackRooms });

        expect(wrapper.find('rackpanel-stub').exists()).toBeTruthy();
    });

    test('should not display search results dropdown on initial render', () => {
        expect(wrapper.find('.dropdown-content').exists()).toBeFalsy();
    });

    test('should clear active device data when component is destroyed', () => {
        wrapper.destroy();

        expect(actions.clearActiveDevice).toHaveBeenCalled();
        expect(actions.clearActiveRoomName).toHaveBeenCalled();
        expect(actions.clearRackLayout).toHaveBeenCalled();
    });

    test('should display search results dropdown when valid search terms are entered', async () => {
        const searchInput = wrapper.find('input');
        wrapper.setData({ workspaceDevices: devices });
        searchInput.trigger('focus');
        searchInput.setValue(devices[0].id);

        expect(wrapper.find('.dropdown-content').exists()).toBeTruthy();
    });

    test('should close search results dropdown when a search result is clicked', async () => {
        const searchInput = wrapper.find('input');
        wrapper.setData({ workspaceDevices: devices });
        searchInput.trigger('focus');
        searchInput.setValue(devices[0].id);

        wrapper.findAll('.dropdown-item').at(0).trigger('click');
        expect(wrapper.find('.dropdown-content').exists()).toBeFalsy();
    });
});
