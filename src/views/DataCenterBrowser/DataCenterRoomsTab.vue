<template>
    <div class="data-center-rooms-tab">
        <spinner v-if="fetchingData"></spinner>
        <div v-else class="columns">
            <div class="column">
                <div class="is-paddingless">
                    <div class="datatable-header">
                        <span class="heading is-size-6 is-marginless">
                            {{ `Rooms (${filteredRooms.length})` }}
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
                            <label class="select-label">AZ</label>
                            <div class="select">
                                <select
                                    v-model="azFilter"
                                    @change="changeFilter($event)"
                                >
                                    <option value="all">All</option>
                                    <option
                                        :value="az"
                                        v-for="az in azs"
                                        :key="az"
                                    >
                                        {{ az }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <table
                        class="table is-hoverable is-fullwidth"
                        v-if="filteredRooms && filteredRooms.length > 0"
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
                        <tfoot v-if="filteredRooms.length > 10">
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
                                v-for="room in filteredRooms"
                                :key="room.id"
                                @click="navigateToRacks(room)"
                                style="cursor: pointer;"
                            >
                                <td class="alias">
                                    <span>{{ room.alias }}</span>
                                </td>
                                <td class="az">
                                    {{ room.az }}
                                </td>
                                <td class="vendor-name">
                                    {{ room.vendor_name }}
                                </td>
                                <td class="updated">
                                    {{ getDate(room.updated) }}
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
import Spinner from '../components/Spinner.vue';
import { mapActions, mapState } from 'vuex';
import { getDataCenterRooms } from '@api/dataCenters.js';

export default {
    components: {
        Spinner,
    },
    data() {
        return {
            azFilter: 'all',
            fetchingData: true,
            headers: ['alias', 'AZ', 'vendor name', 'updated'],
            rooms: [],
            searchText: '',
        };
    },
    methods: {
        ...mapActions(['setCurrentDataCenter', 'setCurrentDataCenterRoom']),
        changeFilter(event) {
            this.$router.push({
                name: 'datacenter-rooms',
                params: { id: this.currentDataCenter.id },
                query: {
                    az: (event && event.target && event.target.value) || 'all',
                },
            });
        },
        async fetchData() {
            const routeQuery = this.$route.query;
            const dataCenterRoomsResponse = await getDataCenterRooms(
                this.$route.params.id
            );

            this.rooms = dataCenterRoomsResponse.data;

            if (routeQuery && routeQuery.az) {
                this.azFilter = routeQuery.az;
            }

            this.fetchingData = false;
        },
        getDate(date) {
            return moment(date).fromNow();
        },
        navigateToRacks(room) {
            this.setCurrentDataCenterRoom(room);

            this.$router.push({
                name: 'datacenter-racks',
                params: { id: this.currentDataCenter.id },
                query: { room: room.id },
            });
        },
    },
    computed: {
        ...mapState(['currentDataCenter']),
        azs() {
            let azs = [];
            this.rooms.map(room => {
                if (azs.includes(room.az) === false) {
                    azs.push(room.az);
                }
            });

            return azs;
        },
        filteredRooms() {
            let rooms = this.rooms;

            if (this.searchText) {
                const searchText = this.searchText.toLowerCase();

                rooms = rooms.reduce((acc, room) => {
                    const alias = room.alias.toLowerCase();
                    const az = room.az.toLowerCase();
                    const vendorName = room.vendor_name.toLowerCase();

                    if (
                        search(searchText, alias) ||
                        search(searchText, az) ||
                        search(searchText, vendorName)
                    ) {
                        acc.push(room);
                    }

                    return acc;
                }, []);
            }

            if (this.azFilter !== 'all') {
                rooms = rooms.filter(
                    room =>
                        room.az.toLowerCase() === this.azFilter.toLowerCase()
                );
            }

            return rooms;
        },
    },
    created() {
        this.fetchData();
    },
};
</script>
