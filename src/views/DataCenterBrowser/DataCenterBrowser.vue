<template>
    <div class="data-center-browser">
        <PageHeader title="Datacenter Browser" />
        <section class="info-tiles">
            <div class="tile is-ancestor has-text-right">
                <div class="tile is-parent">
                    <article class="tile is-child">
                        <DeviceModal />
                        <section class="section" v-if="!hasRackRooms">
                            <Spinner />
                        </section>
                        <div class="columns is-gapless" v-else>
                            <div class="column is-3">
                                <RoomPanel :rack-rooms="rackRooms" />
                            </div>
                            <div class="column is-3">
                                <RackPanel
                                    v-if="activeRacks"
                                    :active-racks="activeRacks"
                                />
                            </div>
                            <div class="column is-6">
                                <LayoutPanel />
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import DeviceModal from './DeviceModal.vue';
import LayoutPanel from './LayoutPanel.vue';
import PageHeader from '@views/components/PageHeader.vue';
import RackPanel from './RackPanel.vue';
import RoomPanel from './RoomPanel.vue';
import Spinner from '@views/components/Spinner.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import { getRackRooms, getWorkspaceRacks } from '@views/shared/utils.js';

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
            currentWorkspaceId: '',
            rackRooms: [],
        };
    },
    methods: {
        ...mapActions([
            'clearActiveDevice',
            'clearActiveRoomName',
            'clearRackLayout',
            'setActiveRoomName',
        ]),
        clearActiveData() {
            this.clearActiveDevice();
            this.clearActiveRoomName();
            this.clearRackLayout();
        },
        isEmpty,
        setWorkspaceRacks() {
            getWorkspaceRacks(this.currentWorkspaceId).then(response => {
                this.rackRooms = getRackRooms(response);
            });
        },
    },
    computed: {
        ...mapState(['activeRoomName']),
        activeRacks() {
            if (this.rackRooms.length) {
                let racks;

                this.rackRooms.map(rackRoom => {
                    if (rackRoom.name === this.activeRoomName) {
                        racks = rackRoom.racks.sort((a, b) => {
                            a.name > b.name ? 1 : -1;
                        });

                        return racks;
                    }
                });

                return racks;
            }

            return [];
        },
        hasRackRooms() {
            return this.rackRooms.length > 0;
        },
    },
    created() {
        if (this.$route.params && this.$route.params.currentWorkspace) {
            this.currentWorkspaceId = this.$route.params.currentWorkspace;
            this.setWorkspaceRacks();
        }
    },
    mounted() {
        if (this.$route && this.$route.params && this.$route.params.roomName) {
            this.setActiveRoomName(this.$route.params.roomName);
        }

        EventBus.$on('changeWorkspace:datacenter', workspaceId => {
            this.currentWorkspaceId = workspaceId;
            this.clearActiveData();
            this.setWorkspaceRacks();
        });
    },
    destroyed() {
        this.clearActiveData();
    },
};
</script>
