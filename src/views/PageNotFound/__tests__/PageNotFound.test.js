import PageNotFound from '../PageNotFound.vue';
import { shallowMount } from '@vue/test-utils';

describe('PageNotFound.vue', () => {
  let methods;
  let wrapper;

  beforeEach(() => {
    methods = { routeToMostRecentBuild: jest.fn() };
    wrapper = shallowMount(PageNotFound, { methods });
  });

  test('should render correctly on initial render', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('should call routeToMostRecentBuild when "Most Recent Build" button clicked', () => {
    wrapper.find('a.button.recent-build').trigger('click');

    expect(methods.routeToMostRecentBuild).toHaveBeenCalled();
  });
});
