<template>
    <div class="settings-tab">
        <table class="table is-narrow is-fullwidth">
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
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState([
            'activeDeviceSettings',
        ]),
    },
};
</script>
