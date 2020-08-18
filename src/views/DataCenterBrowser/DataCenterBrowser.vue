<template>
    <div class="data-center-browser">
        <PageHeader title="Datacenter Browser" />
        <section class="info-tiles">
            <div class="tile is-ancestor has-text-right">
                <div class="tile is-parent">
                    <article class="tile is-child">
                        <DeviceModal />
                        <section class="section" v-if="!rackRooms.length">
                            <Spinner />
                        </section>
                        <div class="columns is-gapless" v-else>
                            <div class="column is-3">
                                <RoomPanel />
                            </div>
                            <div class="column is-3">
                                <RackPanel
                                    v-if="activeRoomName"
                                    @rack-activated="rackActivated = true"
                                />
                            </div>
                            <div class="column is-6">
                                <spinner
                                    v-if="
                                        activeRoomName &&
                                            rackActivated &&
                                            isEmpty(rackLayout)
                                    "
                                ></spinner>
                                <LayoutPanel v-else-if="!isEmpty(rackLayout)" />
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
import { mapActions, mapState } from 'vuex';
import { getWorkspaceRacks } from '@api/workspaces.js';
import { setGlobalWorkspaceId } from '@src/views/shared/utils.js';

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
            rackActivated: false,
        };
    },
    methods: {
        ...mapActions([
            'clearActiveDevice',
            'clearActiveRoomName',
            'clearRackLayout',
            'setActiveRoomName',
            'setRackRooms',
        ]),
        clearActiveData() {
            this.clearActiveDevice();
            this.clearActiveRoomName();
            this.clearRackLayout();
        },
        isEmpty,
        async setWorkspaceRacks() {
            if (!this.globalWorkspaceId) {
                await setGlobalWorkspaceId();
            }

            getWorkspaceRacks(this.globalWorkspaceId).then(response => {
                const rooms = response.data;
                const rackRooms = Object.keys(rooms)
                    .sort()
                    .reduce((acc, name) => {
                        let progress;
                        let racks = rooms[name];

                        if (
                            racks.some(rack => rack['device_progress']['fail'])
                        ) {
                            progress = 'failing';
                        } else if (
                            racks.some(rack => rack['device_progress']['pass'])
                        ) {
                            progress = 'in progress';
                        } else if (
                            racks.every(
                                rack => rack['device_progress']['valid']
                            )
                        ) {
                            progress = 'validated';
                        } else {
                            progress = 'not started';
                        }

                        acc.push({ name, progress, racks });

                        return acc;
                    }, []);

                this.setRackRooms(rackRooms);
            });
        },
    },
    computed: {
        ...mapState([
            'activeRoomName',
            'globalWorkspaceId',
            'rackRooms',
            'rackLayout',
        ]),
    },
    created() {
        this.clearActiveData();
        this.setWorkspaceRacks();

        if (this.$route.params && this.$route.params.roomName) {
            this.setActiveRoomName(this.$route.params.roomName);
        }
    },
};
</script>
