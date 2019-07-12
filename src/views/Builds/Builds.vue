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
                            <!-- <div class="dropdown quick-actions" :class="{ 'is-active': showQuickActions }">
                                <div class="dropdown-trigger">
                                    <a
                                        class="button is-outlined"
                                        @click="showQuickActions = !showQuickActions"
                                    >
                                        <span class="icon">
                                             <i class="fas fa-cog"></i>
                                        </span>
                                        <span>Quick Actions</span>
                                        <span class="icon is-small">
                                            <i class="fas fa-angle-down" aria-hidden="true"></i>
                                        </span>
                                    </a>
                                </div>
                                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                                    <div class="dropdown-content">
                                    <a class="dropdown-item">
                                        Add Device
                                    </a>
                                    <a class="dropdown-item">
                                        Remove Device
                                    </a>
                                    <hr class="dropdown-divider">
                                    <a class="dropdown-item">
                                        Add Rack
                                    </a>
                                    <a class="dropdown-item">
                                        Remove Rack
                                    </a>
                                    <hr class="dropdown-divider">
                                    <a class="dropdown-item">
                                        Add User
                                    </a>
                                    <a class="dropdown-item">
                                        Remove User
                                    </a>
                                    <a class="dropdown-item">
                                        Edit User Role
                                    </a>
                                    </div>
                                </div>
                            </div> -->
                        </div>
                        <p class="build-id has-text-grey" style="margin-bottom: 20px;">
                            Build ID: {{ selectedBuild.id }}
                        </p>
                        <div class="columns">
                            <div class="column">
                                <div class="box">
                                    <div class="build-devices">
                                        <div class="box-header">
                                            <i class="fas fa-2x fa-hdd"></i>
                                            <p class="heading is-size-6">Devices Complete</p>
                                            <p class="fraction">35 / 60</p>
                                        </div>
                                        <div class="progress-devices">
                                            <progress
                                                class="progress is-info"
                                                :value="selectedBuild.progress"
                                                max="100"
                                            ></progress>
                                            <span class="amount is-size-5">
                                                {{ selectedBuild.progress }}&#37;
                                            </span>
                                        </div>
                                    </div>
                                    <a class="button is-fullwidth all">
                                        <span class="heading is-marginless is-size-7">
                                            All Devices
                                        </span>
                                        <i
                                            class="fas fa-lg fa-long-arrow-alt-right"
                                            style="margin-left: 10px"
                                        ></i>
                                    </a>
                                </div>
                            </div>
                            <div class="column">
                                <div class="box">
                                    <div class="build-devices">
                                        <div class="box-header">
                                            <i class="fas fa-2x fa-server"></i>
                                            <p class="heading is-size-6">Racks Complete</p>
                                            <p class="fraction">8 / 12</p>
                                        </div>
                                        <div class="progress-devices">
                                            <progress
                                                class="progress is-info"
                                                :value="selectedBuild.progress"
                                                max="100"
                                            ></progress>
                                            <span class="amount is-size-5">
                                                {{ selectedBuild.progress }}&#37;
                                            </span>
                                        </div>
                                    </div>
                                    <div class="field has-addons button-group is-fullwidth">
                                        <a class="button is-fullwidth add">
                                            <i class="material-icons">add</i>
                                            <span class="heading is-marginless is-size-7">
                                                Add Rack
                                            </span>
                                        </a>
                                        <a class="button is-fullwidth all">
                                            <span class="heading is-marginless is-size-7">
                                                All racks
                                            </span>
                                            <i
                                                class="fas fa-lg fa-long-arrow-alt-right"
                                                style="margin-left: 10px"
                                            ></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="columns">
                            <div class="column">
                                <div class="box users-table">
                                    <table class="table is-hoverable is-fullwidth">
                                        <tbody>
                                            <tr class="users-table-header">
                                                <td colspan="2">
                                                    <span class="heading is-size-6 is-marginless">
                                                        Users
                                                    </span>
                                                </td>
                                            </tr>
                                            <!-- <tr class="row" v-for="user in selectedBuild.users" :key="user.name"> -->
                                            <tr class="row" v-for="i in 5" :key="i">
                                                <td class="name">
                                                    <span>{{ getUserName(i) }}</span>
                                                </td>
                                                <td class="role">
                                                    <!-- <span>{{ user.role }}</span> -->
                                                </td>
                                            </tr>
                                            <tr class="users-table-footer">
                                                <td colspan="2">
                                                    <a class="button is-fullwidth all">
                                                        <span class="heading is-size-7 is-marginless">
                                                            All Users
                                                        </span>
                                                        <i
                                                            class="fas fa-lg fa-long-arrow-alt-right"
                                                            style="margin-left: 10px"
                                                        ></i>
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
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

export default {
    components: {
        RadialProgressBar,
    },
    data() {
        return {
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
            searchText: '',
            selectedBuild: {},
            showQuickActions: false,
        };
    },
    methods: {
        getDate(date) {
            return moment(date).format('MM/DD/YYYY');
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
