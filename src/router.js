import Vue from 'vue';
import Router from 'vue-router';

import Devices from './views/Devices/Devices.vue';
import DataCenterBrowser from './views/DataCenterBrowser/DataCenterBrowser.vue';
import SignIn from './views/SignIn/SignIn.vue';
import Status from './views/Status/Status.vue';
import UserProfile from './views/User/UserProfile.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: SignIn,
        },
        {
            path: '/status',
            component: Status,
            children: [
                {
                    // when /status/device/:deviceId is matched
                    path: 'device/:deviceId',
                    component: Status,
                },
            ],
        },
        {
            path: '/device',
            component: Devices,
            children: [
                {
                    // when /device/:deviceId is matched
                    path: ':deviceId',
                    component: Devices,
                }
            ]
        },
        {
            path: '/datacenter',
            component: DataCenterBrowser,
            children: [
                {
                    // when /datacenter/:roomName/rack is matched
                    path: ':roomName/rack',
                    component: DataCenterBrowser,
                    children: [
                        {
                            // when /datacenter/:roomName/rack/:rackId/device is matched
                            path: ':rackId/device',
                            component: DataCenterBrowser,
                            children: [
                                {
                                    // when /datacenter/:roomName/rack/:rackId/device/:deviceId is matched
                                    path: ':deviceId',
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
            component: UserProfile,
        },
    ]
});
