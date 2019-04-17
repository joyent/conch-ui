import ResultModal from '../ResultModal.vue';
import { shallowMount } from '@vue/test-utils';

describe('ResultModal.vue', () => {
    let methods;
    let wrapper;

    beforeEach(() => {
        methods = { triggerParentCloseModal: jest.fn() };
        wrapper = shallowMount(ResultModal, { methods });
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
