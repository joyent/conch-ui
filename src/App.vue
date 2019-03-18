<template>
    <div id="app">
        <div v-if="this.$route.path === '/'">
            <SignIn/>
        </div>
        <div v-else-if="this.$route.params.currentWorkspace">
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
        <div v-else>
            <PageNotFound/>
        </div>
    </div>
</template>

<script>
import PageNotFound from './views/PageNotFound/PageNotFound.vue';
import SignIn from './views/SignIn/SignIn.vue';
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapGetters, mapState } from 'vuex';
import { isLoggedIn } from '@api/authentication.js';
import { loadAllWorkspaces, getRackById } from '@api/workspaces.js';
import { getDeviceSettings, getDeviceDetails, getDeviceValidations } from '@api/device.js';
import { getValidations } from '@api/validations.js';
import { getRackRooms, roomToProgress, getWorkspaceRacks } from '@views/shared/utils.js';

export default {
    components: {
        PageNotFound,
        SignIn,
    },
    methods: {
        ...mapActions([
            'setActiveDevice',
            'setActiveDeviceDetails',
            'setActiveDeviceSettings',
            'setActiveDeviceValidations',
            'setActiveRoom',
            'setAllRooms',
            'setCurrentWorkspace',
            'setRackLayout',
            'setValidations',
            'setWorkspaces',
        ]),
        setRoomsAndStore() {
            const currentWorkspaceId = this.currentWorkspaceId;

            getWorkspaceRacks(currentWorkspaceId)
                .then(response => {
                    const rooms = response;

                    this.setAllRooms(getRackRooms(rooms));

                    // Sets store based on params in current route URL
                    if (this.$route.params) {
                        const routeParams = this.$route.params;

                        if (routeParams.deviceId) {
                            const activeDeviceId = routeParams.deviceId;

                            getDeviceSettings(activeDeviceId)
                                .then(response => {
                                    this.setActiveDeviceSettings(response.data);
                                });
                            getDeviceDetails(activeDeviceId)
                                .then(response => {
                                    const activeDeviceDetails = response.data;
                                    this.setActiveDevice(activeDeviceDetails)
                                    this.setActiveDeviceDetails(activeDeviceDetails);
                                });
                            getDeviceValidations(activeDeviceId)
                                .then(response => {
                                    this.setActiveDeviceValidations(response.data);
                                });
                            getValidations()
                                .then(response => {
                                    this.setValidations(response.data);
                                });
                        }

                        if (routeParams.roomName) {
                            const roomName = routeParams.roomName;
                            const name = Object.keys(rooms).find(room => {
                                return room === roomName;
                            });
                            const racks = rooms[name];
                            const progress = roomToProgress(racks);

                            this.setActiveRoom({ name, racks, progress });
                        }

                        if (routeParams.rackId) {
                            getRackById(currentWorkspaceId, routeParams.rackId)
                                .then(response => {
                                    this.setRackLayout(response);
                                    this.rackLoading = false;
                                });
                        }
                    }
                });
        },
        setWorkspace(currentWorkspaceId) {
            if (currentWorkspaceId) {
                this.setCurrentWorkspace(this.findWorkspaceById(currentWorkspaceId));
            } else {
                this.setCurrentWorkspace(this.loadCurrentWorkspace());
            }
        },
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
            'currentWorkspaceId',
            'findWorkspaceById',
            'loadCurrentWorkspace',
        ]),
        ...mapState([
            'currentWorkspace',
            'workspaces',
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
            let currentWorkspaceId;

            if (this.$route.params && this.$route.params.currentWorkspace) {
                currentWorkspaceId = this.$route.params.currentWorkspace;
            }

            if (isEmpty(this.workspaces)) {
                loadAllWorkspaces()
                    .then(response => {
                        this.setWorkspaces(response.data);
                        this.setWorkspace(currentWorkspaceId);
                        this.setRoomsAndStore();
                    });
            } else {
                this.setWorkspace(currentWorkspaceId);
                this.setRoomsAndStore();
            }
        }
    },
};
</script>
