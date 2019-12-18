<template>
    <div id="app">
        <SignIn v-if="this.$route.path === '/'" />
        <PasswordReset v-else-if="this.$route.path === '/password-reset'" />
        <div class="signed-in" v-else>
            <router-view name="sidebar" />
            <div class="page">
                <router-view name="navbar" />
                <router-view class="page-content" :key="$route.fullPath" />
            </div>
        </div>
    </div>
</template>

<script>
import PasswordReset from './views/PasswordReset/PasswordReset.vue';
import SignIn from './views/SignIn/SignIn.vue';
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapGetters, mapState } from 'vuex';
import { isLoggedIn } from '@api/authentication.js';
import { loadAllWorkspaces } from '@api/workspaces.js';
import {
    getDeviceDetails,
    getDeviceSettings,
    getDeviceValidations,
} from '@api/devices.js';
import { getValidations } from '@api/validations.js';
import { getRackRooms, getWorkspaceRacks } from '@views/shared/utils.js';

export default {
    components: {
        PasswordReset,
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
            'setCurrentWorkspace',
            'setRackLayout',
            'setValidations',
            'setWorkspaces',
        ]),
        findWorkspaceById(id) {
            return (
                this.workspaces.find(workspace => workspace.id === id) || null
            );
        },
        setRoomsAndStore() {
            const currentWorkspaceId = this.currentWorkspaceId;

            getWorkspaceRacks(currentWorkspaceId).then(response => {
                const rooms = response;

                this.setAllRooms(getRackRooms(rooms));

                // Sets store based on params in current route URL
                if (this.$route.params) {
                    const routeParams = this.$route.params;

                    if (routeParams.deviceId) {
                        const activeDeviceId = routeParams.deviceId;

                        getDeviceSettings(activeDeviceId).then(response => {
                            this.setActiveDeviceSettings(response.data);
                        });
                        getDeviceDetails(activeDeviceId).then(response => {
                            const activeDeviceDetails = response.data;
                            this.setActiveDevice(activeDeviceDetails);
                            this.setActiveDeviceDetails(activeDeviceDetails);
                        });
                        getDeviceValidations(activeDeviceId).then(response => {
                            this.setActiveDeviceValidations(response.data);
                        });
                        getValidations().then(response => {
                            this.setValidations(response.data);
                        });
                    }

                    if (routeParams.roomName) {
                        this.setActiveRoomName(routeParams.roomName);
                    }
                }
            });
        },
        setWorkspace(currentWorkspaceId) {
            if (currentWorkspaceId) {
                this.setCurrentWorkspace(
                    this.findWorkspaceById(currentWorkspaceId)
                );
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
        ...mapState(['currentWorkspace', 'workspaces']),
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
                loadAllWorkspaces().then(response => {
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
