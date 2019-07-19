<template>
    <div class="builds">
        <div class="columns">
            <div class="column is-4">
                <div class="control has-icons-left has-icons-right">
                    <input
                        class="input search"
                        type="text"
                        placeholder="Search Builds"
                        v-model="searchText"
                    >
                    <span class="icon is-small is-left">
                        <i class="fas fa-search"></i>
                    </span>
                </div>
                <ul>
                    <li
                        class="build"
                        v-for="build in filteredBuilds"
                        :key="build.name"
                    >
                        <a @click="selectBuild(build)">
                            <div
                                class="box is-paddingless"
                                :class="{ 'is-selected': selectedBuild.name === build.name }"
                            >
                                <div class="build-details">
                                    <p class="name is-size-5 has-text-weight-bold">
                                        {{ build.name }}
                                    </p>
                                    <p class="status has-text-grey-light">
                                        {{ build.status }}
                                    </p>
                                </div>
                                <div class="build-progress">
                                    <RadialProgressBar
                                        :color="graphColor(build.progress)"
                                        :id="build.id"
                                        :value="build.progress"
                                    />
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
            <transition name="fade">
                <div class="column is-8" v-if="!isEmpty(selectedBuild)">
                    <div class="selected-build">
                        <div class="selected-build-header">
                            <p class="build-name title has-text-white">
                                {{ selectedBuild.name }}
                            </p>
                            <span
                                class="tag build-status"
                                :class="{
                                    'is-success': selectedBuild.status === 'complete',
                                    'is-info': selectedBuild.status === 'active'
                                }"
                                style="border-radius: 4px"
                            >
                                {{ selectedBuild.status }}
                            </span>
                        </div>
                        <p class="build-id has-text-grey">
                            Build ID: {{ selectedBuild.id }}
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
                            :build="selectedBuild"
                        ></component>
                    </div>
                </div>
                <div class="column is-8" v-else>
                    <div class="builds-overview">
                        <div class="columns">
                            <div class="column is-6">
                                <div class="box">
                                    <p class="subtitle is-4" style="margin-bottom: 0.75rem">Builds</p>
                                    <div
                                        class="stats"
                                        style="display: flex; justify-content: space-between"
                                    >
                                        <div class="builds-total">
                                            <h2 class="is-6">Total</h2>
                                            <span class="is-size-3 has-text-info">
                                                {{ builds.length }}
                                            </span>
                                        </div>
                                        <div class="builds-active">
                                            <h2 class="is-6">Active</h2>
                                            <span class="is-size-3 has-text-info">
                                                {{ buildsActive }}
                                            </span>
                                        </div>
                                        <div class="builds-complete">
                                            <h2 class="is-6">Complete</h2>
                                            <span class="is-size-3 has-text-info">
                                                {{ buildsComplete }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import search from "fuzzysearch";
import RadialProgressBar from '@views/components/RadialProgressBar.vue';
import DevicesTab from './DevicesTab.vue';
import OverviewTab from './OverviewTab.vue';
import RacksTab from './RacksTab.vue';
import UsersTab from './UsersTab.vue';

export default {
    components: {
        DevicesTab,
        OverviewTab,
        RacksTab,
        RadialProgressBar,
        UsersTab,
    },
    data() {
        return {
            addDevice: false,
            builds: [
                {
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
                {
                    id: '434a98d1-5317-7h64-3b60-12fe533456m2',
                    name: 'Computer Build',
                    status: 'active',
                    progress: 30,
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
                {
                    id: '434a98d1-5317-7h64-3b60-12fe533456m3',
                    name: 'Hardware Test',
                    status: 'active',
                    progress: 50,
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
                {
                    id: '434a98d1-5317-7h64-3b60-12fe533456m4',
                    name: 'Datacenter Cleanup',
                    status: 'active',
                    progress: 70,
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
                {
                    id: '434a98d1-5317-7h64-3b60-12fe533456m5',
                    name: 'Googling Words',
                    status: 'active',
                    progress: 40,
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
                {
                    id: '434a98d1-5317-7h64-3b60-12fe533456m6',
                    name: 'Connecting Wires',
                    status: 'active',
                    progress: 20,
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
                {
                    id: '434a98d1-5317-7h64-3b60-12fe533456m7',
                    name: 'Switching Boxes On',
                    status: 'complete',
                    progress: 100,
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
                {
                    id: '434a98d1-5317-7h64-3b60-12fe533456m8',
                    name: 'Second Rebuild',
                    status: 'active',
                    progress: 60,
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
                {
                    id: '434a98d1-5317-7h64-3b60-12fe533456m9',
                    name: 'Revamp Workspace-1a',
                    status: 'complete',
                    progress: 100,
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
                {
                    id: '434a98d1-5317-7h64-3b60-12fe533456a2',
                    name: 'Network Testing',
                    status: 'active',
                    progress: 90,
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
            ],
            colors: {
                blue: '#209cee',
                green: '#5cb85c',
                red: '#d9534f',
            },
            currentTab: 'OverviewTab',
            devices: [
                'ANDROID1',
                'Astromech 210',
                'Battle Droid',
                'Translator Droid',
                'Navigational Computer',
                'TARS',
                'PLEX',
                'CASE',
                'KIPP',
            ],
            searchText: '',
            selectedBuild: {},
        };
    },
    methods: {
        changeTab(tab) {
            this.currentTab = tab;
        },
        graphColor(progress) {
            return progress === 100 ? this.colors.green : this.colors.blue;
        },
        // percentage() {
        //     const statisticsCount = this.devicesStatisticCount;
        //     const totalCount = this.devicesTotalCount;

        //     if (statisticsCount && totalCount) {
        //         let percentage = (statisticsCount / totalCount) * 100;

        //         if (statisticsCount === 0 || percentage === 0) {
        //             return 0;
        //         }

        //         return Math.round(percentage);
        //     }
        // },
        isEmpty,
        getUserName(index) {
            return this.selectedBuild.users[index].name;
        },
        selectBuild(build) {
            if (this.selectedBuild.name === build.name) {
                this.selectedBuild = {};
            } else {
                this.selectedBuild = build;

                this.$router.push({
                    name: 'buildDetails',
                    params: {
                        buildId: build.id,
                    },
                });
            }
        },
    },
    computed: {
        buildsActive() {
            return this.builds.filter(
                build => build.status === 'active'
            ).length;
        },
        buildsComplete() {
            return this.builds.filter(
                build => build.status === 'complete'
            ).length;
        },
        filteredBuilds() {
            const searchText = this.searchText.toLowerCase();
            let builds = this.builds;

            if (searchText) {
                return builds.reduce((acc, build) => {
                    const name = build.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(build);
                    }

                    return acc;
                }, []);
            }

            return builds;
        },
    },
};
</script>
