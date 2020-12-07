import OrganizationsTab from '../OrganizationsTab.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixture
import { builds, buildOrganizations } from '@src/__fixtures__/builds.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('OrganizationsTab.vue', () => {
  let propsData;
  let state;
  let store;
  let wrapper;

  beforeEach(() => {
    propsData = { buildId: builds[0].id };
    state = { currentBuildOrganizations: buildOrganizations };
    store = new Vuex.Store({ state });
    wrapper = shallowMount(OrganizationsTab, {
      localVue,
      propsData,
      store,
    });
  });

  test('should filter results when search text is entered', () => {
    // expected result count before search
    expect(wrapper.findAll('tr.row')).toHaveLength(2);

    wrapper.find('input.search').setValue('Infrastructure');

    // expected result count after search
    expect(wrapper.findAll('tr.row')).toHaveLength(1);
  });

  describe('initial render', () => {
    test('should not display RemoveItemModal', () => {
      expect(wrapper.find('removeitemmodal-stub').exists()).toBeFalsy();
    });

    test('should not display AddOrganizationModal', () => {
      expect(wrapper.find('addorganizationmodal-stub').exists()).toBeFalsy();
    });
  });

  test('should display the RemoveItemModal component when trash icon is clicked', () => {
    wrapper.find('i.remove-organization').trigger('click');

    expect(wrapper.find('removeitemmodal-stub').exists()).toBeTruthy();
  });

  test('should display the AddOrganizationModal when Add Organization button is clicked', () => {
    wrapper.find('i.add-organization').trigger('click');

    expect(wrapper.find('addorganizationmodal-stub').exists()).toBeTruthy();
  });

  test('should filter results to admins when Admins is selected on the Role select dropdown', () => {
    const options = wrapper.find('select').findAll('option');
    options.at(1).setSelected();

    expect(wrapper.findAll('tr.row')).toHaveLength(1);
  });

  test('should filter results to regular users when Regular Users is selected on the Role select dropdown', () => {
    const options = wrapper.find('select').findAll('option');
    options.at(2).setSelected();

    expect(wrapper.findAll('tr.row')).toHaveLength(1);
  });
});
