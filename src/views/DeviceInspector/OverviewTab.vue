<template>
    <div class="overview-tab">
        <div class="level">
            <div class="level-left">
                <div class="level-item tags">
                    <div class="tag" v-for="(tag, index) in deviceTags" :key="index" :class="tag.style">
                        {{ tag.title }}
                    </div>
                </div>
            </div>
            <div class="level-right" v-if="activeDeviceDetails.location">
                <div class="level-item">
                    <button class="button is-small is-link is-rounded" @click="showDeviceInRack">Show Device in Rack</button>
                </div>
            </div>
        </div>
        <section class="info-tiles">
            <div class="tile is-ancestor has-text-centered">
                <div class="tile is-parent is-vertical">
                    <article class="tile is-child box">
                        <p class="subtitle">Last Reported</p>
                        <p class="title" v-if="activeDeviceDetails.last_seen">{{ lastSeen }}</p>
                        <p class="title" v-else>Never</p>
                    </article>
                    <article class="tile is-child box">
                        <p class="subtitle">Uptime</p>
                        <p class="title" v-if="activeDeviceDetails.uptime_since">{{ uptimeSince }}</p>
                        <p class="title" v-else>Unknown</p>
                    </article>
                    <article class="tile is-child box">
                        <p class="subtitle">BIOS Version</p>
                        <p class="title" v-if="activeDeviceDetails.latest_report">{{ activeDeviceDetails.latest_report.bios_version }}</p>
                        <p class="title" v-else>Unknown</p>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <p class="subtitle">Time for Burn-in</p>
                        <TimeToBurnin/>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import moment from 'moment';
import TimeToBurnin from './TimeToBurnin.vue';
import { EventBus } from '../../eventBus.js';
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
    components: {
        TimeToBurnin,
    },
    methods: {
        ...mapActions([
            'setHighlightDeviceId',
        ]),
        showDeviceInRack() {
            let { datacenter, rack } = this.activeDeviceDetails.location;
            let route = this.$route.path;
            let workspaceRoute = route.substring(0, route.indexOf("/", 1));

            this.setHighlightDeviceId(this.activeDeviceId);

            EventBus.$emit('closeModal:deviceModal');

            this.$router.push({path: `${workspaceRoute}/datacenter/${datacenter.name}/rack/${rack.id}/device?highlightDeviceId=${this.activeDeviceId}` });
        },
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
        ]),
        ...mapState([
            'activeDevice',
            'activeDeviceDetails',
            'activeDeviceSettings',
        ]),
        deviceTags() {
            let tags = [];
            let health;

            // Todo: Look into loading activeDeviceDetails data faster
            //       If a user clicks through the UI fast, health may
            //       not exist yet
            if (this.activeDeviceDetails.health) {
                health = this.activeDeviceDetails.health.toLowerCase();
            }

            if (health === 'fail') {
                tags.push({
                    style: 'is-danger',
                    title: 'Failing Validation'
                });
            } else if (health === 'pass') {
                tags.push({
                    style: 'is-info',
                    title: 'Passing Validation'
                });
            } else if (health === 'unknown') {
                tags.push({
                    style: 'is-warning',
                    title: 'No Report'
                });
            }

            if (this.activeDeviceSettings.firmware === 'updating') {
                tags.push({
                    style: 'is-warning',
                    title: 'Firmware Updating'
                });
            }

            if (this.activeDeviceDetails.validated) {
                tags.push({
                    style: 'is-success',
                    title: 'Validated'
                });
            } else if (this.activeDeviceDetails.graduated) {
                tags.push({
                    style: 'is-success',
                    title: 'Graduated'
                });
            } else if (this.activeDeviceDetails.triton_setup) {
                tags.push({
                    style: 'is-success',
                    title: 'Triton Setup'
                });
            }

            return tags;
        },
        lastSeen() {
            return moment(this.activeDeviceDetails.last_seen).fromNow();
        },
        uptimeSince() {
            return moment(this.activeDeviceDetails.uptime_since).fromNow(true);
        },
    },
};
</script>
