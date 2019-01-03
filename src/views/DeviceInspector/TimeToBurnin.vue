<template>
    <div class="time-to-burnin">
        <Spinner v-if="deviceSettings == null" />
        <p class="is-size-4" v-else-if="activeDevice.last_seen == null">Device has not reported</p>
        <p class="is-size-4" v-else-if="deviceSettings.firmware !== 'current'">Burn-in not started</p>
        <div class="failing-health" v-else-if="health.toLowerCase() === 'fail'">
            <RadialProgress :percentage="Math.trunc(rebootCount / numReboots * 100)" :stroke-width="'20px'" :failing="true" />
            <p class="subtitle">
                <span>Failing validation</span>
                <span>{{ rebootCount }} of {{ numReboots }} reboots complete</span>
            </p>
        </div>
        <div class="final-result">
            <RadialProgress :percentage="percentage" :stroke-width="'20px'" />
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
import RadialProgress from '../components/RadialProgress.vue';
import Spinner from '../components/RadialProgress.vue';
import { mapState } from 'vuex';

const numReboots = 3;
const maxBurnin = 21600;
const burninStageTime = maxBurnin / numReboots;

export default {
    props: {
        deviceSettings: {
            required: true,
        },
    },
    components: {
        RadialProgress,
        Spinner,
    },
    data() {
        return {
        };
    },
    computed: {
        ...mapState([
            'activeDevice',
        ]),
        timeToBurnin() {
            return moment.duration(time, 'seconds').humanize(true);
        },
        sinceLastReboot() {
            return this.uptimeSince ? moment().diff(moment(this.uptimeSince), 'seconds') : moment().diff(moment(this.lastSeen), 'seconds');
        },
        percentage() {
            if (this.rebootCount === numReboots) {
                return 100;
            } else if (this.time < 0) {
                return Math.trunc(this.rebootCount / numReboots * 100);
            }

            return Math.trunc((maxBurnin - this.time) / this.time * 100);
        },
        time() {
            return maxBurnin - (this.rebootCount * burninStageTime + this.sinceLastReboot);
        },
        rebootCount() {
            return this.deviceSettings.build.reboot_count || 0;
        },
        uptimeSince() {
            return this.activeDevice.uptime_since;
        },
        health() {
            return this.activeDevice.health;
        },
        lastSeen() {
            return this.activeDevice.last_seen;
        }
    },
};
</script>
