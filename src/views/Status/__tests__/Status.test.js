import Status from '../Status.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { EventBus } from '@src/eventBus.js';

// Fixture
import devices from '@src/__fixtures__/devices.js';
import rackRoomsByWorkspaceId from '@src/__fixtures__/rackRoomsByWorkspace.js';

const GlobalPlugins = {
    install(v) {
        v.prototype.$bus = EventBus;
    },
};
const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(GlobalPlugins);

jest.mock('../../../api/request.js');

localStorage.setItem('token', 'my-token');

describe('Status.vue', () => {
    let actions;
    let getters;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = { setRackRooms: jest.fn() };
        getters = {
            currentWorkspaceId: jest.fn(),
            currentWorkspaceName: jest.fn(),
        };
        state = { rackRoomsByWorkspace: rackRoomsByWorkspaceId };
        store = new Vuex.Store({ actions, getters, state });
        wrapper = shallowMount(Status, { localVue, store });
        wrapper.setData({ workspaceDevices: devices });
    });

    test('should display a loading indicator when rack count is not available', () => {
        const rackCount = wrapper.find('.rack-count');
        expect(rackCount.html()).toContain('spinner-stub');
    });

    test('should display a loading indicator when device count is not available', () => {
        wrapper.setData({ workspaceDevices: null });
        const deviceCount = wrapper.find('.device-count');

        expect(deviceCount.html()).toContain('spinner-stub');
    });

    test('should display a loading indicator when rack rooms by status are not available', () => {
        const rackRoomsStatus = wrapper.find('.rack-rooms-status');

        expect(rackRoomsStatus.html()).toContain('spinner-stub');
    });

    test('should display a loading indicator when rack rooms by role are not available', () => {
        const rackRoomsRole = wrapper.find('.rack-rooms-role');

        expect(rackRoomsRole.html()).toContain('spinner-stub');
    });

    test('should call setWorkspaceDevices and setWorkspaceRacks on changeWorkspace:status event', () => {
        expect.assertions(2);

        const spySetWorkspaceDevices = jest.spyOn(
            wrapper.vm,
            'setWorkspaceDevices'
        );
        const spySetWorkspaceRacks = jest.spyOn(
            wrapper.vm,
            'setWorkspaceRacks'
        );

        EventBus.$on('changeWorkspace:status', () => {
            expect(spySetWorkspaceDevices).toHaveBeenCalled();
            expect(spySetWorkspaceRacks).toHaveBeenCalled();
        });

        EventBus.$emit('changeWorkspace:status');
    });
});
