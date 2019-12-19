import RackPanel from '../RackPanel.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixtures
import activeRacks from '@src/__fixtures__/activeRacks.js';
import rackLayout from '@src/__fixtures__/rackLayout.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('../../../api/request.js');

describe('RackPanel.vue', () => {
    let actions;
    let getters;
    let mocks;
    let propsData;
    let state;
    let store;
    let wrapper;
    let wrapperHtml;

    beforeEach(() => {
        actions = { setRackLayout: jest.fn() };
        getters = { activeRoomName: jest.fn() };
        mocks = { $router: [] };
        propsData = { activeRacks };
        state = { rackLayout };
        store = new Vuex.Store({ actions, getters, state });
        wrapper = shallowMount(RackPanel, {
            localVue,
            mocks,
            propsData,
            store,
        });
        wrapperHtml = wrapper.html();
    });

    // Helper function
    const clickProgressFilter = () => {
        wrapper
            .findAll('.panel-tabs a')
            .at(1)
            .trigger('click');
    };

    test('should call activateRack method with the rack as parameter when a rack row is clicked', () => {
        const roomRow = wrapper.find('a.panel-block');
        const spy = jest.spyOn(wrapper.vm, 'activateRack');

        roomRow.trigger('click');

        expect(spy).toHaveBeenCalledWith(propsData.activeRacks[0]);
    });

    test('should display all levels of rack progress on initial render', () => {
        const activeRacks = propsData.activeRacks;

        expect(wrapperHtml).toContain(activeRacks[0].name);
        expect(wrapperHtml).toContain(activeRacks[1].name);
        expect(wrapperHtml).toContain(activeRacks[2].name);
    });

    test('should display racks that match the selected rack progress filter', () => {
        const activeRacks = propsData.activeRacks;

        // Click the 'failing' filter
        clickProgressFilter();

        wrapperHtml = wrapper.html();

        expect(wrapperHtml).toContain(activeRacks[1].name);
    });

    test('should display racks that match the selected rack role filter', () => {
        const activeRacks = propsData.activeRacks;
        const rackRolesFilters = wrapper.findAll('.panel-tabs').at(1);
        const filter = rackRolesFilters.findAll('a').at(1);

        // Click the 'ceres' filter
        filter.trigger('click');

        wrapperHtml = wrapper.html();

        expect(wrapperHtml).toContain(activeRacks[2].name);
    });

    test('should update panel with accurate search results when input is entered into search input field', () => {
        wrapper.find('input').setValue('AA');

        wrapperHtml = wrapper.html();

        expect(wrapperHtml).toContain('AB');
        expect(wrapperHtml).not.toContain('BC');
    });
});
