import StorageTab from '../StorageTab.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import deviceDetails from '../../../__fixtures__/deviceDetails';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('StorageTab.vue', () => {
  let row;
  let state;
  let store;
  let wrapper;

  beforeEach(() => {
    state = { activeDeviceDetails: deviceDetails };
    store = new Vuex.Store({ state });
    wrapper = shallowMount(StorageTab, { localVue, store });
    row = wrapper.findAll('.row').at(0);
  });

  // Helper function
  const clickRow = () => {
    row.trigger('click');
  };

  test('should display "No storage details available" when device storage details are unavailable', () => {
    const testState = {
      activeDeviceDetails: {
        latest_report: {
          disks: null,
        },
      },
    };
    store = new Vuex.Store({ state: testState });
    wrapper = shallowMount(StorageTab, { localVue, store });

    expect(wrapper.html()).toContain('No storage details available');
  });

  test('should not display any fa-caret-down icons on initial render', () => {
    expect(wrapper.find('.row').html()).not.toContain('fa-caret-down');
  });

  test('should not have any rows selected on initial render', () => {
    expect(wrapper.html()).not.toContain('is-selected');
  });

  test('should display fa-caret-down icon when row is clicked', () => {
    clickRow();

    expect(row.html()).toContain('fa-caret-down');
  });

  test('should add "is-selected" class to a row after it has been clicked', () => {
    clickRow();

    expect(row.classes()).toContain('is-selected');
  });

  test('should call the revealDiskDetails method with the disk index when a row is clicked', () => {
    const spy = jest.spyOn(wrapper.vm, 'revealDiskDetails');

    clickRow();

    expect(spy).toHaveBeenCalledWith(0);
  });
});
