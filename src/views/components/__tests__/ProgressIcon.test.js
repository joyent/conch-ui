import ProgressIcon from '../ProgressIcon.vue';
import { shallowMount } from '@vue/test-utils';

describe('ProgressIcon.vue', () => {
  let propsData;
  let wrapper;

  beforeAll(() => {
    propsData = { progress: '' };
    wrapper = shallowMount(ProgressIcon, { propsData });
  });

  test('should display ellipsis-h icon when progress has no value', () => {
    expect(wrapper.find('.fa-ellipsis-h').exists()).toBeTruthy();
  });

  test('should display exclamation icon when progress is "failing"', () => {
    wrapper.setProps({ progress: 'failing' });

    expect(wrapper.find('.fa-exclamation').exists()).toBeTruthy();
  });

  test('should display spinner icon when progress is "in progress"', () => {
    wrapper.setProps({ progress: 'in progress' });

    expect(wrapper.find('.fa-spinner').exists()).toBeTruthy();
  });

  test('should display sync icon when progress is "active"', () => {
    wrapper.setProps({ progress: 'active' });

    expect(wrapper.find('.fa-sync').exists()).toBeTruthy();
  });

  test('should display check-circle icon when progress is "validated"', () => {
    wrapper.setProps({ progress: 'validated' });

    expect(wrapper.find('.fa-check-circle').exists()).toBeTruthy();
  });

  test('should display graduation-cap icon when progress is "graduated"', () => {
    wrapper.setProps({ progress: 'graduated' });

    expect(wrapper.find('.fa-graduation-cap').exists()).toBeTruthy();
  });
});
