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

const numReboots = 3;
const maxBurnin = 21600;
const burninStageTime = maxBurnin / numReboots;

export default {
    props: {
        activeDevice: {
            required: true,
        },
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
        timeToBurnin() {
            return moment.duration(time, 'seconds').humanize(true);
        },
        sinceLastReboot() {
            return uptimeSince ? moment().diff(moment(uptimeSince), 'seconds') : moment().diff(moment(lastSeen), 'seconds');
        },
        percentage() {
            if (rebootCount === numReboots) {
                return 100;
            } else if (time < 0) {
                return Math.trunc(rebootCount / numReboots * 100);
            }

            return Math.trunc((maxBurnin - time) / time * 100);
        },
        time() {
            return maxBurnin - (rebootCount * burninStageTime + sinceLastReboot);
        },
        // Can these simply be data?
        rebootCount() {
            return deviceSettings.build.reboot_count || 0;
        },
        uptimeSince() {
            return activeDevice.uptime_since;
        },
        health() {
            return activeDevice.health;
        },
        lastSeen() {
            return activeDevice.last_seen;
        }
    },
};
</script>
