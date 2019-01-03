<template>
    <div class="device-inspector">
        <section class="section" v-if="activeDevice == null && deviceSettings == null">
            <Spinner/>
        </section>
        <Tabs :device-settings="deviceSettings" />
    </div>
</template>

<script>
import Spinner from '../components/Spinner.vue';
import Tabs from './Tabs.vue';
import { getDeviceDetails, getDeviceSettings } from './api.js';
import { mapGetters, mapState } from 'vuex';

export default {
    components: {
        Spinner,
        Tabs,
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
        ]),
        ...mapState([
            'activeDevice',
        ]),
        deviceSettings() {
            if(this.activeDeviceId) {
                return getDeviceSettings(this.activeDeviceId);
            }
        },
    },
};
</script>
