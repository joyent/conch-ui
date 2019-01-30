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
                                    <input class="input" placeholder="Search for Device" v-model="searchText" @focus="hideDropdown = false">
                                </div>
                            </div>
                            <div class="dropdown-menu is-paddingless">
                                <div class="dropdown-content" v-if="foundDevices.length && !hideDropdown">
                                    <a class="dropdown-item" v-for="(device, index) in foundDevices" :key="index" @click="setSearchedDevice(device)">
                                        {{ device.id }}
                                        <span class="has-text-grey-light" v-if="device.asset_tag">{{ device.asset_tag }}</span>
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
                                <LayoutPanel :rack-loading="rackLoading" />
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
import isEmpty from 'lodash/isEmpty';
import search from 'fuzzysearch';
import { EventBus } from '../../eventBus.js';
import { getRackById, getDevices, getAllRacks } from '../../api/workspaces.js';
import { getLocation } from '../../api/device.js';
import { mapActions, mapGetters, mapState } from 'vuex';
import { getRackRooms, roomToProgress } from '../shared/utils.js';

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
            foundDevices: [],
            hideDropdown: true,
            maxFoundDevices: 12,
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
            'clearActiveDevice',
            'clearActiveRoom',
            'clearRackLayout',
            'setActiveRoom',
            'setAllRooms',
            'setDevicesByWorkspace',
            'setHighlightDeviceId',
            'setRackLayout',
            'setRackRoomsByWorkspace',
        ]),
        clearActiveData() {
            this.clearActiveDevice();
            this.clearActiveRoom();
            this.clearRackLayout();
        },
        handleWorkspaceDevices() {
            let currentWorkspaceId = this.currentWorkspaceId;
            let workspaceDevicesFromState = this.getDevicesByWorkspace(currentWorkspaceId);

            if (workspaceDevicesFromState) {
                let devices = Object.values(workspaceDevicesFromState)[0];
                this.workspaceDevices = devices;
            } else {
                getDevices(currentWorkspaceId)
                    .then(response => {
                        let devices = response.data;
                        let workspace = {};

                        devices.sort((a, b) => a.id - b.id);
                        this.workspaceDevices = devices;

                        workspace[currentWorkspaceId] = devices;
                        this.setDevicesByWorkspace(workspace);
                    });
            }
        },
        handleWorkspaceRacks() {
            let currentWorkspaceId = this.currentWorkspaceId;
            let workspaceRackRooms = this.getRackRoomsByWorkspace(currentWorkspaceId);

            if (!isEmpty(workspaceRackRooms)) {
                let rooms = Object.values(workspaceRackRooms)[0];
                this.rackRooms = getRackRooms(rooms);
                this.setAllRooms(this.rackRooms);
            } else {
                getAllRacks(currentWorkspaceId)
                    .then(response => {
                        let rooms = response.data;
                        let workspaceRackRooms = {};

                        workspaceRackRooms[currentWorkspaceId] = rooms;
                        this.setRackRoomsByWorkspace(workspaceRackRooms);
                        this.rackRooms = getRackRooms(rooms);
                        this.setAllRooms(this.rackRooms);
                    });
            }
        },
        setFoundDevices(searchText) {
            let devices = this.workspaceDevices;
            let text = searchText.toLowerCase();

            this.foundDevices = devices.reduce((acc, device) => {
                if (acc.length > this.maxFoundDevices) {
                    return acc;
                }

                let deviceId = device.id.toLowerCase();
                let assetTag = device.asset_tag ? device.asset_tag.toLowerCase() : false;

                if (search(text, deviceId) || (assetTag && search(text, assetTag))) {
                    acc.push(device);
                }

                return acc;
            }, []);
        },
        setSearchedDevice(device) {
            this.hideDropdown = true;
            this.setHighlightDeviceId(device.id);

            getLocation(device.id)
                .then(response => {
                    let location = response.data;

                    let activeRoom = this.rackRooms.find(room => {
                        return room.name === location.datacenter.name;
                    })

                    this.setActiveRoom(activeRoom);

                    this.rackLoading = true;

                    getRackById(this.currentWorkspaceId, location.rack.id)
                        .then(response => {
                            this.setRackLayout(response);
                            this.rackLoading = false;
                        });
                });
        },
    },
    computed: {
        ...mapGetters([
            'currentWorkspaceId',
            'getDevicesByWorkspace',
            'getRackRoomsByWorkspace',
        ]),
        ...mapState([
            'activeRoom',
            'currentWorkspace',
        ]),
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
        searchText(searchText) {
            if (searchText !== '') {
                this.setFoundDevices(searchText);
            }
        },
    },
    created() {
        this.handleWorkspaceDevices();
        this.handleWorkspaceRacks();
    },
    mounted() {
        EventBus.$on('changeWorkspace:datacenter', () => {
            this.handleWorkspaceDevices();
            this.handleWorkspaceRacks();
            this.clearActiveData();
        });
    },
    destroyed() {
        this.clearActiveData();
    },
};
</script>
