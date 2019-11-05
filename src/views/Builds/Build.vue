<template>
    <div class="build">
        <div class="build-header">
            <p class="build-name title has-text-white">
                {{ currentBuild.name }}
            </p>
            <span
                class="tag build-status"
                :class="{
                    'is-success': buildStatus === 'completed',
                    'is-info': buildStatus === 'started',
                    'is-link': buildStatus === 'created',
                }"
                style="border-radius: 3px"
            >
                {{ buildStatus }}
            </span>
        </div>
        <p class="build-id has-text-grey">Build ID: {{ currentBuild.id }}</p>
        <div class="tabs is-toggle">
            <ul>
                <li
                    :class="{ 'is-active': currentTab === tab.component }"
                    v-for="tab in tabs"
                    :key="tab.name"
                >
                    <a
                        :class="`tab is-uppercase ${tab.classname}`"
                        @click="changeTab(tab.component)"
                    >
                        {{ tab.name }}
                    </a>
                </li>
            </ul>
        </div>
        <OverviewTab
            :build="currentBuild"
            v-if="currentTab === 'OverviewTab'"
        />
        <OrganizationsTab
            :build="currentBuild"
            v-if="currentTab === 'OrganizationsTab'"
        />
        <MembersTab :build="currentBuild" v-if="currentTab === 'MembersTab'" />
        <RacksTab :build="currentBuild" v-if="currentTab === 'RacksTab'" />
        <DevicesTab :build="currentBuild" v-if="currentTab === 'DevicesTab'" />
    </div>
</template>

<script>
import DevicesTab from './DevicesTab.vue';
import OverviewTab from './OverviewTab.vue';
import RacksTab from './RacksTab.vue';
import MembersTab from './MembersTab.vue';
import OrganizationsTab from './OrganizationsTab.vue';
import { mapActions, mapState } from 'vuex';
import * as Builds from '@api/builds.js';

export default {
    components: {
        DevicesTab,
        MembersTab,
        OrganizationsTab,
        OverviewTab,
        RacksTab,
    },
    props: {
        buildId: {
            type: String,
            required: false,
            default: '',
        },
    },
    data() {
        return {
            currentTab: 'OverviewTab',
            tabs: [
                {
                    class: 'overview-tab',
                    component: 'OverviewTab',
                    name: 'Overview',
                },
                {
                    class: 'members-tab',
                    component: 'MembersTab',
                    name: 'Members',
                },
                {
                    class: 'organizations-tab',
                    component: 'OrganizationsTab',
                    name: 'Organizations',
                },
                {
                    class: 'racls-tab',
                    component: 'RacksTab',
                    name: 'Racks',
                },
                {
                    class: 'devices-tab',
                    component: 'DevicesTab',
                    name: 'Devices',
                },
            ]
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
        getBuildData(buildId = null) {
            if (!buildId) {
                buildId = this.currentBuild.id;
            }

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
        buildStatus() {
            const build = this.currentBuild;

            if (build.completed) {
                return 'completed';
            } else if (build.started) {
                return 'started';
            }

            return 'created';
        },
    },
    created() {
        let buildId;

        if (this.buildId) {
            this.getBuildData(this.buildId);

            buildId = this.buildId;
        } else {
            if (
                this.$route &&
                this.$route.params &&
                this.$route.params.buildId
            ) {
                this.getBuildData(this.$route.params.buildId);

                buildId = this.$route.params.buildId;
            }
        }

        localStorage.setItem('mostRecentBuildId', buildId);
    },
};
</script>