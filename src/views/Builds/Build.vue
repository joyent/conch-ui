<template>
    <div class="build">
        <transition name="fade">
            <article class="message is-success" v-if="buildUpdated">
                <div class="message-header">
                    <i class="material-icons">check_circle</i>
                    <p>Build {{ action }}</p>
                </div>
            </article>
        </transition>
        <div class="build-header">
            <p class="build-name title has-text-white">
                {{ currentBuild.name }}
            </p>
            <div class="field is-grouped">
                <p class="control" v-if="!currentBuild.started">
                    <a class="button is-success" @click="updateBuild('start')">
                        Start Build
                    </a>
                </p>
                <p
                    class="control"
                    v-if="currentBuild.started && !currentBuild.completed"
                >
                    <a
                        class="button is-success"
                        :class="{
                            'tooltip is-tooltip-left is-tooltip-info': !isBuildCompletable,
                        }"
                        @click="updateBuild('complete')"
                        :data-tooltip="
                            `${
                                isBuildCompletable
                                    ? ''
                                    : 'Cannot complete a build with unhealthy devices'
                            }`
                        "
                    >
                        Complete Build
                    </a>
                </p>
            </div>
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
                        :class="`tab is-uppercase ${tab.class}`"
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
            action: '',
            buildUpdated: false,
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
                    class: 'racks-tab',
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

            if (!this.organizations.length) {
                getOrganizations().then(response => {
                    this.setOrganizations(response.data);
                });
            }
        },
        updateBuild(action) {
            const buildId = this.currentBuild.id;
            const now = new Date();
            let data;

            if (!this.isBuildCompletable) {
                return;
            }

            if (action === 'complete') {
                this.action = 'completed';
                data = { completed: now };
            } else if (action === 'start') {
                this.action = 'started';
                data = { started: now };
            }

            Builds.updateBuild(buildId, data).then(() => {
                this.buildUpdated = true;

                this.getBuildData(buildId);

                setTimeout(() => {
                    this.buildUpdated = false;
                }, 3000);
            });
        },
    },
    watch: {
        buildId: {
            immediate: true,
            handler(buildId) {
                if (!buildId) {
                    if (this.$route.params && this.$route.params.buildId) {
                        buildId = this.$route.params.buildId;
                    }
                }

                localStorage.setItem('mostRecentBuildId', buildId);
                this.getBuildData(buildId);
            },
        },
    },
    computed: {
        ...mapState([
            'currentBuild',
            'currentBuildDevices',
            'currentWorkspace',
            'devices',
            'organizations',
            'racks',
            'users',
        ]),
        isBuildCompletable() {
            if (this.currentBuildDevices.length) {
                const healthyDevicesCount = this.currentBuildDevices.filter(
                    device => device.health === 'pass'
                ).length;

                if (healthyDevicesCount === this.currentBuildDevices.length) {
                    return true;
                }
            }

            return false;
        },
    },
    created() {
        this.preFetchData();
    },
};
</script>
