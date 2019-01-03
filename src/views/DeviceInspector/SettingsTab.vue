<template>
    <div class="settings-tab">
        <Spinner v-if="!hasDeviceSettings" />
        <table class="table is-narrow is-fullwidth" v-else>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tr v-for="(value, key, index) in sortedDeviceSettings" :key="index">
                <td class="has-text-weight-semibold">{{ value }}</td>
                <td>{{ key }}</td>
            </tr>
            <tfoot>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
import Spinner from '../components/Spinner.vue';
import isEmpty from 'lodash/isEmpty';

export default {
    props: {
        deviceSettings: {
            required: true,
        },
    },
    components: {
        Spinner,
    },
    computed: {
        hasDeviceSettings() {
            return !isEmpty(this.deviceSettings);
        },
        sortedDeviceSettings() {
            return Object.entries(this.deviceSettings).sort();
        },
    },
};
</script>
