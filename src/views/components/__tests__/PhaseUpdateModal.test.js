import PhaseUpdateModal from '../PhaseUpdateModal.vue';
import Vuex from 'vuex';
import { createLocalVue, mount } from '@vue/test-utils';
import * as deviceApi from '@api/device.js';
import * as rackApi from '@api/rack.js';

// Fixtures
import deviceDetails from '@src/__fixtures__/deviceDetails.js';
import { rackLayout } from '@src/__fixtures__/rackLayout.js';
import workspaces from '@src/__fixtures__/workspaces.js';

const localVue = createLocalVue();

localVue.use(Vuex);

jest.mock('@api/request.js');

describe('PhaseUpdateModal.vue', () => {
    let actions;
    let confirmButton;
    let propsData;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = {
            setActiveDeviceDetails: jest.fn(),
            setRackLayout: jest.fn(),
        };
        propsData = { item: 'device', itemData: deviceDetails };
        state = { currentWorkspace: workspaces[0], rackLayout };
        store = new Vuex.Store({ actions, state });
        wrapper = mount(PhaseUpdateModal, { localVue, propsData, store });
        confirmButton = wrapper.find('.button.confirm');
    });

    test('should display a warning on the confirmation button when current phase and selected phase are the same', () => {
        const expectedText = 'this device is already in the integration phase';
        expect(confirmButton.text().toLowerCase()).toContain(expectedText);
    });

    test('should display a confirmation button with text "update phase to <phase>"', () => {
        const expectedText = 'update phase to integration';
        const localDeviceDetails = deviceDetails;

        localDeviceDetails.phase = 'installation';
        propsData = {
            item: 'device',
            itemData: localDeviceDetails,
        };
        wrapper = mount(PhaseUpdateModal, { localVue, propsData, store });
        confirmButton = wrapper.find('.button.confirm');

        expect(confirmButton.text().toLowerCase()).toEqual(expectedText);
    });

    describe('closing the modal', () => {
        test('should close the modal when the close button (x) is clicked', () => {
            wrapper.find('button.delete').trigger('click');

            expect(wrapper.find('.modal.is-active').exists()).toBeFalsy();
        });

        test('should close the modal when the modal background is clicked', () => {
            wrapper.find('.modal-background').trigger('click');

            expect(wrapper.find('.modal.is-active').exists()).toBeFalsy();
        });
    });

    describe('device item', () => {
        beforeEach(() => {
            propsData = {
                item: 'device',
                itemData: deviceDetails,
            };
            wrapper = mount(PhaseUpdateModal, { localVue, propsData, store });
        });

        test('should display a device icon', () => {
            expect(wrapper.find('.fa-hdd').exists()).toBeTruthy();
        });

        test('should display text "Update Device Phase"', () => {
            expect(
                wrapper
                    .find('h1.title')
                    .text()
                    .toLowerCase()
            ).toEqual('update device phase');
        });

        test('should display device id', () => {
            expect(wrapper.find('.device-id').text()).toEqual(
                `Device: ${deviceDetails.id}`
            );
        });

        test('should display current phase', () => {
            expect(wrapper.find('.phase').text()).toContain(
                deviceDetails.phase
            );
        });

        test('should call the setDevicePhase API method when confirm button is clicked', () => {
            const spy = jest.spyOn(deviceApi, 'setDevicePhase');

            wrapper.find('.button.confirm').trigger('click');

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('rack item', () => {
        beforeEach(() => {
            propsData = {
                item: 'rack',
                itemData: rackLayout,
            };
            wrapper = mount(PhaseUpdateModal, { localVue, propsData, store });
        });

        test('should display a rack icon', () => {
            expect(wrapper.find('.fa-server').exists()).toBeTruthy();
        });

        test('should display text "Update Rack Phase"', () => {
            expect(
                wrapper
                    .find('h1.title')
                    .text()
                    .toLowerCase()
            ).toEqual('update rack phase');
        });

        test('should display rack name', () => {
            expect(wrapper.find('.rack-name').text()).toEqual(
                `Rack: ${rackLayout.name}`
            );
        });

        test('should display current phase', () => {
            expect(wrapper.find('.phase').text()).toContain(rackLayout.phase);
        });

        test('should call the setRackPhase API method when confirm button is clicked', () => {
            const spy = jest.spyOn(rackApi, 'setRackPhase');
            const localRackLayout = rackLayout;

            localRackLayout.phase = 'installation';
            propsData = {
                item: 'rack',
                itemData: localRackLayout,
            };
            wrapper = mount(PhaseUpdateModal, { localVue, propsData, store });

            wrapper.find('.button.confirm').trigger('click');

            expect(spy).toHaveBeenCalled();
        });
    });
});
