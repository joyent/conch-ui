import Vue from 'vue';
import Router from 'vue-router';
import Devices from './views/Devices/Devices.vue';
import DataCenterBrowser from './views/DataCenterBrowser/DataCenterBrowser.vue';
import SignIn from './views/SignIn/SignIn.vue';
import Status from './views/Status/Status.vue';
import UserProfile from './views/UserProfile/UserProfile.vue';
import UserManagement from './views/UserManagement/UserManagement.vue';
import AuthenticationTokens from './views/AuthenticationTokens/AuthenticationTokens.vue';
import Navbar from './views/Navbar/Navbar.vue';
import Sidebar from './views/Sidebar/Sidebar.vue';
import PageNotFound from './views/PageNotFound/PageNotFound.vue';
import PasswordReset from './views/PasswordReset/PasswordReset.vue';
import Builds from './views/Builds/Builds.vue';
import SingleBuild from './views/Builds/SingleBuild.vue';
import Organizations from './views/Organizations/Organizations.vue';
import SingleOrganization from './views/Organizations/SingleOrganization.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'signIn',
            component: SignIn,
        },
        {
            path: '/:currentWorkspace/status',
            name: 'status',
            components: {
                default: Status,
                sidebar: Sidebar,
                navbar: Navbar,
            },
            children: [
                {
                    // when /status/device/:deviceId is matched
                    path: 'device/:deviceId',
                    component: Status,
                },
            ],
        },
        {
            path: '/:currentWorkspace/device',
            name: 'devices',
            components: {
                default: Devices,
                sidebar: Sidebar,
                navbar: Navbar,
            },
            children: [
                {
                    // when /device/:deviceId is matched
                    path: ':deviceId',
                    name: 'device',
                    component: Devices,
                },
            ],
        },
        {
            path: '/:currentWorkspace/datacenter',
            name: 'datacenter',
            components: {
                default: DataCenterBrowser,
                sidebar: Sidebar,
                navbar: Navbar,
            },
            children: [
                {
                    // when /datacenter/:roomName/rack is matched
                    path: ':roomName/rack',
                    name: 'datacenterRoom',
                    component: DataCenterBrowser,
                    children: [
                        {
                            // when /datacenter/:roomName/rack/:rackId/device is matched
                            path: ':rackId/device',
                            name: 'datacenterRack',
                            component: DataCenterBrowser,
                            children: [
                                {
                                    // when /datacenter/:roomName/rack/:rackId/device/:deviceId is matched
                                    path: ':deviceId',
                                    name: 'datacenterDevice',
                                    component: DataCenterBrowser,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            path: '/admin/builds',
            name: 'builds',
            components: {
                default: Builds,
                sidebar: Sidebar,
                navbar: Navbar,
            },
            children: [
                {
                    // when /admin/builds/:buildId is matched
                    path: 'build/:buildId',
                    name: 'buildDetails',
                    component: Builds,
                },
            ],
        },
        {
            path: '/builds/:buildId',
            name: 'build',
            components: {
                default: SingleBuild,
                sidebar: Sidebar,
                navbar: Navbar,
            },
        },
        {
            path: '/user',
            name: 'user',
            components: {
                default: UserProfile,
                sidebar: Sidebar,
                navbar: Navbar,
            },
        },
        {
            path: '/admin/tokens',
            name: 'tokens',
            components: {
                default: AuthenticationTokens,
                sidebar: Sidebar,
                navbar: Navbar,
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
                navbar: Navbar,
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
            path: '/admin/organizations',
            name: 'organizations',
            components: {
                default: Organizations,
                sidebar: Sidebar,
                navbar: Navbar,
            },
        },
        {
            path: '/organization/:organizationId',
            name: 'organization',
            components: {
                default: SingleOrganization,
                sidebar: Sidebar,
                navbar: Navbar,
            },
        },
        {
            path: '/*',
            name: '404',
            component: PageNotFound,
        },
    ],
});
