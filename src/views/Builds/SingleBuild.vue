<template>
    <div class="build">
        <div class="build-page">
            <div class="build-header">
                <p class="build-name title has-text-white">
                    {{ currentBuild.name }}
                </p>
                <span
                    class="tag build-status"
                    :class="{
                        'is-success': currentBuild.status === 'complete',
                        'is-info': currentBuild.status === 'active',
                    }"
                    style="border-radius: 4px"
                >
                    {{ currentBuild.status }}
                </span>
            </div>
            <p class="build-id has-text-grey">
                Build ID: {{ currentBuild.id }}
            </p>
            <div class="tabs is-toggle">
                <ul>
                    <li :class="{ 'is-active': currentTab === 'OverviewTab' }">
                        <a
                            class="tab overview-tab is-uppercase"
                            @click="changeTab('OverviewTab')"
                        >
                            Overview
                        </a>
                    </li>
                    <li :class="{ 'is-active': currentTab === 'DevicesTab' }">
                        <a
                            class="tab devices-tab is-uppercase"
                            @click="changeTab('DevicesTab')"
                        >
                            Devices
                        </a>
                    </li>
                    <li :class="{ 'is-active': currentTab === 'RacksTab' }">
                        <a
                            class="tab racks-tab is-uppercase"
                            @click="changeTab('RacksTab')"
                        >
                            Racks
                        </a>
                    </li>
                    <li :class="{ 'is-active': currentTab === 'MembersTab' }">
                        <a
                            class="tab users-tab is-uppercase"
                            @click="changeTab('MembersTab')"
                        >
                            Members
                        </a>
                    </li>
                </ul>
            </div>
            <component :is="currentTab" :build="currentBuild"></component>
        </div>
    </div>
</template>

<script>
import DevicesTab from './DevicesTab.vue';
import OverviewTab from './OverviewTab.vue';
import RacksTab from './RacksTab.vue';
import MembersTab from './MembersTab.vue';
import { mapActions, mapState } from 'vuex';
import * as Builds from '@api/builds.js';

export default {
    components: {
        DevicesTab,
        OverviewTab,
        RacksTab,
        MembersTab,
    },
    data() {
        return {
            currentTab: 'OverviewTab',
        };
    },
    methods: {
        ...mapActions([
            'setCurrentBuild',
            'setCurrentBuildDevices',
            'setCurrentBuildRacks',
            'setCurrentBuildUsers',
        ]),
        changeTab(tab) {
            this.currentTab = tab;
        },
        getBuildData(buildId) {
            Builds.getBuild(buildId).then(response => {
                this.setCurrentBuild(response.data);
            });

            Builds.getBuildDevices(buildId).then(response => {
                this.setCurrentBuildDevices(response.data);
            });

            Builds.getBuildRacks(buildId).then(response => {
                this.setCurrentBuildRacks(response.data);
            });

            Builds.getBuildUsers(buildId).then(response => {
                this.setCurrentBuildUsers(response.data);
            });
        },
    },
    computed: {
        ...mapState(['currentBuild']),
    },
    created() {
        this.getBuildData(this.$route.params.buildId);
    },
};
</script>
