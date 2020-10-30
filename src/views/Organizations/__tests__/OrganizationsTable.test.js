import OrganizationsTable from '../OrganizationsTable.vue';
import { shallowMount } from '@vue/test-utils';

// Fixture
import organizations from '@src/__fixtures__/organizations.js';

describe('OrganizationsTable.vue', () => {
  let propsData;
  let wrapper;

  beforeEach(() => {
    propsData = { organizations: [], hasSearchText: false };
    wrapper = shallowMount(OrganizationsTable, { propsData });
  });

  test('should display a loading indicator if organizations are still being loaded', () => {
    expect(wrapper.html()).toContain('spinner-stub');
  });

  test('should not display loading indicator when organizations are loaded', () => {
    propsData.organizations = organizations;

    wrapper = shallowMount(OrganizationsTable, { propsData });

    expect(wrapper.html()).not.toContain('spinner-stub');
  });
});
