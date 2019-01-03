<template>
    <div class="report-tab">
        <div class="content has-text-left">
            <pre>{{ latestReport }}</pre>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState([
            'activeDevice',
        ]),
        latestReport() {
            return JSON.stringify(this.activeDevice.latest_report || {}, null, '  ');
        },
    },
};
</script>
