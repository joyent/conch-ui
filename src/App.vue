<template>
    <div id="app" v-if="this.$route.path === '/'">
        <SignIn/>
    </div>
    <div id="app" v-else-if="hasWorkspace">
        <router-view name="navbar"></router-view>
        <div class="section">
            <div class="columns">
                <div class="column is-2">
                    <router-view name="sidebar"></router-view>
                </div>
                <div class="column is-10">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Layout from './views/Layout/Layout.vue';
import SignIn from './views/SignIn/SignIn.vue';
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapState, mapGetters } from 'vuex';
import { isLoggedIn } from './api/authentication';
import { loadAllWorkspaces, getRackById, getAllRacks } from './api/workspaces';
import { getDeviceSettings, getDeviceDetails, getDeviceValidations } from './views/DeviceInspector/api';
import { getValidations } from './api/validations';
import { roomToProgress } from './views/shared/utils.js';

export default {
    components: {
        Layout,
        SignIn,
    },
    methods: {
        ...mapActions([
            'setActiveRack',
            'setActiveRoom',
            'setActiveDeviceDetails',
            'setActiveDeviceSettings',
            'setActiveDeviceValidations',
            'setAllRooms',
            'setCurrentWorkspace',
            'setRackLayout',
            'setValidations',
            'setWorkspaces',
        ]),
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
            'currentWorkspaceId',
        ]),
        ...mapState([
            'currentWorkspace',
        ]),
        hasWorkspace() {
            return !isEmpty(this.currentWorkspace);
        },
    },
    mounted() {
        // Reloads the currentWorkspace if the page is reloaded/refreshed.
        // Also re-adds any relevant data to the store based on route params.
        // This ensures that all necessary data is available to the page on reload.
        if (!this.hasWorkspace && isLoggedIn()) {
            loadAllWorkspaces()
                .then(response => {
                    this.setWorkspaces(response.data);
                    this.setCurrentWorkspace(this.$store.getters.loadCurrentWorkspace());

                    getAllRacks(this.currentWorkspaceId)
                        .then(response => {
                            let rooms = response.data;
                            let rackRooms = Object.keys(rooms)
                                .sort()
                                .reduce((acc, name) => {
                                    let racks = rooms[name];
                                    let progress = roomToProgress(racks);
                                    acc.push({
                                        name,
                                        racks,
                                        progress,
                                    });

                                    return acc;
                                }, []);

                            this.setAllRooms(rackRooms);
                        });

                    if (this.$route.params) {
                        if (this.$route.params.roomName) {
                            const roomName = this.$route.params.roomName;
                            let name = Object.keys(rooms).find(room => {
                                return room === roomName;
                            });
                            let racks = rooms[name];
                            let progress = roomToProgress(racks);

                            this.setActiveRoom({ name, racks, progress });

                            if (this.$route.params.rackId) {
                                const rackId = this.$route.params.rackId;
                                getRackById(this.currentWorkspaceId, rackId)
                                    .then(response => {
                                        this.setActiveRack(response);
                                        this.setRackLayout(response);
                                        this.rackLoading = false;
                                    });

                                if (this.$route.params.deviceId) {
                                    getDeviceSettings(this.activeDeviceId)
                                        .then(response => {
                                            this.setActiveDeviceSettings(response.data);
                                        });
                                    getDeviceDetails(this.activeDeviceId)
                                        .then(response => {
                                            this.setActiveDeviceDetails(response.data);
                                        });
                                    getDeviceValidations(this.activeDeviceId)
                                        .then(response => {
                                            this.setActiveDeviceValidations(response.data);
                                        });
                                    getValidations()
                                        .then(response => {
                                            this.setValidations(response.data);
                                        });
                                }
                            }
                        }
                    }
                });
        }
    }
};
</script>
