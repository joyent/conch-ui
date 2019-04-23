<template>
    <div id="app">
        <SignIn v-if="this.$route.path === '/'" />
        <div v-else>
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
    </div>
</template>

<script>
import SignIn from './views/SignIn/SignIn.vue';
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapGetters, mapState } from 'vuex';
import { isLoggedIn } from '@api/authentication.js';
import { loadAllWorkspaces, getRackById } from '@api/workspaces.js';
import { getDeviceSettings, getDeviceDetails, getDeviceValidations } from '@api/device.js';
import { getCurrentUser } from '@api/users.js';
import { getValidations } from '@api/validations.js';
import { getRackRooms, roomToProgress, getWorkspaceRacks } from '@views/shared/utils.js';

export default {
    components: {
        SignIn,
    },
    methods: {
        ...mapActions([
            'setActiveDevice',
            'setActiveDeviceDetails',
            'setActiveDeviceSettings',
            'setActiveDeviceValidations',
            'setActiveRoomName',
            'setAllRooms',
            'setCurrentUser',
            'setCurrentWorkspace',
            'setRackLayout',
            'setValidations',
            'setWorkspaces',
        ]),
        findWorkspaceById(id) {
            return this.workspaces.find(workspace => workspace.id === id) ||
                   null;
        },
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
                            this.setActiveRoomName(routeParams.roomName);
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
            'loadCurrentWorkspace',
        ]),
        ...mapState([
            'currentUser',
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

            if (isEmpty(this.currentUser)) {
                getCurrentUser()
                    .then(response => {
                        this.setCurrentUser(response.data);
                    });
            }
        }
    },
};
</script>
