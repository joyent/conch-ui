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
                        <Spinner v-if="devices.length > 0" />
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
                            <Spinner v-if="rackRooms === 0" />
                            <div class="rack-rooms-status" v-else>
                                <p class="subtitle">Rack Validation Status</p>
                                <RackProgress :rack-rooms="rackRooms" :group="'status'" />
                            </div>
                        </div>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <div class="box" style="background-color:rgba(28%, 61%, 91%, 0.4)">
                            <Spinner v-if="rackRooms === 0" />
                            <div class="rack-rooms-role" v-else>
                                <p class="subtitle">Rack Validation Role</p>
                                <RackProgress :rack-rooms="rackRooms" :group="'role'" />
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
        <!-- <DeviceModal :active-device-id="activeDeviceId" /> -->
    </div>
</template>

<script>
import DeviceModal from '../components/DeviceModal.vue';
import PageHeader from '../components/PageHeader.vue';
import RackProgress from './RackProgress.vue';
import Spinner from '../components/Spinner.vue';
import { getDevices, getAllRacks } from '../../api/workspaces.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        DeviceModal,
        PageHeader,
        RackProgress,
        Spinner,
    },
    data() {
        return {
            activeDeviceId: '',
            devices: [],
            rackCount: 0,
            rackRooms: 0,
            progress: [],
        };
    },
    computed: {
        currentWorkspaceId() {
            return this.currentWorkspace.id;
        },
        currentWorkspaceName() {
            return this.currentWorkspace.name;
        },
        progressPercent() {
            let progress = this.progress;

            return progress.total ? progress.pass / progress.total * 100 : 0;
        },
        title() {
            return `${this.currentWorkspaceName} workspace status`;
        },
        ...mapState([
            'currentWorkspace',
        ]),
    },
    methods: {
    },
    created() {
        this.devices = [];

        getDevices(this.currentWorkspaceId)
            .then(response => {
                const newProgress = {pass: 0, total: 0 };

                this.devices = response.data.sort((a, b) => a.id - b.id);
                this.devices.forEach(device => {
                    if (device.health === 'PASS') {
                        newProgress.pass++;
                    }

                    newProgress.total++;
                });

                this.progress = newProgress;
            });

        this.rackCount = 0;
        this.rackRooms = 0;

        getAllRacks(this.currentWorkspaceId)
            .then(response => {
                let data = response.data;
                // sort and assign the rack rooms
                this.rackRooms = Object.keys(data)
                    .sort()
                    .reduce((acc, room) => {
                        acc[room] = data[room];
                        this.rackCount += data[room].length;
                        return acc;
                    }, {});
            });
    },
};
</script>
