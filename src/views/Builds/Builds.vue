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
            </transition>
        </div>
        <transition name="fade">
            <BaseModal v-if="addDevice">
                <template v-slot:icon>
                    <i class="material-icons">add_circle_outline</i>
                </template>
                <template v-slot:title>
                    <h1 class="title">Add a Device</h1>
                </template>
                <template v-slot:body>
                    <table class="table">
                        <tbody>
                            <tr></tr>
                        </tbody>
                    </table>
                </template>
                <template v-slot:footer>
                    <a
                        class="button confirm is-success is-fullwidth"
                    >
                        Add Device
                        <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                    </a>
                </template>
            </BaseModal>
        </transition>
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
