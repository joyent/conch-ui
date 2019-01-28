<template>
    <div class="status">
        <PageHeader :title="title" :subtitle="'Overview of workspace build progress'" />
        <section class="info-tiles">
            <div class="tile is-ancestor has-text-centered">
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <progress class="progress is-info" :value="progressPercent" max="100"></progress>
                    </article>
                </div>
            </div>
            <div class="tile is-ancestor has-text-centered">
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <Spinner v-if="rackCount === 0" />
                        <div class="rack-count" v-else>
                            <p class="title">{{ rackCount }}</p>
                            <p class="subtitle">Racks</p>
                        </div>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <Spinner v-if="devices.length === 0" />
                        <div class="device-count" v-else>
                            <p class="title">{{ devices.length }}</p>
                            <p class="subtitle">Devices</p>
                        </div>
                    </article>
                </div>
            </div>
            <div class="tile is-ancestor has-text-centered">
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <div class="box" style="background-color:rgba(28%, 61%, 91%, 0.4)">
                            <div class="rack-rooms-status">
                                <p class="subtitle">Rack Validation Status</p>
                                <RackProgress :group="'status'" />
                            </div>
                        </div>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <div class="box" style="background-color:rgba(28%, 61%, 91%, 0.4)">
                            <div class="rack-rooms-role">
                                <p class="subtitle">Validation Status by Role</p>
                                <RackProgress :group="'role'" />
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
        <DeviceModal/>
    </div>
</template>

<script>
import DeviceModal from '../components/DeviceModal.vue';
import PageHeader from '../components/PageHeader.vue';
import RackProgress from './RackProgress.vue';
import Spinner from '../components/Spinner.vue';
import isEmpty from 'lodash/isEmpty';
import { EventBus } from '../../eventBus.js';
import { getDevices, getAllRacks } from '../../api/workspaces.js';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
    components: {
        DeviceModal,
        PageHeader,
        RackProgress,
        Spinner,
    },
    data() {
        return {
            devices: [],
            rackRooms: [],
            workspaceId: '',
        };
    },
    methods: {
        ...mapActions([
            'setDevicesByWorkspace',
            'setRackRoomsByWorkspace',
        ]),
        handleWorkspaceDevices() {
            this.workspaceId = this.currentWorkspaceId;

            if (!this.workspaceId) {
                this.workspaceId = this.$route.params.currentWorkspace;
            }

            let workspaceDevicesFromState = this.getDevicesByWorkspace(this.workspaceId);

            if (workspaceDevicesFromState) {
                this.devices = Object.values(workspaceDevicesFromState)[0];
            } else {
                getDevices(this.workspaceId)
                    .then(response => {
                        let workspaceDevices = {};
                        let devices = response.data;
                        this.devices = devices;

                        workspaceDevices[this.workspaceId] = devices;
                        this.setDevicesByWorkspace(workspaceDevices);
                    });
            }
        },
    },
    computed: {
        ...mapGetters([
            'currentWorkspaceId',
            'getDevicesByWorkspace',
            'getRackRoomsByWorkspace',
        ]),
        ...mapState([
            'currentWorkspace',
        ]),
        rackCount() {
            let rackCount = 0;
            let workspace = this.getRackRoomsByWorkspace(this.workspaceId);

            if (!isEmpty(workspace)) {
                let rooms = Object.values(workspace)[0];

                Object.values(rooms).forEach(room => {
                    rackCount += room.length
                });
            }

            return rackCount;
        },
        currentWorkspaceName() {
            return this.currentWorkspace.name;
        },
        progress() {
            const newProgress = {pass: 0, total: 0 };

            this.devices.forEach(device => {
                if (device.health === 'PASS') {
                    newProgress.pass++;
                }

                newProgress.total++;
            });

            return newProgress;
        },
        progressPercent() {
            let progress = this.progress;

            return progress.total ? progress.pass / progress.total * 100 : 0;
        },
        title() {
            return `${this.currentWorkspaceName} workspace status`;
        },
    },
    created() {
        this.handleWorkspaceDevices();
    },
    mounted() {
        EventBus.$on('changeWorkspace:status', () => {
            this.handleWorkspaceDevices();
        });
    },
};
</script>
