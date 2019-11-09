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
        <OverviewTab v-if="currentTab === 'OverviewTab'" />
        <OrganizationsTab
            :build-id="currentBuild.id"
            v-if="currentTab === 'OrganizationsTab'"
        />
        <MembersTab
            :build-id="currentBuild.id"
            v-if="currentTab === 'MembersTab'"
        />
        <RacksTab
            :build-id="currentBuild.id"
            v-if="currentTab === 'RacksTab'"
        />
        <DevicesTab
            :build-id="currentBuild.id"
            v-if="currentTab === 'DevicesTab'"
        />
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
import { getDevices } from '@api/workspaces.js';
import { getRacks } from '@api/racks.js';
import { getOrganizations } from '@api/organizations.js';
import { getUsers } from '@api/users.js';

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
            ],
        };
    },
    methods: {
        ...mapActions([
            'setCurrentBuild',
            'setCurrentBuildDevices',
            'setCurrentBuildOrganizations',
            'setCurrentBuildRacks',
            'setCurrentBuildUsers',
            'setDevices',
            'setOrganizations',
            'setRacks',
            'setUsers',
        ]),
        changeTab(tab) {
            this.currentTab = tab;
        },
        getBuildData(buildId) {
            Builds.getBuild(buildId).then(response => {
                this.setCurrentBuild(response.data);
            });

            Builds.getBuildOrganizations(buildId).then(response => {
                this.setCurrentBuildOrganizations(response.data);
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
        preFetchData() {
            if (!this.users.length) {
                getUsers().then(response => {
                    this.setUsers(response.data);
                });
            }

            if (!this.devices.length) {
                getDevices(this.currentWorkspace.id).then(response => {
                    this.setDevices(response.data);
                });
            }

            if (!this.racks.length) {
                getRacks().then(response => {
                    this.setRacks(response.data);
                });
            }

            if (!this.organizations.length) {
                getOrganizations().then(response => {
                    this.setOrganizations(response.data);
                });
            }
        },
    },
    computed: {
        ...mapState([
            'currentBuild',
            'currentWorkspace',
            'devices',
            'organizations',
            'racks',
            'users',
        ]),
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
        let buildId = this.buildId;

        if (!buildId) {
            buildId = this.currentBuild.id;
        }

        if (!buildId) {
            if (
                this.$route &&
                this.$route.params &&
                this.$route.params.buildId
            ) {
                buildId = this.$route.params.buildId;
            }
        }

        if (buildId) {
            this.getBuildData(buildId);

            localStorage.setItem('mostRecentBuildId', buildId);
        }

        this.preFetchData();
    },
};
</script>
