<template>
    <div class="settings-tab">
        <p class="has-text-centered" v-if="isEmpty(this.activeDeviceSettings)">
            No settings details available.
        </p>
        <table class="table is-narrow is-fullwidth" v-else>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(value, key, index) in activeDeviceSettings" :key="index">
                    <td class="has-text-weight-semibold">{{ key }}</td>
                    <td>{{ value }}</td>
                </tr>
            </tbody>
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
    methods: {
        isEmpty,
    },
    computed: {
        ...mapState([
            'activeDeviceSettings',
        ]),
    },
};
</script>
