<template>
    <div class="time-to-burnin">
        <Spinner v-if="activeDeviceSettings == undefined" />
        <p class="is-size-4" v-else-if="activeDeviceDetails.last_seen == null">Device has not reported</p>
        <p class="is-size-4" v-else-if="activeDeviceSettings.firmware !== 'current'">Burn-in not started</p>
        <div v-else-if="failing">
            <RadialProgress :percentage="Math.trunc(rebootCount / numReboots * 100)" :stroke-width="'20px'" :failing="true" />
            <span class="subtitle">
                <p>Failing validation</p>
                <p>{{ rebootCount }} of {{ numReboots }} reboots complete</p>
            </span>
        </div>
        <div v-else>
            <RadialProgress :percentage="percentage" :stroke-width="'20px'" :failing="failing" />
            <p class="subtitle" v-if="percentage === 100">Burn-in Complete</p>
            <p class="subtitle" v-else>
                <span v-if="time < 0" v-html="'Should have finished'"></span>
                {{ timeToBurnin }}
            </p>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import RadialProgress from '@views/components/RadialProgress.vue';
import Spinner from '@views/components/RadialProgress.vue';
import { mapState } from 'vuex';

export default {
    components: {
        RadialProgress,
        Spinner,
    },
    data() {
        return {
            numReboots: 3,
            maxBurnin: 21600,
        };
    },
    computed: {
        ...mapState([
            'activeDeviceDetails',
            'activeDeviceSettings',
        ]),
        burninStageTime() {
            return this.maxBurnin / this.numReboots;
        },
        failing() {
            if (this.health.toLowerCase() === 'fail') {
                return true;
            }

            return false;
        },
        timeToBurnin() {
            return moment.duration(this.time, 'seconds').humanize(true);
        },
        sinceLastReboot() {
            return this.uptimeSince ? moment().diff(moment(this.uptimeSince), 'seconds') : moment().diff(moment(this.activeDeviceDetails.last_seen), 'seconds');
        },
        percentage() {
            const rebootCount = Number(this.rebootCount);

            if (rebootCount === this.numReboots) {
                return 100;
            } else if (this.time < 0) {
                return Math.trunc(rebootCount / this.numReboots * 100);
            }

            return Math.trunc((this.maxBurnin - this.time) / this.time * 100);
        },
        time() {
            return this.maxBurnin - (this.rebootCount * this.burninStageTime + this.sinceLastReboot);
        },
        rebootCount() {
            let deviceSettings = this.activeDeviceSettings;

            if (deviceSettings && deviceSettings['build.reboot_count']) {
                return deviceSettings['build.reboot_count'];
            }

            return 0;
        },
        uptimeSince() {
            return this.activeDeviceDetails.uptime_since;
        },
        health() {
            return this.activeDeviceDetails.health;
        },
    },
};
</script>
