<template>
    <div class="data-center-browser">
        <PageHeader :title="`${currentWorkspace.name} workspace datacenters`" :subtitle="'Browse datacenter rooms, racks and devices'" />
        <section class="info-tiles">
            <div class="tile is-ancestor has-text-right">
                <div class="tile is-parent">
                    <article class="tile is-child box" style="padding: 0.75rem;">
                        <div class="dropdown is-right" :class="{ 'is-active': searchText }">
                            <div class="dropdown-trigger">
                                <div class="control" :class="{ 'is-loading': !this.workspaceDevices && searchText }">
                                    <input type="text" class="input" placeholder="Search for Device" v-model="searchText">
                                </div>
                            </div>
                            <div class="dropdown-menu is-paddingless">
                                <div class="dropdown-content" v-if="foundDevices">
                                    <a class="dropdown-item" v-for="(device, index) in foundDevices" :key="index" @click="searchedDevice = device">
                                        {{ device.id }}
                                        <span class="has-text-grey-light">{{ device.asset_tag }}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
            <div class="tile is-ancestor has-text-right">
                <div class="tile is-parent">
                    <article class="tile is-child">
                        <DeviceModal/>
                        <section class="section" v-if="!rackRooms.length">
                            <Spinner/>
                        </section>
                        <div class="columns is-gapless" v-else>
                            <div class="column is-3">
                                <RoomPanel :rack-rooms="rackRooms" />
                            </div>
                            <div class="column is-3">
                                <RackPanel v-if="activeRacks" :active-racks="activeRacks" />
                            </div>
                            <div class="column is-6">
                                <LayoutPanel
                                    v-if="hasRackLayout"
                                    :current-workspace="currentWorkspace"
                                    :active-rack="activeRack"
                                    :rack-loading="rackLoading"
                                    :rack-layout="rackLayout"
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
import { mapActions, mapGetters, mapState } from 'vuex';
import isEmpty from 'lodash/isEmpty'

const maxFoundDevices = 12;

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
            foundDevices: null,
            highlightDeviceId: null,
            rackFilterText: '',
            rackLoading: false,
            rackRooms: [],
            searchedDevice: null,
            searchText: null,
            workspaceDevices: null,

        };
    },
    methods: {
        ...mapActions([
            'clearActiveRoom',
            'clearRackLayout',
            'setRackLayout',
        ]),
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
    watch: {
        searchedDevice(newDevice) {
            let deviceId = newDevice.id;
            getLocation(deviceId)
                .then(deviceLocation => {
                    // this.activeRoomName = deviceLocation.datacenter.name;
                    // this.activeRackId = deviceLocation.rack.id;
                    this.hightlightDeviceId = deviceId;
                });
        },
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
            'activeRackId',
            // 'activeRoomName',
            'currentWorkspaceId',
        ]),
        ...mapState([
            'activeRack',
            'activeRoom',
            'rackLayout',
            'currentWorkspace',
        ]),
        hasRackLayout() {
            return !isEmpty(this.rackLayout);
        },
        activeRacks() {
            if (!isEmpty(this.activeRoom)) {
                return this.activeRoom.racks.sort((a, b) => {
                    a.name > b.name ? 1 : -1
                });
            }

            return null;
        },
    },
    watch: {
        activeRack() {
            this.rackLoading = true;

            getRackById(this.currentWorkspaceId, this.activeRackId)
                .then(response => {
                    this.setRackLayout(response);
                    this.rackLoading = false;
                });
        }
    },
    created() {
        getDevices(this.currentWorkspaceId)
            .then(response => {
                let devices = response.data;

                this.workspaceDevices = devices.sort((a, b) => a.id = b.id);
            });

        getAllRacks(this.currentWorkspace.id)
            .then(response => {
                let data = response.data;

                this.rackRooms = Object.keys(data)
                    .sort()
                    .reduce((acc, name) => {
                        let racks = data[name];
                        let progress = this.roomToProgress(racks);
                        acc.push({
                            name,
                            racks,
                            progress,
                        });

                        return acc;
                    }, []);


            });
    },
    destroyed() {
        if (!isEmpty(this.activeRoom)) {
            this.clearActiveRoom();
        }

        if (!isEmpty(this.rackLayout)) {
            this.clearRackLayout();
        }
    },
};
</script>
