import PageNotFound from '../PageNotFound.vue';
import { shallowMount } from '@vue/test-utils';

describe('PageNotFound.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(PageNotFound);
    });

    test('should render correctly on initial render', () => {
        expect(wrapper.html()).toMatchSnapshot();
    });

    test('should redirect user to dashboard page when "Most Recent Build" button clicked', () => {
        wrapper.find('a.button.recent-build').trigger('click');

        expect(wrapper.vm.$route.name).toEqual('dashboard');
    });

    test('should call routeToMostRecentBuild when "Most Recent Build" button clicked', () => {
        const spy = jest.spyOn(wrapper.vm, 'routeToMostRecentBuild');

        wrapper.find('a.button.recent-build').trigger('click');

        expect(spy).toHaveBeenCalled();
    });
});
