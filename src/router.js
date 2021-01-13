import Vue from 'vue';
import Router from 'vue-router';
import Devices from './views/Devices/Devices.vue';
import Device from './views/Devices/Device.vue';
import DataCenters from './views/DataCenterBrowser/DataCenters.vue';
import SignIn from './views/SignIn/SignIn.vue';
import UserManagement from './views/UserManagement/UserManagement.vue';
import User from './views/UserManagement/User.vue';
import AuthenticationTokens from './views/AuthenticationTokens/AuthenticationTokens.vue';
import Sidebar from './views/Sidebar/Sidebar.vue';
import PageNotFound from './views/PageNotFound/PageNotFound.vue';
import PasswordReset from './views/PasswordReset/PasswordReset.vue';
import Builds from './views/Builds/Builds.vue';
import Build from './views/Builds/Build.vue';
import Organizations from './views/Organizations/Organizations.vue';
import Organization from './views/Organizations/Organization.vue';
import HardwareProduct from './views/HardwareProducts/HardwareProduct.vue';
import HardwareProducts from './views/HardwareProducts/HardwareProducts.vue';
import OverviewTab from './views/Builds/OverviewTab.vue';
import RacksTab from './views/Builds/RacksTab.vue';
import DevicesTab from './views/Builds/DevicesTab.vue';
import MembersTab from './views/Builds/MembersTab.vue';
import OrganizationsTab from './views/Builds/OrganizationsTab.vue';
import DataCenter from './views/DataCenterBrowser/DataCenter.vue';
import DataCenterRoomsTab from './views/DataCenterBrowser/DataCenterRoomsTab.vue';
import DataCenterRacksTab from './views/DataCenterBrowser/DataCenterRacksTab.vue';
import DataCenterDevicesTab from './views/DataCenterBrowser/DataCenterDevicesTab.vue';
import LinksTab from './views/Builds/LinksTab.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'signIn',
      component: SignIn,
    },
    {
      path: '/devices',
      name: 'devices',
      components: {
        default: Devices,
        sidebar: Sidebar,
      },
      children: [
        {
          // when /device/:deviceId is matched
          path: ':deviceId',
          name: 'device',
          component: Device,
        },
      ],
    },
    {
      path: '/hardware-products',
      name: 'hardware-products',
      components: {
        default: HardwareProducts,
        sidebar: Sidebar,
      },
      children: [
        {
          path: ':id',
          name: 'hardware-product',
          components: {
            default: HardwareProduct,
            sidebar: Sidebar,
          },
        },
      ],
    },
    {
      path: '/datacenters',
      name: 'datacenters',
      components: {
        default: DataCenters,
        sidebar: Sidebar,
      },
      children: [
        {
          // when /datacenter/:roomName/rack is matched
          path: ':roomName/rack',
          name: 'datacenterRoom',
          component: DataCenters,
          children: [
            {
              // when /datacenter/:roomName/rack/:rackId/device is matched
              path: ':rackId/device',
              name: 'datacenterRack',
              component: DataCenters,
              children: [
                {
                  // when /datacenter/:roomName/rack/:rackId/device/:deviceId is matched
                  path: ':deviceId',
                  name: 'datacenterDevice',
                  component: DataCenters,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '/datacenters/:id',
      name: 'datacenter',
      components: {
        default: DataCenter,
        sidebar: Sidebar,
      },
      redirect: { name: 'datacenter-rooms' },
      children: [
        {
          path: 'rooms',
          name: 'datacenter-rooms',
          components: {
            default: DataCenterRoomsTab,
            sidebar: Sidebar,
          },
        },
        {
          path: 'racks',
          name: 'datacenter-racks',
          components: {
            default: DataCenterRacksTab,
            sidebar: Sidebar,
          },
        },
        {
          path: 'devices',
          name: 'datacenter-devices',
          components: {
            default: DataCenterDevicesTab,
            sidebar: Sidebar,
          },
        },
      ],
    },
    {
      path: '/builds/:id',
      name: 'build',
      components: {
        default: Build,
        sidebar: Sidebar,
      },
      redirect: { name: 'build-overview' },
      children: [
        {
          path: 'overview',
          name: 'build-overview',
          components: {
            default: OverviewTab,
            sidebar: Sidebar,
          },
        },
        {
          path: 'racks',
          name: 'build-racks',
          components: {
            default: RacksTab,
            sidebar: Sidebar,
          },
        },
        {
          path: 'devices',
          name: 'build-devices',
          components: {
            default: DevicesTab,
            sidebar: Sidebar,
          },
        },
        {
          path: 'members',
          name: 'build-members',
          components: {
            default: MembersTab,
            sidebar: Sidebar,
          },
        },
        {
          path: 'organizations',
          name: 'build-organizations',
          components: {
            default: OrganizationsTab,
            sidebar: Sidebar,
          },
        },
        {
          path: 'links',
          name: 'build-links',
          components: {
            default: LinksTab,
            sidebar: Sidebar,
          },
        },
      ],
    },
    {
      path: '/builds',
      name: 'builds',
      components: {
        default: Builds,
        sidebar: Sidebar,
      },
    },
    {
      path: '/admin/tokens',
      name: 'tokens',
      components: {
        default: AuthenticationTokens,
        sidebar: Sidebar,
      },
      children: [
        {
          // when /admin/tokens/:userId is matched
          path: ':userId',
          name: 'userTokens',
          component: AuthenticationTokens,
        },
      ],
    },
    {
      path: '/admin/users',
      name: 'user-management',
      components: {
        default: UserManagement,
        sidebar: Sidebar,
      },
      children: [
        {
          path: ':id',
          name: 'user',
          components: {
            default: User,
            sidebar: Sidebar,
          },
        },
      ],
    },
    {
      path: '/profile/:id',
      name: 'profile',
      components: {
        default: User,
        sidebar: Sidebar,
      },
    },
    {
      path: '/password-reset',
      name: 'passwordReset',
      component: {
        PasswordReset,
      },
    },
    {
      path: '/organizations',
      name: 'organizations',
      components: {
        default: Organizations,
        sidebar: Sidebar,
      },
      children: [
        {
          path: ':id',
          name: 'organization',
          components: {
            default: Organization,
            sidebar: Sidebar,
          },
        },
      ],
    },
    {
      path: '/*',
      name: '404',
      component: PageNotFound,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});
