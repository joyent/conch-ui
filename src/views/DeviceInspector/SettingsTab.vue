<template>
    <div class="settings-tab">
        <p class="has-text-centered" v-if="!hasActiveDeviceSettings">No settings available.</p>
        <table class="table is-narrow is-fullwidth" v-else>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tr v-for="(value, key, index) in activeDeviceSettings" :key="index">
                <td class="has-text-weight-semibold">{{ key }}</td>
                <td>{{ value }}</td>
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
import isEmpty from 'lodash/isEmpty';
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState([
            'activeDeviceSettings',
        ]),
        hasActiveDeviceSettings() {
            return !isEmpty(this.activeDeviceSettings);
        },
    },
};
</script>
