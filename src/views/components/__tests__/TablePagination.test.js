import TablePagination from '../TablePagination.vue';
import { mount } from '@vue/test-utils';

describe('TablePagination.vue', () => {
    let propsData;
    let wrapper;

    beforeEach(() => {
        propsData = { totalResults: 101 };
        wrapper = mount(TablePagination, { propsData });
    });

    test('should display the first page button as "is-current" on initial render', () => {
        expect(
            wrapper
                .findAll('.page')
                .at(0)
                .classes()
        ).toContain('is-current');
    });

    test('should show "Prev" button as disabled on initial render', () => {
        expect(wrapper.find('.prev').attributes('disabled')).toBeTruthy();
    });

    test('should only display one page button as "is-current" at a time', () => {
        expect(wrapper.findAll('.is-current')).toHaveLength(1);
    });

    test('should set page button to "is-current" when it is clicked', () => {
        wrapper
            .findAll('.page')
            .at(1)
            .trigger('click');

        expect(
            wrapper
                .findAll('.page')
                .at(1)
                .classes()
        ).toContain('is-current');
    });

    test('should set the previous page button as new current page when "Prev" button is clicked', () => {
        wrapper
            .findAll('.page')
            .at(1)
            .trigger('click');
        wrapper.find('.prev').trigger('click');

        expect(
            wrapper
                .findAll('.page')
                .at(0)
                .classes()
        ).toContain('is-current');
    });

    test('should set the next page button as new current page when "Next" button is clicked', () => {
        wrapper.find('.next').trigger('click');

        expect(
            wrapper
                .findAll('.page')
                .at(1)
                .classes()
        ).toContain('is-current');
    });

    test('should not display "Prev" button when only one page exists', () => {
        wrapper.setData({ resultsPerPage: 125 });

        expect(wrapper.find('.prev').exists()).toBeFalsy();
    });

    test('should not display the "Next" button when only one page exists', () => {
        wrapper.setData({ resultsPerPage: 125 });

        expect(wrapper.find('.next').exists()).toBeFalsy();
    });

    test('should show "Next" button as disabled when the last available page is the current page', () => {
        wrapper.setData({ resultsPerPage: 75 });
        wrapper
            .findAll('.page')
            .at(1)
            .trigger('click');

        expect(wrapper.find('.next').attributes('disabled')).toBeTruthy();
    });
});
