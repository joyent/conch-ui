<template>
    <div class="dashboard">
        <Build :build-id="buildId" />
    </div>
</template>

<script>
import Build from '@src/views/Builds/Build.vue';

export default {
    components: {
        Build,
    },
    data() {
        return {
            buildId: '',
        };
    },
    created() {
        this.buildId = localStorage.getItem('mostRecentBuildId');
    },
};
</script>
