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
            <router-link
                v-if="$route.name === 'builds'"
                :to="{ name: 'build', params: { id: currentBuild.id } }"
                class="build-name title has-text-white"
                tag="a"
            >
                {{ currentBuild.name }}
            </router-link>
            <p v-else class="build-name title has-text-white">
                {{ currentBuild.name }}
            </p>
            <div class="field is-grouped">
                <p class="control" v-if="!currentBuild.started">
                    <a class="button is-success" @click="updateBuild('start')">
                        Start Build
                    </a>
                </p>
                <p
                    v-if="currentBuild.started && !currentBuild.completed"
                    class="control"
                    :class="{
                        'tooltip is-tooltip-left is-tooltip-info': !isBuildCompletable,
                    }"
                    :data-tooltip="
                        `${
                            isBuildCompletable
                                ? ''
                                : 'Cannot complete a build with unhealthy devices'
                        }`
                    "
                >
                    <a
                        class="button is-success"
                        @click="
                            isBuildCompletable ? updateBuild('complete') : null
                        "
                        :disabled="!isBuildCompletable"
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
        <div
            class="custom-tags"
            v-if="rack && rack.name"
            style="margin-bottom: 15px; margin-top: -10px;"
        >
            <label class="tag-label">Rack</label>
            <div class="tag-value">
                {{ rack.name }}
            </div>
            <a
                class="button is-text"
                style="margin-left: 5px"
                @click="clearRack()"
                >Clear Rack</a
            >
        </div>
        <OverviewTab v-if="currentTab === 'OverviewTab'" />
        <OrganizationsTab
            :build-id="currentBuild.id"
            v-if="userIsAdmin && currentTab === 'OrganizationsTab'"
        />
        <MembersTab
            :build-id="currentBuild.id"
            v-if="userIsAdmin && currentTab === 'MembersTab'"
        />
        <RacksTab
            :build-id="currentBuild.id"
            v-if="currentTab === 'RacksTab'"
            @rack-selected="selectRack"
        />
        <DevicesTab
            :build-id="currentBuild.id"
            v-if="currentTab === 'DevicesTab'"
            :rack="rack"
        />
    </div>
</template>

<script>
import DevicesTab from './DevicesTab.vue';
import OverviewTab from './OverviewTab.vue';
import RacksTab from './RacksTab.vue';
import MembersTab from './MembersTab.vue';
import OrganizationsTab from './OrganizationsTab.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import * as Builds from '@api/builds.js';
import { getOrganizations } from '@api/organizations.js';

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
            rack: {},
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
        ]),
        changeTab(tab) {
            this.currentTab = tab;

            if (this.currentTab === 'DevicesTab' && tab === 'DevicesTab') {
                this.clearRack();
            }
        },
        clearRack() {
            this.rack = {};
            EventBus.$emit('device-tab-clicked');
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

            if (this.userIsAdmin) {
                Builds.getBuildOrganizations(buildId).then(response => {
                    this.setCurrentBuildOrganizations(response.data);
                });

                Builds.getBuildUsers(buildId).then(response => {
                    this.setCurrentBuildUsers(response.data);
                });
            }
        },
        preFetchData() {
            if (!this.organizations.length) {
                getOrganizations().then(response => {
                    this.setOrganizations(response.data);
                });
            }
        },
        selectRack(data) {
            this.rack = data.rack;
            this.currentTab = 'DevicesTab';
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
                    if (this.$route.params && this.$route.params.id) {
                        buildId = this.$route.params.id;
                    }
                }

                this.currentTab = 'OverviewTab';
                localStorage.setItem('mostRecentBuildId', buildId);
                this.getBuildData(buildId);
            },
        },
        currentTab: {
            immediate: true,
            handler(newTab, lastTab) {
                if (lastTab === 'DevicesTab') {
                    this.rack = {};
                }
            },
        },
    },
    computed: {
        ...mapState([
            'currentBuild',
            'currentBuildDevices',
            'currentUser',
            'devices',
            'organizations',
            'racks',
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
        tabs() {
            const tabs = [
                {
                    class: 'overview-tab',
                    component: 'OverviewTab',
                    name: 'Overview',
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
            ];
            const adminTabs = [
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
            ];

            return this.userIsAdmin ? tabs.concat(adminTabs) : tabs;
        },
        userIsAdmin() {
            const user = this.currentUser;

            if (user && user.is_admin) {
                return true;
            }

            if (user && user.builds && user.builds.length) {
                const build = user.builds.find(
                    build => build.id === this.buildId
                );

                if (build && build.role === 'admin') {
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
