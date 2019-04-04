import LayoutPanel from '../LayoutPanel.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import { rackLayout } from '@src/__fixtures__/rackLayout.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('LayoutPanel.vue', () => {
    let actions;
    let propsData;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = { setActiveDevice: jest.fn() };
        propsData = { rackLoading: false };
        state = { rackLayout };
        store = new Vuex.Store({ actions, state });
        wrapper = shallowMount(LayoutPanel, { localVue, propsData, store });
    });

    test('should call openModal method when Edit Assignments button is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'openModal');

        wrapper.find('button').trigger('click');

        expect(spy).toHaveBeenCalled();
    });

    test('should not display anything when rackLayout is not available', () => {
        state = { rackLayout: {} };
        store = new Vuex.Store({ state });
        wrapper = shallowMount(LayoutPanel, { localVue, propsData, store });

        expect(wrapper.html()).toBeUndefined();
    });

    test('should display LayoutTable component when rack is not loading', () => {
        expect(wrapper.find('table').exists()).toBeTruthy();
    });

    test('should display loading indicator when rack is loading', () => {
        propsData = { rackLoading: true };
        wrapper = shallowMount(LayoutPanel, { localVue, propsData, store });

        expect(wrapper.find('spinner-stub').exists()).toBeTruthy();
    });

    test('should update filteredSlots with accurate search results', () => {
        const id = state.rackLayout.slots['1'].occupant.id;

        expect(wrapper.vm.filteredSlots.length).toEqual(3);

        wrapper.find('input').setValue(id);

        expect(wrapper.vm.filteredSlots.length).toEqual(1);
        expect(wrapper.vm.filteredSlots[0].occupant.id).toEqual(id);
    });

    test('should update filteredSlots with accurate results when filter is clicked', () => {
        expect(wrapper.vm.filteredSlots.length).toEqual(3);

        // Click 'graduated' filter
        wrapper.findAll('.panel-tabs a').at(1).trigger('click');

        const graduatedDevices = Object.values(state.rackLayout.slots).filter(slot => {
            return slot.occupant.graduated;
        });

        expect(graduatedDevices.length).toEqual(wrapper.vm.filteredSlots.length);
    });

    test('should call activateDevice method with device as parameter when a device row is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'activateDevice');

        wrapper.find('tbody tr').trigger('click');

        expect(spy).toHaveBeenCalledWith(wrapper.vm.filteredSlots[0]);
    });

    test('should call setActiveDevice action when activateDevice method is called ', () => {
        wrapper.find('tbody tr').trigger('click');

        expect(actions.setActiveDevice).toHaveBeenCalled();
    });
});
