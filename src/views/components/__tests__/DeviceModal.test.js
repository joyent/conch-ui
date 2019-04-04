import DeviceModal from '../DeviceModal.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { EventBus } from '../../../eventBus.js';

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
    let getters;
    let methods;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = { clearActiveDevice: jest.fn() };
        getters = { activeDeviceId: jest.fn() };
        methods = { closeModal: jest.fn() };
        store = new Vuex.Store({ actions, getters });
        wrapper = shallowMount(DeviceModal, { localVue, methods, store });
    });

    test('should display a loading indicator when no activeDeviceId is available', () => {
        expect(wrapper.html()).toContain('spinner-stub');
    });

    test('should display the DeviceInspector component when activeDeviceId is available', () => {
        getters.activeDeviceId = jest.fn(() => 1010);
        store = new Vuex.Store({ getters });
        wrapper = shallowMount(DeviceModal, { localVue, store });

        expect(wrapper.html()).toContain('deviceinspector-stub');
    });

    test('should call closeModal method when modal background is clicked', () => {
        wrapper.find('.modal-background').trigger('click');

        expect(methods.closeModal).toHaveBeenCalled();
    });

    test('should call closeModal method when close button is clicked', () => {
        wrapper.find('button.delete').trigger('click');

        expect(methods.closeModal).toHaveBeenCalled();
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
