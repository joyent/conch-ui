<template>
    <div class="settings-tab">
        <Spinner v-if="deviceSettings == null" />
        <table class="table is-narrow is-fullwidth">
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
export default {
    props: {
        deviceSettings: {
            required: true,
        },
    },
    computed: {
        sortedDeviceSettings() {
            return Object.entries(deviceSettings).sort();
        }
    }
};
</script>
