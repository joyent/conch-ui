<template>
    <div class="overview-tab">
        <div class="level">
            <div class="level-left">
                <div class="level-item tags">
                    <div
                        class="tag"
                        v-for="(tag, index) in deviceTags"
                        :key="index"
                        :class="{
                            'is-danger': tag.state === 'fail',
                            'is-info': tag.state === 'pass',
                            'is-warning': tag.state === 'unknown' || tag.state === 'updating',
                            'is-success': tag.state === 'validated' || tag.state === 'graduated' || tag.state === 'triton_setup'
                        }"
                    >
                        {{ tag.title }}
                    </div>
                </div>
            </div>
            <div class="level-right" v-if="activeDevice.location">
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
                        <p class="title" v-if="activeDevice.last_seen">{{ lastSeen }}</p>
                        <p class="title" v-else>Never</p>
                    </article>
                    <article class="tile is-child box">
                        <p class="subtitle">Uptime</p>
                        <p class="title" v-if="activeDevice.uptime_since">{{ uptimeSince }}</p>
                        <p class="title" v-else>Unknown</p>
                    </article>
                    <article class="tile is-child box">
                        <p class="subtitle">BIOS Version</p>
                        <p class="title" v-if="activeDevice.latest_report">{{ activeDevice.latest_report.bios_version }}</p>
                        <p class="title" v-else>Unknown</p>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <p class="subtitle">Time for Burn-in</p>
                        <!-- <TimeToBurnin :device-settings="deviceSettings" /> -->
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import moment from 'moment';
import TimeToBurnin from './TimeToBurnin.vue';
import { mapGetters, mapState } from 'vuex';

// TODO: Fix Device Tags and Show Device In Rack button
export default {
    props: {
        deviceSettings: {
            required: false,
        },
    },
    components: {
        TimeToBurnin,
    },
    methods: {
        showDeviceInRack() {

        },
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
        ]),
        ...mapState([
            'activeDevice',
        ]),
        deviceTags() {
            let tags = [];
            let health = this.activeDevice.health.toLowerCase();

            if (health === 'fail') {
                tags.push({
                    state: 'fail',
                    title: 'Failing Validation'
                });
            } else if (health === 'pass') {
                tags.push({
                    state: 'pass',
                    title: 'Passing Validation'
                });
            } else if (health === 'unknown') {
                tags.push({
                    state: 'unknown',
                    title: 'No Report'
                });
            }

            // if (this.deviceSettings.firmware === 'updating') {
            //     tags.push({
            //         state: 'updating',
            //         title: 'Firmware Updating'
            //     });
            // }

            if (this.activeDevice.validated) {
                tags.push({
                    state: 'validated',
                    title: 'Validated'
                });
            } else if (this.activeDevice.graduated) {
                tags.push({
                    state: 'graduated',
                    title: 'Graduated'
                });
            } else if (this.activeDevice.triton_setup) {
                tags.push({
                    state: 'tritonSetup',
                    title: 'Triton Setup'
                });
            }

            return tags;
        },
        lastSeen() {
            return moment(this.activeDevice.last_seen).fromNow();
        },
        uptimeSince() {
            return moment(this.activeDevice.uptime_since).fromNow(true);
        },
    },
};
</script>
