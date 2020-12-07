import BaseModal from '../BaseModal.vue';
import { shallowMount } from '@vue/test-utils';

describe('BaseModal.vue', () => {
  let wrapper;
  let spy;

  beforeEach(() => {
    wrapper = shallowMount(BaseModal);
    spy = jest.spyOn(wrapper.vm, 'closeModal');
  });

  test('should call the closeModal method when modal background is clicked', () => {
    wrapper.find('.modal-background').trigger('click');
    expect(spy).toHaveBeenCalled();
  });

  test('should call the closeModal method when the modal close button is clicked', () => {
    wrapper.find('button.delete').trigger('click');
    expect(spy).toHaveBeenCalled();
  });
});
