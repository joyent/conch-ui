import DeviceModal from '../DeviceModal.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { EventBus } from '@src/eventBus.js';

// Fixture
import devices from '@src/__fixtures__/devices.js';

const GlobalPlugins = {
    install(v) {
        v.prototype.$bus = EventBus;
    },
};
const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(GlobalPlugins);

describe('DeviceModal.vue', () => {
    let actions;
    let methods;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = { clearActiveDevice: jest.fn() };
        methods = { closeModal: jest.fn() };
        state = { activeDevice: devices[0] };
        store = new Vuex.Store({ actions, state });
        wrapper = shallowMount(DeviceModal, { localVue, methods, store });
    });

    test('should display a loading indicator when no activeDevice is available', () => {
        state = { activeDevice: {} };
        store = new Vuex.Store({ actions, state });
        wrapper = shallowMount(DeviceModal, { localVue, methods, store });

        expect(wrapper.find('spinner-stub').exists()).toBeTruthy();
    });

    test('should call closeModal method when modal background is clicked', () => {
        wrapper.find('.modal-background').trigger('click');

        expect(methods.closeModal).toHaveBeenCalled();
    });

    test('should close the modal when close button is clicked', () => {
        wrapper.find('button.delete').trigger('click');

        expect(wrapper.find('.modal.is-active').exists()).toBeFalsy();
    });

    test('should emit closeModal:deviceModal event when modal background is clicked', () => {
        expect.assertions(1);
        wrapper = shallowMount(DeviceModal, { localVue, store });

        EventBus.$on('closeModal:deviceModal', () => {
            wrapper.vm.$emit('closeModal:deviceModal');
        });

        wrapper.vm.$on('closeModal:deviceModal', () => {
            expect(wrapper.emitted()).toHaveProperty('closeModal:deviceModal');
        });

        wrapper.find('.modal-background').trigger('click');
    });
});
