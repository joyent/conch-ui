<template>
    <div class="overview-tab">
        <div class="level">
            <div class="level-left">
                <div class="level-item tags">{{ deviceTags }}</div>
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
                        <p class="title" v-if="this.activeDevice.latest_report.bios_version">{{ this.activeDevice.latest_report.bios_version }}</p>
                        <p class="title" v-else>Unknown</p>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <p class="subtitle">Time for Burn-in</p>
                        <TimeToBurnin :active-device="activeDevice" :device-settings="deviceSettings" />
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import moment from 'moment';
import TimeToBurnin from './TimeToBurnin.vue';

export default {
    props: {
        activeDevice: {
            required: true,
        },
        activeDeviceId: {
            required: true,
        },
        deviceSettings: {
            required: true,
        },
    },
    components: {
        TimeToBurnin,
    },
    data() {
        return {
            deviceTags: [],
        };
    },
    methods: {
        showDeviceInRack() {

        },
    },
    computed: {
        lastSeen() {
            return moment(this.activeDevice.last_seen).fromNow();
        },
        uptimeSince() {
            return moment(this.activeDevice.uptime_since).fromNow(true);
        },
    },
    created: {
        // TODO: Need to implement deviceTags
    }
};
</script>
