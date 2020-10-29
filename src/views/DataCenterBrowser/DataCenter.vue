<template>
    <div class="data-center">
        <div class="data-center-room-header">
            <p class="data-center-region title has-text-white">
                {{ currentDataCenter.region }}
            </p>
        </div>
        <div class="data-center-details has-text-grey">
            <span class="material-icons" style="margin-right: 8px;">place</span>
            <span style="margin-right: 20px;">{{
                currentDataCenter.location
            }}</span>
            <span class="material-icons" style="margin-right: 8px;"
                >corporate_fare</span
            >
            <span>{{ currentDataCenter.vendor }}</span>
        </div>
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li>
                    <router-link :to="{ name: 'datacenters' }" tag="a">
                        Data Centers
                    </router-link>
                </li>
                <li
                    :class="{
                        'is-active': $route.name === 'datacenter-rooms',
                    }"
                >
                    <router-link
                        :to="{
                            name: 'datacenter-rooms',
                            params: { id: $route.params.id },
                        }"
                        tag="a"
                    >
                        <span
                            v-if="currentDataCenter && currentDataCenter.region"
                        >
                            {{
                                `Rooms (${currentDataCenter &&
                                    currentDataCenter.region})`
                            }}
                        </span>
                        <span v-else>Rooms</span>
                    </router-link>
                </li>
                <li
                    v-if="
                        $route.name === 'datacenter-racks' ||
                            $route.name === 'datacenter-devices'
                    "
                    :class="{
                        'is-active': $route.name === 'datacenter-racks',
                    }"
                >
                    <router-link
                        :to="{
                            name: 'datacenter-racks',
                            params: { id: $route.params.id },
                            query: { room: $route.query.room },
                        }"
                        tag="a"
                    >
                        <span
                            v-if="
                                currentDataCenterRoom &&
                                    currentDataCenterRoom.alias
                            "
                        >
                            {{ `Racks (${currentDataCenterRoom.alias})` }}
                        </span>
                        <span v-else>Racks</span>
                    </router-link>
                </li>
                <li
                    v-if="$route.name === 'datacenter-devices'"
                    :class="{
                        'is-active': $route.name === 'datacenter-devices',
                    }"
                >
                    <router-link
                        :to="{
                            name: 'datacenter-devices',
                            params: { id: $route.params.id },
                        }"
                        tag="a"
                    >
                        <span
                            v-if="
                                currentDataCenterRack &&
                                    currentDataCenterRack.name
                            "
                        >
                            {{ `Devices (${currentDataCenterRack.name})` }}
                        </span>
                        <span v-else>Devices</span>
                    </router-link>
                </li>
            </ul>
        </nav>
        <router-view></router-view>
    </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapState } from 'vuex';
import { getDataCenter, getDataCenterRooms } from '@api/dataCenters.js';
import { getDataCenterRoomRacks } from '@api/rooms.js';

export default {
    methods: {
        ...mapActions([
            'setCurrentDataCenter',
            'setCurrentDataCenterRack',
            'setCurrentDataCenterRoom',
        ]),
        async fetchData() {
            const routeParams = this.$route.params;
            const routeQuery = this.$route.query;

            if (routeParams && routeParams.id) {
                const currentDataCenter = this.currentDataCenter;
                const dataCenterId = routeParams.id;
                const fetchDataCenter = async () => {
                    let dataCenter = this.dataCenters.find(
                        dataCenter => dataCenter.id === dataCenterId
                    );

                    if (!dataCenter) {
                        const dcResponse = await getDataCenter(routeParams.id);
                        dataCenter = dcResponse.data;
                    }

                    this.setCurrentDataCenter(dataCenter);
                };

                if (currentDataCenter && !isEmpty(currentDataCenter)) {
                    if (currentDataCenter.id !== dataCenterId) {
                        fetchDataCenter();
                    }
                } else {
                    fetchDataCenter();
                }
            }

            if (routeQuery) {
                if (routeQuery.room && isEmpty(this.currentDataCenterRoom)) {
                    const roomsResponse = await getDataCenterRooms(
                        routeParams.id
                    );
                    const currentRoom = roomsResponse.data.find(
                        room => room.id === routeQuery.room
                    );

                    if (currentRoom) {
                        this.setCurrentDataCenterRoom(currentRoom);
                    }
                }

                if (routeQuery.rack && isEmpty(this.currentDataCenterRack)) {
                    const racksResponse = await getDataCenterRoomRacks(
                        routeQuery.room
                    );
                    const currentRack = racksResponse.data.find(
                        rack => rack.id === routeQuery.rack
                    );

                    if (currentRack) {
                        this.setCurrentDataCenterRack(currentRack);
                    }
                }
            }
        },
    },
    computed: {
        ...mapState([
            'currentDataCenter',
            'currentDataCenterRack',
            'currentDataCenterRoom',
            'dataCenters',
        ]),
    },
    created() {
        this.fetchData();
    },
};
</script>
