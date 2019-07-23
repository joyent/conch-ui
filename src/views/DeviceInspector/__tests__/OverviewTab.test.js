import OverviewTab from '../OverviewTab';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { EventBus } from '@src/eventBus.js';

// Fixtures
import deviceDetails from '@src/__fixtures__/deviceDetails.js';
import deviceSettings from '@src/__fixtures__/deviceSettings.js';
import workspaces from '@src/__fixtures__/workspaces.js';

const GlobalPlugins = {
    install(v) {
        // EventBus
        v.prototype.$bus = EventBus;
    },
};
const localVue = createLocalVue();
const router = new VueRouter();

localVue.use(GlobalPlugins);
localVue.use(Vuex);
localVue.use(VueRouter);

describe('OverviewTab.vue', () => {
    let actions;
    let button;
    let getters;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        actions = {
            setActiveRoomName: jest.fn(),
            setHighlightDeviceId: jest.fn(),
            setShowDeviceInRack: jest.fn(),
        };
        getters = { activeDeviceId: state => state.activeDeviceDetails.id };
        state = {
            activeDeviceDetails: deviceDetails,
            activeDeviceSettings: deviceSettings,
            currentWorkspace: workspaces[0],
        };
        store = new Vuex.Store({ actions, getters, state });
        wrapper = shallowMount(OverviewTab, { localVue, router, store });
        button = wrapper.find('button.show-device-in-rack');
    });

    // Helper function
    const clickButton = () => {
        wrapper.find('button.show-device-in-rack').trigger('click');
    };

    describe('Events', () => {
        test('should emit showDeviceInRack using global EventBus', () => {
            expect.assertions(1);

            EventBus.$on('showDeviceInRack', () => {
                wrapper.vm.$emit('showDeviceInRack');
            });

            wrapper.vm.$on('showDeviceInRack', () => {
                expect(wrapper.emitted()).toHaveProperty('showDeviceInRack');
            });

            clickButton();
        });

        test('should emit closeModal:deviceModal using global EventBus', () => {
            expect.assertions(1);

            EventBus.$on('closeModal:deviceModal', () => {
                wrapper.vm.$emit('closeModal:deviceModal');
            });

            wrapper.vm.$on('closeModal:deviceModal', () => {
                expect(wrapper.emitted()).toHaveProperty(
                    'closeModal:deviceModal'
                );
            });

            clickButton();
        });
    });

    describe('Show Device in Rack', () => {
        test('should call showDeviceInRack method when "Show Device in Rack" button is clicked', () => {
            const spy = jest.spyOn(wrapper.vm, 'showDeviceInRack');

            clickButton();

            expect(spy).toHaveBeenCalled();
        });

        test('should call setHighlightDeviceId action when "Show Device in Rack" is clicked', () => {
            clickButton();

            expect(actions.setHighlightDeviceId).toHaveBeenCalled();
        });

        test('should call setShowDeviceInRack action when "Show Device in Rack" is clicked', () => {
            clickButton();

            expect(actions.setShowDeviceInRack).toHaveBeenCalled();
        });

        test('should display "Show Device in Rack" button if device has a location', () => {
            const location = state.activeDeviceDetails.location;

            expect(location).not.toBe(null);
            expect(location).not.toEqual('{}');
            expect(button.html()).toContain('Show Device in Rack');
        });

        test('should not display "Show Device in Rack" button if device does not have a location', () => {
            state.activeDeviceDetails.location = null;

            expect(
                wrapper.find('button.show-device-in-rack').exists()
            ).toBeFalsy();
        });
    });

    describe('Tags section', () => {
        test('should display a blue "Passing Validation" tag when device health is "pass"', () => {
            const tag = wrapper.find('.tag.is-info.health-pass');

            expect(tag.html()).toContain('Passing Validation');
        });

        test('should display a red "Failing Validation" tag when device health is "fail"', () => {
            state.activeDeviceDetails.health = 'fail';
            const tag = wrapper.find('.tag.is-danger.health-fail');

            expect(tag.html()).toContain('Failing Validation');
        });

        test('should display a yellow "No Report" tag when device health is "unknown"', () => {
            state.activeDeviceDetails.health = 'unknown';
            const tag = wrapper.find('.tag.is-warning.health-unknown');

            expect(tag.html()).toContain('No Report');
        });

        test('should display a yellow "Firmware Updating" tag when device firmware is "updating"', () => {
            state.activeDeviceSettings.firmware = 'updating';
            const tag = wrapper.find('.tag.is-warning.firmware-updating');

            expect(tag.html()).toContain('Firmware Updating');
        });

        test('should display a green "Validated" tag when device is validated', () => {
            const tag = wrapper.find('.tag.is-success.validated');

            expect(tag.html()).toContain('Validated');
        });

        test('should display a green "Graduated" tag when device is graduated', () => {
            const tag = wrapper.find('.tag.is-success.graduated');

            expect(tag.html()).toContain('Graduated');
        });

        test('should display a green "Triton Setup" tag when device has completed Triton Setup', () => {
            state.activeDeviceDetails.triton_setup =
                '2018-05-16T10:34:45.356014-07:00';
            const tag = wrapper.find('.tag.is-success.triton-setup');

            expect(tag.html()).toContain('Triton Setup');
        });
    });

    describe('Last Reported section', () => {
        test('should display last_seen value in the "Last Reported" section', () => {
            expect(wrapper.find('.last-seen').html()).toContain(
                wrapper.vm.lastSeen
            );
        });

        test('should display "Never" in the "Last Reported" section when last_seen has no data', () => {
            state.activeDeviceDetails.last_seen = '';

            expect(wrapper.vm.lastSeen).toEqual('Invalid date');
            expect(wrapper.find('.last-seen').html()).toContain('Never');
        });
    });

    describe('Uptime section', () => {
        test('should display uptime_since in the "Uptime" section', () => {
            const uptimeSince = wrapper.vm.uptimeSince;

            expect(wrapper.find('.uptime-since').html()).toContain(uptimeSince);
        });

        test('should display "Unknown" in the "Uptime" section when uptime_since has no data', () => {
            state.activeDeviceDetails.uptime_since = '';

            expect(wrapper.vm.uptimeSince).toEqual('Invalid date');
            expect(wrapper.find('.uptime-since').html()).toContain('Unknown');
        });
    });

    describe('BIOS Version section', () => {
        test('should display bios_version in the "BIOS Version" section', () => {
            const biosVersion =
                state.activeDeviceDetails.latest_report.bios_version;

            expect(wrapper.find('.bios-version').html()).toContain(biosVersion);
        });

        test('should display "Unknown" in the "BIOS Version" section when bios_version has no data', () => {
            state.activeDeviceDetails.latest_report.bios_version = '';

            expect(wrapper.find('.bios-version').html()).toContain('Unknown');
        });
    });

    describe('device phase', () => {
        test('should display a button to update device phase if user has write permissions', () => {
            expect(state.currentWorkspace.role).toEqual('admin');
            expect(wrapper.find('.update-phase').exists()).toBeTruthy();
        });

        test('should not display a button to update device phase if user does not have write permissions', () => {
            const localCurrentWorkspace = workspaces[0];
            localCurrentWorkspace.role = 'ro';
            state.currentWorkspace = localCurrentWorkspace;
            store = new Vuex.Store({ actions, getters, state });
            wrapper = shallowMount(OverviewTab, { localVue, router, store });

            expect(wrapper.find('.update-phase').exists()).toBeFalsy();
        });

        test('should display the current phase of the device', () => {
            expect(wrapper.find('.device-phase').text()).toContain(
                state.activeDeviceDetails.phase
            );
        });
    });
});
