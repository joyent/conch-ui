import PageHeader from '../PageHeader.vue';
import { shallowMount } from '@vue/test-utils';

describe('PageHeader.vue', () => {
    let propsData;
    let subtitle;
    let title;
    let wrapper;

    beforeEach(() => {
        subtitle = 'Update password and profile settings';
        title = 'User Profile';
        propsData = { title: title, subtitle: subtitle };
        wrapper = shallowMount(PageHeader, { propsData });
    });

    test('should render correctly on initial render', () => {
        expect(wrapper.html()).toMatchSnapshot();
    });

    test('should add a title from prop', () => {
        expect(wrapper.find('.title').html()).toContain(title);
    });

    test('should add a subtitle from prop', () => {
        expect(wrapper.find('.subtitle').html()).toContain(subtitle);
    });
});
