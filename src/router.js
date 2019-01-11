import Vue from 'vue';
import Router from 'vue-router';
import Devices from './views/Devices/Devices.vue';
import DataCenterBrowser from './views/DataCenterBrowser/DataCenterBrowser.vue';
import SignIn from './views/SignIn/SignIn.vue';
import Status from './views/Status/Status.vue';
import UserProfile from './views/User/UserProfile.vue';
import Navbar from './views/Navbar/Navbar.vue';
import Sidebar from './views/Sidebar/Sidebar.vue';

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
                }
            ]
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
            path: '/user',
            name: 'user',
            components: {
                default: UserProfile,
                sidebar: Sidebar,
                navbar: Navbar,
            },
        },
    ]
});
