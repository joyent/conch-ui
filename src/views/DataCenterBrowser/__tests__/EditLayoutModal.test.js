import EditLayoutModal from '../EditLayoutModal.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixtures
import devices from '@src/__fixtures__/devices.js';
import { rack } from '@src/__fixtures__/rackLayout.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('../../../api/request.js');

describe('EditLayoutModal.vue', () => {
  let methods;
  let propsData;
  let state;
  let store;
  let wrapper;

  beforeEach(() => {
    methods = {
      closeModal: jest.fn(),
      saveModifiedAssignments: jest.fn(),
    };
    propsData = { deviceSlots: rack.slots };
    state = { devices, rackLayout: {} };
    store = new Vuex.Store({ state });
    wrapper = shallowMount(EditLayoutModal, {
      localVue,
      methods,
      propsData,
      store,
    });
  });

  // Helper function
  const clickElement = item => {
    wrapper.find(item).trigger('click');
  };

  test('should not display any input fields on initial render', () => {
    expect(wrapper.find('input').exists()).toBeFalsy();
  });

  describe('closing the modal', () => {
    test('should call closeModal method when modal background is clicked', () => {
      clickElement('.modal-background');

      expect(methods.closeModal).toHaveBeenCalled();
    });

    test('should call closeModal method when X button is clicked', () => {
      clickElement('button.delete');

      expect(methods.closeModal).toHaveBeenCalled();
    });

    test('should call closeModal method when Close button is clicked', () => {
      clickElement('.close-modal');

      expect(methods.closeModal).toHaveBeenCalled();
    });
  });

  describe('clicking an Edit button', () => {
    test('should display a serial number input field', () => {
      clickElement('.edit');

      expect(wrapper.find('input.serial-number').exists()).toBeTruthy();
    });

    test('should display an asset tag input field', () => {
      clickElement('.edit');

      expect(wrapper.find('input.asset-tag').exists()).toBeTruthy();
    });

    test('should display a cancel button', () => {
      clickElement('.edit');

      expect(wrapper.find('.cancel').exists()).toBeTruthy();
    });

    test('should change the Close button to Save Changes', () => {
      clickElement('.edit');

      expect(wrapper.find('.save-changes').exists()).toBeTruthy();
    });
  });

  describe('clicking a Cancel button', () => {
    test('should hide the input fields', () => {
      clickElement('.edit');
      clickElement('.cancel');

      expect(wrapper.find('input').exists()).toBeFalsy();
    });

    test('should change the Save Changes button to the Close button when last Cancel button is clicked', () => {
      clickElement('.edit');
      clickElement('.cancel');

      expect(wrapper.find('.close-modal').exists()).toBeTruthy();
    });
  });

  test('should call saveModifiedAssignments when Save Changes button is clicked', () => {
    const spy = jest.spyOn(wrapper.vm, 'saveModifiedAssignments');

    clickElement('.edit');
    clickElement('.save-changes');

    expect(spy).toHaveBeenCalled();
  });

  describe('input validation', () => {
    beforeEach(() => {
      methods = { closeModal: jest.fn() };
      wrapper = shallowMount(EditLayoutModal, {
        localVue,
        methods,
        propsData,
        store,
      });
    });

    test('should show "Duplicate serial number" error', () => {
      const deviceId = devices[1].id;

      clickElement('.edit');
      wrapper.find('input.serial-number').setValue(deviceId);
      clickElement('.save-changes');

      expect(wrapper.html()).toContain('Duplicate serial number');
    });

    test('should show "Duplicate asset tag" error', () => {
      const deviceAssetTag = devices[1].asset_tag;

      clickElement('.edit');
      wrapper.find('input.asset-tag').setValue(deviceAssetTag);
      clickElement('.save-changes');

      expect(wrapper.html()).toContain('Duplicate asset tag');
    });

    test('should show "Invalid Serial Number" error when a serial number with "." is submitted', () => {
      clickElement('.edit');
      wrapper.find('input.serial-number').setValue('hello.world');
      clickElement('.save-changes');

      expect(wrapper.html()).toContain('Invalid serial number');
    });

    test('should show "Invalid Serial Number" error when a serial number with "/" is submitted', () => {
      clickElement('.edit');
      wrapper.find('input.serial-number').setValue('hello/world');
      clickElement('.save-changes');

      expect(wrapper.html()).toContain('Invalid serial number');
    });

    test('should show "Invalid Serial Number" error when a serial number with whitespace is submitted', () => {
      clickElement('.edit');
      wrapper.find('input.serial-number').setValue('hello world');
      clickElement('.save-changes');

      expect(wrapper.html()).toContain('Invalid serial number');
    });
  });
});
