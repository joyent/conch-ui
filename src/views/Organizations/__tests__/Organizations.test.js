import Organizations from '../Organizations.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import * as organizationsApi from '@api/organizations.js';

// Fixtures
import organizations from '@src/__fixtures__/organizations.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@api/request.js');

describe('Organizations.vue', () => {
  let actions;
  let mocks;
  let state;
  let store;
  let wrapper;

  beforeEach(() => {
    actions = {
      setOrganizations: jest.fn(),
    };
    mocks = {
      $router: [],
    };
    state = {
      organizations: [],
    };
    store = new Vuex.Store({ actions, state });
    wrapper = shallowMount(Organizations, { localVue, mocks, store });
  });

  describe('initial page load', () => {
    test('should display a loading indicator when loading organizations from state or API', () => {
      wrapper.setData({ noOrganizationsExist: false });
      expect(wrapper.html()).toContain('spinner-stub');
    });

    test('should display "No Organizations exist" when no organizations exist', () => {
      wrapper.setData({ noOrganizationsExist: true });
      expect(wrapper.html()).toContain('No Organizations exist');
    });

    test('should not display OrganizationsTable component', () => {
      expect(wrapper.find('organizationstable-stub').exists()).toBeFalsy();
    });

    test('should not display the Create Organization modal', () => {
      expect(wrapper.find('addorganizationmodal-stub').exists()).toBeFalsy();
    });

    test('should not display the Delete Organization confirmation modal', () => {
      expect(wrapper.find('.remove-item-modal').exists()).toBeFalsy();
    });

    test('should not display the Success modal', () => {
      expect(wrapper.find('succesmodal-stub').exists()).toBeFalsy();
    });
  });

  describe('page header', () => {
    beforeEach(() => {
      state = { organizations };
      store = new Vuex.Store({ actions, state });
      wrapper = shallowMount(Organizations, { localVue, mocks, store });
    });

    test('should filter organization results when search input is entered', () => {
      const searchText = 'Network Engineering';

      const resultCountBeforeSearch = wrapper.findAll('.card');
      // confirm expected initial count of organization cards
      expect(resultCountBeforeSearch).toHaveLength(2);

      wrapper.find('input.search').setValue(searchText);

      const resultCountAfterSearch = wrapper.findAll('.card');
      // confirm results are filtered correctly
      expect(resultCountAfterSearch).toHaveLength(1);

      // confirm filtered result matches search input
      expect(wrapper.find('.organization-name').text()).toContain(searchText);
    });

    test('should display the Create Organization Modal when "Create Organization button clicked', () => {
      wrapper.find('.button.create-organization').trigger('click');

      expect(wrapper.find('addorganizationmodal-stub').exists()).toBeTruthy();
    });

    test('clicking the "Table View" button should display the OrganizationsTable component', () => {
      const viewToggle = wrapper.find('.views');
      viewToggle.find('a.button').trigger('click');

      expect(wrapper.find('organizationstable-stub').exists()).toBeTruthy();
    });
  });

  describe('organization card', () => {
    let card;

    beforeEach(() => {
      state = { organizations };
      store = new Vuex.Store({ actions, state });
      wrapper = shallowMount(Organizations, { localVue, mocks, store });
      card = wrapper.find('.card');
    });

    test('should call the viewOrganization function when "View Organization" button is clicked', () => {
      const spy = jest.spyOn(wrapper.vm, 'viewOrganization');
      card.find('.button').trigger('click');

      expect(spy).toHaveBeenCalled();
    });

    test('should call the showConfirmationModal function when X button is clicked', () => {
      const spy = jest.spyOn(wrapper.vm, 'showConfirmationModal');
      card.find('.close').trigger('click');

      expect(spy).toHaveBeenCalled();
    });

    test('should display the Remove Organization confirmation modal when X button is clicked', () => {
      card.find('.close').trigger('click');

      expect(wrapper.html()).toContain('remove-item-modal');
    });

    describe('remove organization modal', () => {
      let modal;

      beforeEach(() => {
        card.find('.close').trigger('click');
        modal = wrapper.find('.remove-item-modal');
      });

      describe('closing the modal', () => {
        test('should close modal when modal background is clicked', () => {
          wrapper.find('.modal-background').trigger('click');

          expect(wrapper.find('.remove-item-modal').exists()).toBeFalsy();
        });

        test('should close modal when X button is clicked', () => {
          modal.find('i.close').trigger('click');

          expect(wrapper.find('.remove-item-modal').exists()).toBeFalsy();
        });

        test('should close the modal when the Cancel button is clicked', () => {
          modal.find('.button.cancel').trigger('click');

          expect(wrapper.find('.remove-item-modal').exists()).toBeFalsy();
        });
      });

      test('should display the name of the organization being deleted', () => {
        const organizationName = organizations[0].name;

        expect(wrapper.text()).toContain(organizationName);
      });

      test('should call the deleteOrganization method', () => {
        const spy = jest.spyOn(organizationsApi, 'deleteOrganization');

        wrapper.find('.button.confirm').trigger('click');

        expect(spy).toHaveBeenCalledWith(organizations[0].id);
      });
    });
  });
});
