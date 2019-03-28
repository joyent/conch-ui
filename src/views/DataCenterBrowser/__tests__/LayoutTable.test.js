import LayoutTable from "../LayoutTable.vue";
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import { rack } from '@src/__fixtures__/rackLayout.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('LayoutTable.vue', () => {
    let actions;
    let propsData;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = { setActiveDevice: jest.fn() };
        state = { hightlightDeviceId: '' },
        propsData = { deviceSlots: rack.slots };
        store = new Vuex.Store({ actions, state });
        wrapper = shallowMount(LayoutTable, { localVue, propsData, store });
    });

    // Helper function
    const clickRow = () => {
        wrapper.find('tbody tr').trigger('click');
    };

    test('should call activateDevice method with device as parameter when a device row is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'activateDevice');

        clickRow();

        expect(spy).toHaveBeenCalledWith(propsData.deviceSlots[0]);
    });

    test('should call setActiveDevice action when activateDevice method is called ', () => {
        clickRow();

        expect(actions.setActiveDevice).toHaveBeenCalled();
    });
});
