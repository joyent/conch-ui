<template>
    <div class="device-inspector">
        <section class="section" v-if="activeDevice === null && deviceSettings === null">
            <Spinner/>
        </section>
        <Tabs
            :active-device="activeDevice"
            :active-device-id="activeDeviceId"
            :device-settings="deviceSettings"
        />
    </div>
</template>

<script>
import Spinner from '../components/Spinner.vue';
import Tabs from './Tabs.vue';
import { getDeviceDetails, getDeviceSettings } from './api.js';

export default {
    props: {
        activeDeviceId: {
            required: true,
        },
    },
    components: {
        Spinner,
        Tabs,
    },
    data() {
        return {
            activeDevice: null,
            deviceSettings: null,
        };
    },
    created() {
        activeDeviceId.map(deviceId => {
            if (deviceId === null) {
                return;
            }

            this.activeDevice = getDeviceDetails();
            this.deviceSettings = getDeviceSettings();
        });
    },
};
</script>
