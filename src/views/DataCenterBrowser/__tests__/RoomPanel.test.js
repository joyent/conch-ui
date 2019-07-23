import RoomPanel from '../RoomPanel.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import workspaceRackRooms from '@src/__fixtures__/workspaceRackRooms.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('RoomPanel.vue', () => {
    let actions;
    let getters;
    let mocks;
    let propsData;
    let store;
    let wrapper;
    let wrapperHtml;

    beforeEach(() => {
        actions = { setActiveRoomName: jest.fn() };
        getters = { activeRoomName: jest.fn() };
        mocks = { $router: [] };
        propsData = { rackRooms: workspaceRackRooms };
        store = new Vuex.Store({ actions, getters });
        wrapper = shallowMount(RoomPanel, {
            localVue,
            mocks,
            propsData,
            store,
        });
        wrapperHtml = wrapper.html();
    });

    // Helper function
    const clickFilter = () => {
        wrapper
            .findAll('.panel-tabs a')
            .at(1)
            .trigger('click');
    };

    test('should call activateRoom method with the room as parameter when a room row is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'activateRoom');
        const roomRow = wrapper.findAll('a.panel-block').at(0);

        roomRow.trigger('click');

        expect(spy).toHaveBeenCalledWith(propsData.rackRooms[0]);
    });

    test('should display all levels of room progress on initial render', () => {
        const rackRooms = propsData.rackRooms;

        expect(wrapperHtml).toContain(rackRooms[0].name);
        expect(wrapperHtml).toContain(rackRooms[1].name);
        expect(wrapperHtml).toContain(rackRooms[2].name);
    });

    test('should update selectedProgress to the selected room progress filtered', () => {
        expect(wrapper.vm.selectedProgress).toEqual('all');

        clickFilter();

        expect(wrapper.vm.selectedProgress).toEqual('not started');
    });

    test('should display only rooms that match the selected room progress filter', () => {
        const rackRooms = propsData.rackRooms;

        clickFilter();

        wrapperHtml = wrapper.html();

        expect(wrapperHtml).toContain(rackRooms[0].name);
        expect(wrapperHtml).not.toContain(rackRooms[3].name);
        expect(wrapperHtml).not.toContain(rackRooms[4].name);
    });

    test('should update panel with accurate search results when input is entered into search input field', () => {
        wrapper.find('input').setValue('southeast');
        wrapperHtml = wrapper.html();

        expect(wrapperHtml).toContain('southeast');
        expect(wrapperHtml).not.toContain('northeast');
    });
});
