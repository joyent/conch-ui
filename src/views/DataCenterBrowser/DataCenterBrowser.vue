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
                                    <input class="input" placeholder="Search for Device" v-model="searchText">
                                </div>
                            </div>
                            <div class="dropdown-menu is-paddingless">
                                <div class="dropdown-content" v-if="foundDevices.length">
                                    <a class="dropdown-item" v-for="(device, index) in foundDevices" :key="index" @click="searchedDevice = device">
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
                                <LayoutPanel
                                    v-if="hasRackLayout"
                                    :current-workspace="currentWorkspace"
                                    :active-rack="activeRack"
                                    :rack-loading="rackLoading"
                                    :rack-layout="rackLayout"
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
import isEmpty from 'lodash/isEmpty';
import search from 'fuzzysearch';
import { EventBus } from '../../eventBus.js';
import { getRackById, getDevices, getAllRacks } from '../../api/workspaces.js';
import { getLocation } from '../../api/device.js';
import { mapActions, mapGetters, mapState } from 'vuex';

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
            'clearActiveRoom',
            'clearRackLayout',
            'setRackLayout',
        ]),
        getWorkspaceDevices() {
            getDevices(this.currentWorkspaceId)
                .then(response => {
                    let devices = response.data;

                    devices.sort((a, b) => a.id - b.id);

                    this.workspaceDevices = devices;
                });
        },
        getAllWorkspaceRacks() {
            getAllRacks(this.currentWorkspaceId)
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
    },
    computed: {
        ...mapGetters([
            'activeRackId',
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
        },
        searchText(searchText) {
            if (searchText !== '') {
                this.setFoundDevices(searchText);
            }
        },
    },
    created() {
        this.getWorkspaceDevices();
        this.getAllWorkspaceRacks();
    },
    mounted() {
        EventBus.$on('changeWorkspace:datacenter', () => {
            this.getWorkspaceDevices();
            this.getAllWorkspaceRacks();
            this.clearRackLayout();
            this.clearActiveRoom();
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
