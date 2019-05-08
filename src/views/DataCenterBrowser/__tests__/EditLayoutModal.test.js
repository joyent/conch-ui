import EditLayoutModal from '../EditLayoutModal.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { EventBus } from '@src/eventBus.js';

// Fixture
import { rack } from '@src/__fixtures__/rackLayout.js';

const GlobalPlugins = {
    install(v) {
        v.prototype.$bus = EventBus;
    },
};

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(GlobalPlugins);

jest.mock('../../../api/request.js');

describe('EditLayoutModal.vue', () => {
    let getters;
    let methods;
    let propsData;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        getters = { currentWorkspaceId: jest.fn() };
        methods = { closeModal: jest.fn(), save: jest.fn() };
        propsData = { deviceSlots: rack.slots };
        state = { rackLayout: {} };
        store = new Vuex.Store({ getters, state });
        wrapper = shallowMount(EditLayoutModal, {
            localVue, methods, propsData, store
        });
    });

    // Helper function
    const clickElement = (item) => {
        wrapper.find(item).trigger('click');
    };

    test('should call closeModal method when modal background is clicked', () => {
        clickElement('.modal-background');

        expect(methods.closeModal).toHaveBeenCalled();
    });

    test('should call closeModal method when X button is clicked', () => {
        clickElement('button.delete');

        expect(methods.closeModal).toHaveBeenCalled();
    });

    test('should call closeModal method when Cancel button is clicked', () => {
        clickElement('button.cancel');

        expect(methods.closeModal).toHaveBeenCalled();
    });

    test('should call the save method when the save button is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'save');
        clickElement('button.save');

        expect(spy).toHaveBeenCalled();
    });

    test('should set isActive = false on closeModal:editLayoutModal event emission', () => {
        methods = {};
        wrapper = shallowMount(EditLayoutModal, {
            localVue, methods, propsData, store
        });
        wrapper.setData({ isActive: true });

        clickElement('button.cancel');
        expect(wrapper.vm.isActive).toEqual(false);
    });

    test('should set isActive = true on openModal:editLayoutModal event emission ', () => {
        expect(wrapper.vm.isActive).toEqual(false);
        EventBus.$emit('openModal:editLayoutModal');
        expect(wrapper.vm.isActive).toEqual(true);
    });

    test('should display a notification if duplicate serial numbers are entered', async () => {
        expect.assertions(1);
        methods = {};
        wrapper = shallowMount(EditLayoutModal, {
            localVue, methods, propsData, store
        });
        const firstInput = wrapper.findAll('input.serial-number').at(0);
        const secondInput = wrapper.findAll('input.serial-number').at(1);

        secondInput.setValue(firstInput.element.value)

        await new Promise(resolve => setTimeout(() => {
            clickElement('button.save');
            expect(wrapper.html()).toContain('Device serial is duplicated')
            resolve();
        }, 800));
    });

    test('should update slot serial number if no duplicate entries exist', async () => {
        expect.assertions(2);
        methods = {};
        wrapper = shallowMount(EditLayoutModal, {
            localVue, methods, propsData, store
        });
        const firstInput = wrapper.findAll('input.serial-number').at(0);
        const slot = rack.slots[0];

        expect(firstInput.element.value).toEqual(slot.occupant.id);
        firstInput.setValue('ABCDEFG');

        await new Promise(resolve => setTimeout(() => {
            clickElement('button.save');
            expect(wrapper.vm.assignments[slot.id].id).toEqual('ABCDEFG');
            resolve();
        }, 800));
    });

    test('should update slot asset tag', async () => {
        expect.assertions(1);
        methods = {};
        wrapper = shallowMount(EditLayoutModal, {
            localVue, methods, propsData, store
        });
        const firstInput = wrapper.findAll('input.asset-tag').at(0);
        const slot = rack.slots[0];

        firstInput.setValue('ABCDEFG');

        await new Promise(resolve => setTimeout(() => {
            clickElement('button.save');
            expect(wrapper.vm.assignments[slot.id].assetTag).toEqual('ABCDEFG');
            resolve();
        }, 800));
    });
});
