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
                        <div class="rack-count">
                            <p class="title">{{ rackCount }}</p>
                            <p class="subtitle">Racks</p>
                        </div>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <Spinner v-if="!devices" />
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
                                <Spinner v-if="!hasRackRooms" />
                                <RackProgress :group="'status'" v-else />
                            </div>
                        </div>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <div class="box" style="background-color:rgba(28%, 61%, 91%, 0.4)">
                            <div class="rack-rooms-role">
                                <p class="subtitle">Validation Status by Role</p>
                                <Spinner v-if="!hasRackRooms" />
                                <RackProgress :group="'role'" v-else />
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import PageHeader from '../components/PageHeader.vue';
import RackProgress from './RackProgress.vue';
import Spinner from '../components/Spinner.vue';
import isEmpty from 'lodash/isEmpty';
import { EventBus } from '../../eventBus.js';
import { getAllRacks, getDevices } from '../../api/workspaces.js';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    components: {
        PageHeader,
        RackProgress,
        Spinner,
    },
    data() {
        return {
            devices: null,
            rackCount: 0,
            workspaceId: '',
        };
    },
    methods: {
        ...mapActions([
            'setDevicesByWorkspace',
            'setRackRooms',
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
        handleWorkspaceRacks() {
            const currentWorkspaceId = this.currentWorkspaceId;
            const workspaceRackRooms = this.getRackRoomsByWorkspace(currentWorkspaceId);

            if (!isEmpty(workspaceRackRooms)) {
                this.getRackRooms(Object.values(workspaceRackRooms)[0]);
            } else {
                getAllRacks(this.currentWorkspaceId)
                    .then(response => {
                        this.getRackRooms(response.data)
                    });
            }
        },
        getRackRooms(rackRooms) {
            let rackCount = 0;
            const rooms = Object.keys(rackRooms)
                .sort()
                .reduce((acc, room) => {
                    acc[room] = rackRooms[room];
                    rackCount += rackRooms[room].length;
                    return acc;
                }, {});

            this.rackCount = rackCount;
            this.setRackRooms(rooms);
        },
    },
    computed: {
        ...mapGetters([
            'currentWorkspaceId',
            'currentWorkspaceName',
            'getDevicesByWorkspace',
            'getRackRoomsByWorkspace',
        ]),
        ...mapState([
            'rackRooms',
        ]),
        hasRackRooms() {
            return !isEmpty(this.rackRooms);
        },
        progress() {
            const newProgress = { pass: 0, total: 0 };

            if (this.devices) {
                this.devices.forEach(device => {
                    if (device.health === 'PASS') {
                        newProgress.pass++;
                    }

                    newProgress.total++;
                });
            }

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
        this.handleWorkspaceRacks();
    },
    mounted() {
        EventBus.$on('changeWorkspace:status', () => {
            this.handleWorkspaceDevices();
            this.handleWorkspaceRacks();
        });
    },
};
</script>
