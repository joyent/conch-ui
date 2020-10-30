import Build from '../Build.vue';
import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';

// Fixtures
import { builds } from '@src/__fixtures__/builds.js';
import organizations from '@src/__fixtures__/organizations.js';
import users from '@src/__fixtures__/users.js';

const localVue = createLocalVue();
localVue.use(Vuex);

jest.mock('@api/request.js');

describe('Build.vue', () => {
  let actions;
  let propsData;
  let state;
  let store;
  let wrapper;

  describe('tabs', () => {
    beforeEach(() => {
      actions = {
        setCurrentBuild: jest.fn(),
        setCurrentBuildDevices: jest.fn(),
        setCurrentBuildOrganizations: jest.fn(),
        setCurrentBuildRacks: jest.fn(),
        setCurrentBuildUsers: jest.fn(),
        setOrganizations: jest.fn(),
        setUsers: jest.fn(),
      };
      propsData = { buildId: builds[0].id };
      state = {
        currentBuild: builds[0],
        organizations,
        users,
      };
      store = new Vuex.Store({ actions, state });
      wrapper = shallowMount(Build, { localVue, propsData, store });
    });

    test('should display the OverviewTab on initial render', () => {
      expect(wrapper.find('overviewtab-stub').exists()).toBeTruthy();
    });

    test('should display the OrganizationsTab component when the Organizations tab is clicked', () => {
      wrapper.find('.organizations-tab').trigger('click');

      expect(wrapper.find('organizationstab-stub').exists()).toBeTruthy();
    });

    test('should display the MembersTab component when the Members tab is clicked', () => {
      wrapper.find('.members-tab').trigger('click');

      expect(wrapper.find('memberstab-stub').exists()).toBeTruthy();
    });

    test('should display the RacksTab component when the Racks tab is clicked', () => {
      wrapper.find('.racks-tab').trigger('click');

      expect(wrapper.find('rackstab-stub').exists()).toBeTruthy();
    });

    test('should display the DevicesTab component when the Devices tab is clicked', () => {
      wrapper.find('.devices-tab').trigger('click');

      expect(wrapper.find('devicestab-stub').exists()).toBeTruthy();
    });
  });
});
