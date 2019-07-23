import NetworkingTab from '../NetworkingTab.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import deviceDetails from '@src/__fixtures__/deviceDetails.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('NetworkingTab.vue', () => {
    let row;
    let state;
    let store;
    let wrapper;

    beforeEach(() => {
        state = { activeDeviceDetails: deviceDetails };
        store = new Vuex.Store({ state });
        wrapper = shallowMount(NetworkingTab, { localVue, store });
        row = wrapper.findAll('.row').at(0);
    });

    // Helper function
    const clickRow = () => {
        row.trigger('click');
    };

    test('should display "No networking details available" when device networking details are unavailable', () => {
        state = { activeDeviceDetails: {} };
        store = new Vuex.Store({ state });
        wrapper = shallowMount(NetworkingTab, { localVue, store });

        expect(wrapper.html()).toContain('No networking details available');
    });

    test('should not display any fa-caret-down icons on initial render', () => {
        expect(wrapper.html()).not.toContain('fa-caret-down');
    });

    test('should not have any rows selected on initial render', () => {
        expect(wrapper.html()).not.toContain('is-selected');
    });

    test('should display fa-caret-down icon when row is clicked', () => {
        clickRow();

        expect(row.html()).toContain('fa-caret-down');
    });

    test('should highlight a row when clicked', () => {
        clickRow();

        expect(row.classes()).toContain('is-selected');
    });

    test('should call the revealIfaceDetails method with the interface index when a row is clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'revealIfaceDetails');

        clickRow();

        expect(spy).toHaveBeenCalledWith(0);
    });
});
