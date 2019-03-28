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
                            <Spinner v-if="!rackCount" />
                            <p class="title" v-else>{{ rackCount }}</p>
                            <p class="subtitle">Racks</p>
                        </div>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <div class="device-count">
                            <Spinner v-if="!workspaceDevices" />
                            <p class="title" v-else>{{ workspaceDevices.length }}</p>
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
import PageHeader from '@views/components/PageHeader.vue';
import RackProgress from './RackProgress.vue';
import Spinner from '@views/components/Spinner.vue';
import isEmpty from 'lodash/isEmpty';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapGetters, mapState } from 'vuex';
import { getWorkspaceRacks, getWorkspaceDevices } from '@views/shared/utils';

export default {
    components: {
        PageHeader,
        RackProgress,
        Spinner,
    },
    data() {
        return {
            rackCount: null,
            workspaceDevices: null,
        };
    },
    methods: {
        ...mapActions([
            'setRackRooms',
        ]),
        setWorkspaceDevices() {
            getWorkspaceDevices(this.workspaceId)
                .then(response => {
                    this.workspaceDevices = response;
                });
        },
        setWorkspaceRacks() {
            getWorkspaceRacks(this.workspaceId)
                .then(response => {
                    this.setRackRoomsData(response);
                });
        },
        setRackRoomsData(rackRooms) {
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
        ]),
        ...mapState([
            'currentWorkspace',
            'rackRooms',
        ]),
        hasRackRooms() {
            return !isEmpty(this.rackRooms);
        },
        progress() {
            const newProgress = { pass: 0, total: 0 };

            if (this.workspaceDevices && this.workspaceDevices.length) {
                this.workspaceDevices.forEach(device => {
                    if (device.health.toLowerCase() === 'pass') {
                        newProgress.pass++;
                    }

                    newProgress.total++;
                });
            }

            return newProgress;
        },
        progressPercent() {
            const progress = this.progress;
            return progress.total ? progress.pass / progress.total * 100 : 0;
        },
        title() {
            return `${this.currentWorkspaceName} workspace status`;
        },
        workspaceId() {
            let workspaceId = this.currentWorkspaceId;

            if (!workspaceId && !isEmpty(this.currentWorkspace)) {
                workspaceId = this.currentWorkspace.id;
            }

            if (!workspaceId) {
                if (
                    this.$route &&
                    this.$route.params &&
                    this.$route.params.currentWorkspace
                ) {
                    workspaceId = this.$route.params.currentWorkspace;
                }
            }

            return workspaceId;
        },
    },
    created() {
        this.setWorkspaceDevices();
        this.setWorkspaceRacks();
    },
    mounted() {
        EventBus.$on('changeWorkspace:status', () => {
            this.setWorkspaceDevices();
            this.setWorkspaceRacks();
        });
    },
};
</script>
