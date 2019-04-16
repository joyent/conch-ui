import SuccessModal from '../SuccessModal.vue';
import { shallowMount } from '@vue/test-utils';

describe('SuccessModal.vue', () => {
    let methods;
    let wrapper;

    beforeEach(() => {
        methods = { triggerParentCloseModal: jest.fn() };
        wrapper = shallowMount(SuccessModal, { methods });
    });

    test('should set isActive to false to close the modal when the close button is clicked', () => {
        wrapper.find('.delete').trigger('click');

        expect(wrapper.vm.isActive).toEqual(false);
    });

    test('should set isActive to false when the modal background is clicked', () => {
        wrapper.find('.modal-background').trigger('click');

        expect(wrapper.vm.isActive).toEqual(false);
    });
});
