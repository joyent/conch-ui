<template>
    <div class="dashboard">
        <Build :build-id="buildId" v-if="showRecentBuild" />
        <div class="empty-state" v-else-if="noRecentBuild">
            <img src="../../assets/data-points.svg" width="500" />
            <p class="empty-state-heading">No recent builds to display.</p>
        </div>
        <Spinner v-else />
    </div>
</template>

<script>
import Build from '@src/views/Builds/Build.vue';
import Spinner from '@src/views/components/Spinner.vue';
import { getBuilds } from '@api/builds.js';

export default {
    components: {
        Build,
        Spinner,
    },
    data() {
        return {
            buildId: '',
            noRecentBuild: false,
            showRecentBuild: false,
        };
    },
    created() {
        this.buildId = localStorage.getItem('mostRecentBuildId');

        if (this.buildId) {
            getBuilds().then(response => {
                const builds = response.data;
                const build = builds.find(build => this.buildId === build.id);

                if (build) {
                    this.showRecentBuild = true;
                } else {
                    this.noRecentBuild = true;
                }
            });
        } else {
            this.noRecentBuild = true;
        }
    },
};
</script>
