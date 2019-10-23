<template>
    <div class="dashboard">
        <SingleBuild :build-id="buildId" />
    </div>
</template>

<script>
import SingleBuild from '@src/views/Builds/SingleBuild.vue';

export default {
    components: {
        SingleBuild,
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
