import DevicesPanel from '../DevicesPanel.vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixtures
import devices from '@src/__fixtures__/devices.js';
import hardwareProductLookup from '@src/__fixtures__/hardwareProductLookup.js';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);

const router = new VueRouter();

describe('DevicesPanel.vue', () => {
    let actions;
    let getters;
    let propsData;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = { setActiveDevice: jest.fn() };
        getters = { activeDeviceId: jest.fn() };
        propsData = { hardwareProductLookup, workspaceDevices: devices };
        store = new Vuex.Store({ actions, getters });
        wrapper = shallowMount(DevicesPanel, {
            localVue,
            router,
            propsData,
            store,
        });
    });

    test('should call activateDevice method with device as parameter when device row is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'activateDevice');

        wrapper
            .findAll('a.panel-block')
            .at(0)
            .trigger('click');

        expect(spy).toHaveBeenCalledWith(propsData.workspaceDevices[0]);
    });

    test('should filter the devices displayed based on the clicked progress filter', () => {
        const devices = propsData.workspaceDevices;
        const panel = wrapper.find('.panel');

        wrapper
            .findAll('a.device-progress')
            .at(1)
            .trigger('click');

        expect(panel.html()).toContain(devices[0].id);
        expect(panel.html()).not.toContain(devices[4].id);
    });

    test('should filter the devices displayed based on the clicked hardware product filter', () => {
        const devices = propsData.workspaceDevices;
        const panel = wrapper.find('.panel');

        wrapper
            .findAll('a.hardware-product')
            .at(1)
            .trigger('click');

        expect(panel.html()).toContain(devices[5].id);
        expect(panel.html()).not.toContain(devices[4].id);
    });

    test('should filter the devices displayed based on search terms', () => {
        wrapper.find('input').setValue('ACEG');

        expect(wrapper.findAll('a.panel-block')).toHaveLength(3);
    });
});
