<template>
    <div class="data-center-browser">
        <PanelHeader :title="`${currentWorkspace.name} workspace datacenters`" :subtitle="'Browse datacenter rooms, racks and devices'" />
        <section class="info-tiles">
            <div class="tile is-ancestor has-text-right">
                <div class="tile is-parent">
                    <article class="tile is-child box" style="padding: 0.75rem;">
                        <div class="dropdown-trigger">
                            <div class="control" :class="{ 'is-loading': !this.workspaceDevices && searchText }">
                                <input type="text" class="input" placeholder="Search for Device" v-model="searchText">
                            </div>
                        </div>
                        <div class="dropdown-menu is-paddingless">
                            <div class="dropdown-content">
                                <a class="dropdown-item" v-for="(device, index) in foundDevices" :key="index">
                                    {{ device.id }}
                                    <span class="has-text-grey-light">{{ device.asset_tag }}</span>
                                </a>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
            <div class="tile is-ancestor has-text-right">
                <div class="tile is-parent">
                    <article class="tile is-child">
                        <DeviceModal v-if="activeDeviceId" :active-device-id="activeDeviceId" />
                        <section class="section" v-if="rackRooms == null">
                            <Spinner/>
                        </section>
                        <div class="columns is-gapless">
                            <div class="column is-3">
                                <RoomPanel :rack-rooms="rackRooms" :active-room-name="activeRoomName" />
                            </div>
                            <div class="column is-3">
                                <RackPanel :active-room-name="activeRoomName" :active-racks="activeRacks" :active-rack-id="activeRackId" />
                            </div>
                            <div class="column is-6">
                                <LayoutPanel
                                    :current-workspace="currentWorkspace"
                                    :active-rack="activeRack"
                                    :rack-loading="rackLoading"
                                    :rack-layout="rackLayout"
                                    :active-device-id="activeDeviceId"
                                    :highlight-device-id="highlightDeviceId"
                                />
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import DeviceModal from '../components/DeviceModal.vue';
import LayoutPanel from './LayoutPanel.vue';
import PageHeader from '../components/PageHeader.vue';
import RackPanel from './RackPanel.vue';
import RoomPanel from './RoomPanel.vue';
import Spinner from '../components/Spinner.vue';
import { getRackById, getDevices, getAllRacks } from '../../api/workspaces.js';
import { getLocation } from '../../api/device.js';
import { mapState } from 'vuex';

export default {
    components: {
        DeviceModal,
        LayoutPanel,
        PageHeader,
        RackPanel,
        RoomPanel,
        Spinner,
    },
    data() {
        return {
            activeDeviceId: '',
            activeRoomName: '',
            activeRackId: '',
            highlightDeviceId: '',
            maxFoundDevices: 12,
            rackFilterText: '',
            rackLayout: {},
            rackLoading: false,
            rackRooms: [],
            searchText: '',
            searchedDevice: '',
            workspaceDevices: [],
        };
    },
    methods: {
        roomToProgress(racks) {
            if (racks.some(rack => rack["device_progress"]["FAIL"])) {
                return "failing";
            } else if (racks.some(rack => rack["device_progress"]["PASS"])) {
                return "in progress";
            } else if (racks.every(rack => rack["device_progress"]["VALID"])) {
                return "validated";
            } else {
                return "not started";
            }
        },
    },
    computed: {
        ...mapState([
            'currentWorkspace',
        ]),
        activeRacks() {
            return this.activeRoom.map(room => {
                this.rackLayout = '';
                // return room ? room.racks.sort((a, b) => (a.name > b.name ? 1 : -1)) : STREAM.HALT
            })
        },
        activeRack() {
            // ??
        },
        foundDevices() {
            // ??
        },
        activeRoom() {

        },
    },
    created() {
        this.activeRack.map(rack => {
            this.rackLoading = true;

            getRackById(rack.id)
                .then(response => {
                    this.rackLayout = response.data;
                    this.rackLoading = false;
                });
        });

        this.activeRoomName = this.$route.params.roomName;
        this.activeRackId = this.$route.params.rackId;
        this.activeDeviceId = this.$route.params.deviceId;

        activeRoomName.map(name => {

        });

        activeRackId.map(rackId => {

        });

        activeDeviceId.map(deviceId => {

        });

        let id = this.currentWorkspace.id;

        getDevices(id)
            .then(response => {
                let devices = response.data;
                devices.sort((a, b) => a.id - b.id);
                this.workspaceDevices = devices;
            });

        getAllRacks(id)
            .then(response => {
                let data = response.data;

                this.rackRooms = Object.keys(data)
                    .sort()
                    .reduce((acc, name) => {
                        let racks = data[name];
                        acc.push({
                            name,
                            racks,
                            progress: this.roomToProgress(racks)
                        });

                        return acc;
                    }, []);
            });

        this.searchedDevice.map(device => {
            getLocation(device.id)
                .then(response => {
                    let location = response.data;
                    this.activeRoomName = location.datacenter.name;
                    this.activeRackId = location.rack.id;
                    this.highlightDeviceId = device.id;
                });
        });
    }
};
</script>
