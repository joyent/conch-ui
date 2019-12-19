import Vue from 'vue';
import Router from 'vue-router';
import Devices from './views/Devices/Devices.vue';
import DataCenterBrowser from './views/DataCenterBrowser/DataCenterBrowser.vue';
import SignIn from './views/SignIn/SignIn.vue';
import UserProfile from './views/UserProfile/UserProfile.vue';
import UserManagement from './views/UserManagement/UserManagement.vue';
import AuthenticationTokens from './views/AuthenticationTokens/AuthenticationTokens.vue';
import Navbar from './views/Navbar/Navbar.vue';
import Sidebar from './views/Sidebar/Sidebar.vue';
import PageNotFound from './views/PageNotFound/PageNotFound.vue';
import PasswordReset from './views/PasswordReset/PasswordReset.vue';
import BuildsList from './views/Builds/BuildsList.vue';
import Build from './views/Builds/Build.vue';
import Organizations from './views/Organizations/Organizations.vue';
import Organization from './views/Organizations/Organization.vue';
import CreateBuild from './views/Builds/CreateBuild.vue';
import Dashboard from './views/Dashboard/Dashboard.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'signIn',
            component: SignIn,
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            components: {
                default: Dashboard,
                sidebar: Sidebar,
                navbar: Navbar,
            },
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
                default: BuildsList,
                sidebar: Sidebar,
                navbar: Navbar,
            },
            children: [
                {
                    // when /admin/builds/:buildId is matched
                    path: 'build/:buildId',
                    name: 'adminBuildDetails',
                    component: Build,
                },
            ],
        },
        {
            path: '/admins/create-build',
            name: 'createBuild',
            components: {
                default: CreateBuild,
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
                default: Organization,
                sidebar: Sidebar,
                navbar: Navbar,
            },
        },
        {
            path: '/build/:buildId',
            name: 'build',
            components: {
                default: Build,
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
