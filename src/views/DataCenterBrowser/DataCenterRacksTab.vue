<template>
    <div class="data-center-racks-tab">
        <spinner v-if="fetchingData"></spinner>
        <div v-else class="columns">
            <div class="column">
                <div class="is-paddingless">
                    <div class="datatable-header">
                        <span class="heading is-size-6 is-marginless">
                            {{ `Racks (${filteredRacks.length})` }}
                        </span>
                        <div class="control has-icons-left has-icons-right">
                            <input
                                type="text"
                                class="input search"
                                v-model="searchText"
                                placeholder="Search..."
                            />
                            <span class="icon is-small is-left">
                                <i class="material-icons search">search</i>
                            </span>
                        </div>
                        <div class="select-with-label">
                            <label class="select-label">Role</label>
                            <div class="select">
                                <select
                                    v-model="roleFilter"
                                    @change="changeFilter($event, 'role')"
                                >
                                    <option value="all">All</option>
                                    <option
                                        :value="role"
                                        v-for="role in roles"
                                        :key="role"
                                    >
                                        {{ role }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="select-with-label">
                            <label class="select-label">Phase</label>
                            <div class="select">
                                <select
                                    v-model="phaseFilter"
                                    @change="changeFilter($event, 'phase')"
                                >
                                    <option value="all">All</option>
                                    <option
                                        :value="phase"
                                        v-for="phase in phases"
                                        :key="phase"
                                    >
                                        {{ phase }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="select-with-label">
                            <label class="select-label">Build</label>
                            <div class="select">
                                <select
                                    v-model="buildFilter"
                                    @change="changeFilter($event, 'build')"
                                >
                                    <option value="all">All</option>
                                    <option
                                        :value="build"
                                        v-for="build in builds"
                                        :key="build"
                                    >
                                        {{ build }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <table
                        class="table is-hoverable is-fullwidth"
                        v-if="filteredRacks && filteredRacks.length > 0"
                    >
                        <thead>
                            <th v-for="header in headers" :key="header">
                                <a
                                    class="table-header-filter is-capitalized"
                                    @click="sort()"
                                >
                                    {{ header }}
                                </a>
                            </th>
                        </thead>
                        <tfoot v-if="filteredRacks.length > 10">
                            <th
                                class="is-capitalized"
                                v-for="header in headers"
                                :key="header"
                            >
                                {{ header }}
                            </th>
                        </tfoot>
                        <tbody>
                            <tr
                                class="row"
                                v-for="rack in filteredRacks"
                                :key="rack.id"
                                @click="navigateToDevices(rack)"
                                style="cursor: pointer;"
                            >
                                <td class="name">
                                    <span>{{ rack.name }}</span>
                                </td>
                                <td class="role">
                                    {{ rack.rack_role_name }}
                                </td>
                                <td class="phase">
                                    {{ rack.phase }}
                                </td>
                                <td class="build">
                                    {{ rack.build_name }}
                                </td>
                                <td class="updated">
                                    {{ getDate(rack.updated) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="no-results" v-else>
                        <p class="subtitle has-text-centered">
                            No Results to Display
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import search from 'fuzzysearch';
import cloneDeep from 'lodash/cloneDeep';
import Spinner from '../components/Spinner.vue';
import { mapActions, mapState } from 'vuex';
import { getDataCenterRoomRacks } from '@api/rooms.js';

export default {
    components: {
        Spinner,
    },
    data() {
        return {
            buildFilter: 'all',
            fetchingData: true,
            headers: ['name', 'role', 'phase', 'build', 'updated'],
            phaseFilter: 'all',
            racks: [],
            roleFilter: 'all',
            searchText: '',
        };
    },
    methods: {
        ...mapActions(['setCurrentDataCenterRack']),
        changeFilter(event, filter) {
            const eventValue =
                (event && event.target && event.target.value) || 'all';
            const query = cloneDeep(this.$route.query);
            query[filter] = eventValue;

            this.$router.push({
                name: 'datacenter-racks',
                params: { id: this.currentDataCenter.id },
                query,
            });
        },
        async fetchData() {
            const routeQuery = this.$route.query;

            if (
                !this.racks ||
                (this.racks.length === 0 && routeQuery && routeQuery.room)
            ) {
                const racksResponse = await getDataCenterRoomRacks(
                    routeQuery.room
                );
                this.racks = racksResponse.data;
            }

            if (routeQuery) {
                if (routeQuery.build) {
                    this.buildFilter = routeQuery.build;
                }

                if (routeQuery.phase) {
                    this.phaseFilter = routeQuery.phase;
                }

                if (routeQuery.role) {
                    this.roleFilter = routeQuery.role;
                }
            }

            this.fetchingData = false;
        },
        getDate(date) {
            return moment(date).fromNow();
        },
        navigateToDevices(rack) {
            this.setCurrentDataCenterRack(rack);

            this.$router.push({
                name: 'datacenter-devices',
                params: { id: this.currentDataCenter.id },
                query: {
                    room: this.$route.query.room,
                    rack: rack.id,
                },
            });
        },
    },
    computed: {
        ...mapState(['currentDataCenter']),
        builds() {
            let builds = [];
            this.racks.map(rack => {
                const build = rack.build_name;
                if (builds.includes(build) === false) {
                    builds.push(build);
                }
            });

            return builds;
        },
        roles() {
            let roles = [];
            this.racks.map(rack => {
                const role = rack.rack_role_name;
                if (roles.includes(role) === false) {
                    roles.push(role);
                }
            });

            return roles;
        },
        phases() {
            let phases = [];
            this.racks.map(rack => {
                const phase = rack.phase;
                if (phases.includes(phase) === false) {
                    phases.push(phase);
                }
            });

            return phases;
        },
        filteredRacks() {
            let racks = this.racks;

            if (this.searchText) {
                const searchText = this.searchText.toLowerCase();

                racks = racks.reduce((acc, rack) => {
                    const name = rack.name.toLowerCase();
                    const role = rack.rack_role_name.toLowerCase();
                    const phase = rack.phase.toLowerCase();

                    if (
                        search(searchText, name) ||
                        search(searchText, role) ||
                        search(searchText, phase)
                    ) {
                        acc.push(rack);
                    }

                    return acc;
                }, []);
            }

            if (this.roleFilter !== 'all') {
                racks = racks.filter(
                    rack =>
                        rack.rack_role_name.toLowerCase() ===
                        this.roleFilter.toLowerCase()
                );
            }

            if (this.buildFilter !== 'all') {
                racks = racks.filter(
                    rack =>
                        rack.build_name.toLowerCase() ===
                        this.buildFilter.toLowerCase()
                );
            }

            if (this.phaseFilter !== 'all') {
                racks = racks.filter(
                    rack =>
                        rack.phase.toLowerCase() ===
                        this.phaseFilter.toLowerCase()
                );
            }

            return racks;
        },
    },
    created() {
        this.fetchData();
    },
};
</script>
