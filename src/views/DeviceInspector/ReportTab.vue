<template>
    <div class="report-tab">
        <div class="content has-text-left">
            <pre>{{ latestReport }}</pre>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        activeDevice: {
            required: true,
        },
    },
    computed: {
        latestReport() {
            return JSON.stringify(activeDevice.latest_report || {}, null, '  ');
        },
    },
};
</script>
