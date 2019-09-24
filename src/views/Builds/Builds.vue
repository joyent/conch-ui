<template>
    <div class="builds">
        <div class="page-heading" v-if="!creatingBuild">
            <h1 class="title is-3 has-text-weight-bold">
                Builds
            </h1>
            <div class="control has-icons-left">
                <input
                    type="text"
                    class="input"
                    placeholder="Search Builds"
                    v-model="searchText"
                />
                <span class="icon is-small is-left">
                    <i class="fas fa-search"></i>
                </span>
            </div>
            <div class="views">
                <i
                    class="material-icons view-grid"
                    :class="{ 'has-text-info': activeView === 'grid' }"
                    @click="activeView = 'grid'"
                >
                    view_module
                </i>
                <i
                    class="material-icons view-list"
                    :class="{ 'has-text-info': activeView === 'list' }"
                    @click="activeView = 'list'"
                >
                    view_headline
                </i>
            </div>
            <i class="material-icons add-build" @click="createBuild()">
                add_circle
            </i>
        </div>
        <div class="cards" v-if="activeView === 'grid' && !creatingBuild">
            <div class="card" v-for="build in filteredBuilds" :key="build.name">
                <a @click="viewBuild(build.id)">
                    <div class="card-content">
                        <div class="build-progress">
                            <RadialProgressBar
                                :color="graphColor(build.progress)"
                                :id="build.id"
                                :value="build.progress"
                            />
                        </div>
                        <p class="build-name">
                            {{ build.name }}
                        </p>
                        <a class="button">
                            View Build
                        </a>
                    </div>
                </a>
            </div>
        </div>
        <div
            class="columns"
            v-else-if="activeView === 'list' && !creatingBuild"
        >
            <div class="column is-4">
                <ul>
                    <li
                        class="build"
                        v-for="build in filteredBuilds"
                        :key="build.name"
                    >
                        <a @click="selectBuild(build)">
                            <div
                                class="box is-paddingless"
                                :class="{
                                    'is-selected':
                                        selectedBuild.name === build.name,
                                }"
                            >
                                <div class="build-details">
                                    <p class="name is-size-5">
                                        {{ build.name }}
                                    </p>
                                    <p
                                        class="status"
                                        :class="{
                                            'has-text-info':
                                                build.status === 'active',
                                            'has-text-success':
                                                build.status === 'complete',
                                        }"
                                    >
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
                                    'is-success':
                                        selectedBuild.status === 'complete',
                                    'is-info':
                                        selectedBuild.status === 'active',
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
                                <li
                                    :class="{
                                        'is-active':
                                            currentTab === 'OverviewTab',
                                    }"
                                >
                                    <a
                                        class="tab overview-tab is-uppercase"
                                        @click="changeTab('OverviewTab')"
                                    >
                                        Overview
                                    </a>
                                </li>
                                <li
                                    :class="{
                                        'is-active':
                                            currentTab === 'DevicesTab',
                                    }"
                                >
                                    <a
                                        class="tab devices-tab is-uppercase"
                                        @click="changeTab('DevicesTab')"
                                    >
                                        Devices
                                    </a>
                                </li>
                                <li
                                    :class="{
                                        'is-active': currentTab === 'RacksTab',
                                    }"
                                >
                                    <a
                                        class="tab racks-tab is-uppercase"
                                        @click="changeTab('RacksTab')"
                                    >
                                        Racks
                                    </a>
                                </li>
                                <li
                                    :class="{
                                        'is-active':
                                            currentTab === 'MembersTab',
                                    }"
                                >
                                    <a
                                        class="tab members-tab is-uppercase"
                                        @click="changeTab('MembersTab')"
                                    >
                                        Members
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <component
                            :is="currentTab"
                            :build="selectedBuild"
                        ></component>
                    </div>
                </div>
                <div class="column is-8" v-else>
                    <div class="builds-overview">
                        <div class="columns">

                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <div class="create-build" v-else>
            <CreateBuild />
        </div>
    </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import search from 'fuzzysearch';
import RadialProgressBar from '@views/components/RadialProgressBar.vue';
import CreateBuild from './CreateBuild.vue';
import DevicesTab from './DevicesTab.vue';
import OverviewTab from './OverviewTab.vue';
import RacksTab from './RacksTab.vue';
import MembersTab from './MembersTab.vue';

export default {
    components: {
        CreateBuild,
        DevicesTab,
        OverviewTab,
        RacksTab,
        RadialProgressBar,
        MembersTab,
    },
    data() {
        return {
            activeView: 'grid',
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
            creatingBuild: false,
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
        addBuild() {

        },
        changeTab(tab) {
            this.currentTab = tab;
        },
        createBuild() {
            this.$router.push({ name: 'createBuild' });
        },
        graphColor(progress) {
            return progress === 100 ? this.colors.green : this.colors.blue;
        },
        isEmpty,
        getUserName(index) {
            return this.selectedBuild.users[index].name;
        },
        selectBuild(build) {
            if (this.selectedBuild.name === build.name) {
                this.selectedBuild = {};

                this.$router.push({ name: 'builds' });
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
        viewBuild(buildId) {
            this.$router.push({ name: 'build', params: { buildId } });
        },
    },
    computed: {
        buildsActive() {
            return this.builds.filter(build => build.status === 'active')
                .length;
        },
        buildsComplete() {
            return this.builds.filter(build => build.status === 'complete')
                .length;
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
