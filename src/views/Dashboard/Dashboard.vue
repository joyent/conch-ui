<template>
    <div class="dashboard">
        <Build :build-id="buildId" v-if="buildId" />
        <div class="empty-state" v-else>
            <img src="../../assets/data-points.svg" width="500" />
            <p class="empty-state-heading">No Recent Builds to Display</p>
        </div>
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
