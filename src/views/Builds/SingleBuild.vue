<template>
    <div class="build">
        <div class="build-page">
            <div class="build-header">
                <p class="build-name title has-text-white">
                    {{ build.name }}
                </p>
                <span
                    class="tag build-status"
                    :class="{
                        'is-success': build.status === 'complete',
                        'is-info': build.status === 'active'
                    }"
                    style="border-radius: 4px"
                >
                    {{ build.status }}
                </span>
            </div>
            <p class="build-id has-text-grey">
                Build ID: {{ build.id }}
            </p>
            <div class="tabs is-toggle">
                <ul>
                    <li :class="{ 'is-active': currentTab === 'OverviewTab' }">
                        <a
                            class="tab overview-tab is-uppercase"
                            @click="changeTab('OverviewTab')"
                        >
                            Overview
                        </a>
                    </li>
                    <li :class="{ 'is-active': currentTab === 'DevicesTab' }">
                        <a
                            class="tab devices-tab is-uppercase"
                            @click="changeTab('DevicesTab')"
                        >
                            Devices
                        </a>
                    </li>
                    <li :class="{ 'is-active': currentTab === 'RacksTab' }">
                        <a
                            class="tab racks-tab is-uppercase"
                            @click="changeTab('RacksTab')"
                        >
                            Racks
                        </a>
                    </li>
                    <li :class="{ 'is-active': currentTab === 'UsersTab' }">
                        <a
                            class="tab users-tab is-uppercase"
                            @click="changeTab('UsersTab')"
                        >
                            Users
                        </a>
                    </li>
                </ul>
            </div>
            <component
                v-bind:is="currentTab"
                :build="build"
            ></component>
        </div>
    </div>
</template>

<script>
import DevicesTab from './DevicesTab.vue';
import OverviewTab from './OverviewTab.vue';
import RacksTab from './RacksTab.vue';
import UsersTab from './UsersTab.vue';

export default {
    components: {
        DevicesTab,
        OverviewTab,
        RacksTab,
        UsersTab,
    },
    data() {
        return {
            build: {
                id: '434a98d1-5317-7h64-3b60-12fe533456m1',
                name: 'UK-West-1',
                status: 'active',
                progress: 10,
                startDate: '2018-05-16T10:35:16.933374-07:00',
                endDate: '2019-05-16T10:35:16.933374-07:00',
                devices: [
                    {
                        name: 'Android-1',
                        graduated: false,
                        phase: 'integration',
                        validated: false,
                    },
                    {
                        name: 'Super Computer',
                        graduated: true,
                        phase: 'installation',
                        validated: false,
                    },
                    {
                        name: 'Cloud Rack',
                        graduated: true,
                        phase: 'diagnostics',
                        validated: true,
                    },
                    {
                        name: 'Very Cool Machine',
                        graduated: false,
                        phase: 'integration',
                        validated: false,
                    },
                    {
                        name: 'Device-1szv33a',
                        graduated: true,
                        phase: 'decommissioned',
                        validated: false,
                    },
                    {
                        name: 'Android-2',
                        graduated: false,
                        phase: 'production',
                        validated: true,
                    },
                ],
                racks: [
                    {
                        datacenter: "eu-southwest-1f",
                        id: "e3e7c2c0-7b4d-4q9a-b865-2y678976543a",
                        name: "DS-23C-ABCD23",
                        phase: "integration",
                        role: "CERES",
                        slots: [
                            {
                                alias: "CERES Type 1",
                                id: "e3e7c2c0-7b4d-4q9a-b865-2y678976543a",
                                name: "dell-2u-compute-v1-256g-10-12tb",
                                occupant: {
                                    asset_tag: null,
                                    created: "2017-08-14T23:37:37.182853-07:00",
                                    graduated: null,
                                    hardware_product: "e3e7c2c0-7b4d-4q9a-b865-2y678976543h",
                                    health: "pass",
                                    id: "ACEGI82",
                                    rack_id: "e3e7c2c0-7b4d-4q9a-b865-2y678976543a",
                                    validated: "2018-01-10T17:36:24.965412-08:00",
                                },
                                vendor: "Dell",
                            },
                            {
                                alias: "CERES Type 1",
                                id: "e3e7c2c0-7b4d-4q9a-b865-2y678976543b",
                                name: "dell-2u-compute-v1-256g-10-12tb",
                                occupant: {
                                    asset_tag: null,
                                    created: "2017-08-14T23:37:37.276789-07:00",
                                    graduated: "2018-01-10T17:38:17.000181-08:00",
                                    hardware_product: "e3e7c2c0-7b4d-4q9a-b865-2y678976543h",
                                    health: "pass",
                                    id: "ACEGI83",
                                    validated: null,
                                },
                                vendor: "IBM",
                            },
                            {
                                alias: "CERES Type 1",
                                id: "e3e7c2c0-7b4d-4q9a-b865-2y678976543c",
                                name: "dell-2u-compute-v1-256g-10-12tb",
                                occupant: {
                                    asset_tag: null,
                                    created: "2017-08-14T23:37:37.249873-07:00",
                                    graduated: null,
                                    hardware_product: "e3e7c2c0-7b4d-4q9a-b865-2y678976543h",
                                    health: "pass",
                                    id: "ACEGI84",
                                    validated: "2018-01-10T17:36:39.659718-08:00",
                                },
                                vendor: "Microsoft",
                            },
                        ],
                    },
                    {
                        datacenter: "eu-southwest-1f",
                        id: "e3e7c2c0-7b4d-4q9a-b865-2y678976543a",
                        name: "DS-23C-232168",
                        phase: "integration",
                        role: "CERES",
                        slots: [
                            {
                                alias: "CERES Type 1",
                                id: "e3e7c2c0-7b4d-4q9a-b865-2y678976543a",
                                name: "dell-2u-compute-v1-256g-10-12tb",
                                occupant: {
                                    asset_tag: null,
                                    created: "2017-08-14T23:37:37.182853-07:00",
                                    graduated: null,
                                    hardware_product: "e3e7c2c0-7b4d-4q9a-b865-2y678976543h",
                                    health: "pass",
                                    id: "ACEGI82",
                                    rack_id: "e3e7c2c0-7b4d-4q9a-b865-2y678976543a",
                                    validated: "2018-01-10T17:36:24.965412-08:00",
                                },
                                vendor: "Dell",
                            },
                        ],
                    },
                ],
                users: [
                    {
                        name: 'Tatooine',
                        role: 'admin',
                    },
                    {
                        name: 'Yavin IV',
                        role: 'regular user',
                    },
                    {
                        name: 'Coruscant',
                        role: 'admin',
                    },
                    {
                        name: 'Dagobah',
                        role: 'admin',
                    },
                    {
                        name: 'Hoth',
                        role: 'regular user',
                    },
                    {
                        name: 'Korriban',
                        role: 'admin',
                    },
                    {
                        name: 'Alderran',
                        role: 'regular user',
                    },
                    {
                        name: 'Mustaffar',
                        role: 'admin',
                    },
                    {
                        name: 'Endor',
                        role: 'admin',
                    },
                    {
                        name: 'Death Star',
                        role: 'regular user',
                    },
                ],
            },
            currentTab: 'OverviewTab',
        };
    },
    methods: {
        changeTab(tab) {
            this.currentTab = tab;
        },
    }
};
</script>
