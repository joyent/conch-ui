import ValidationTab from '../ValidationTab.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixtures
import deviceValidations from '@src/__fixtures__/deviceValidations.js';
import validations from '@src/__fixtures__/validations.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('ValidationTab.vue', () => {
  let row;
  let state;
  let store;
  let wrapper;

  beforeEach(() => {
    state = { activeDeviceValidations: deviceValidations, validations };
    store = new Vuex.Store({ state });
    wrapper = shallowMount(ValidationTab, { localVue, store });
    row = wrapper.find('.row');
  });

  // Helper function
  const clickRow = () => {
    row.trigger('click');
  };

  test('should display loading indicator when disks is empty', () => {
    state.activeDeviceValidations = [];
    state.validations = [];

    expect(wrapper.html()).toContain('spinner-stub');
  });

  test('should not display any fa-caret-down icons on initial render', () => {
    expect(wrapper.find('.row').html()).not.toContain('fa-caret-down');
  });

  test('should display fa-caret-down icon when row is clicked', () => {
    clickRow();

    expect(row.html()).toContain('fa-caret-down');
  });

  test('should call the revealValidationDetails method with the disk index when a row is clicked', () => {
    const methods = { revealValidationDetails: jest.fn() };
    const wrapper = shallowMount(ValidationTab, {
      localVue,
      methods,
      store,
    });
    wrapper.find('.row').trigger('click');

    expect(methods.revealValidationDetails).toHaveBeenCalledWith(0);
  });

  test('should not have any rows selected on initial render', () => {
    expect(wrapper.html()).not.toContain('is-selected');
  });

  test('should add "is-selected" class to a row after it has been clicked', () => {
    clickRow();

    expect(wrapper.html()).toContain('is-selected');
  });

  test('should display a blue box with a number of passing validations', () => {
    const tag = wrapper.find('.tag.is-info');

    expect(tag.exists()).toBeTruthy();
    expect(tag.text()).toEqual('1');
  });

  test('should display an orange box with a number of failing validations', () => {
    const tag = wrapper.find('.tag.is-warning');

    expect(tag.exists()).toBeTruthy();
    expect(tag.text()).toEqual('1');
  });

  test('should display an exclamation mark in a yellow triangle if the validation has been deactivated', () => {
    expect(wrapper.find('i.fa-exclamation-triangle').exists()).toBeTruthy();
  });

  test('should display a checkmark in a green circle if the validation is active', () => {
    state.validations[0].deactivated = null;
    store = new Vuex.Store({ state });
    wrapper = shallowMount(ValidationTab, { localVue, store });

    expect(wrapper.find('i.fa-check-circle').exists()).toBeTruthy();
  });
});
