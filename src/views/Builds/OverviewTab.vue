<template>
    <div class="overview-tab">
        <div class="columns">
            <div class="column">
                <div class="box build-dates">
                    <div class="box-header">
                        <i class="material-icons">schedule</i>
                        <div class="dates">
                            <div class="start-date">
                                <p class="heading is-size-6">Started</p>
                                <p v-if="currentBuild.started">
                                    {{ getDate(currentBuild.started) }}
                                </p>
                                <p v-else>Not Started</p>
                            </div>
                            <div class="sign-off-date">
                                <p class="heading is-size-6">Completed</p>
                                <p v-if="currentBuild.completed">
                                    {{ getDate(currentBuild.completed) }}
                                </p>
                                <p v-else>Not Completed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="box sign-off">
                    <div class="box-header">
                        <i class="material-icons">gesture</i>
                        <div class="sign-off-details">
                            <p class="heading is-size-6">Sign Off Details</p>
                            <p v-if="currentBuild.completed">
                                {{ getDate(currentBuild.completed) }} |
                                {{ currentBuild.completed_user.name }}
                            </p>
                            <p v-else>Build Not Complete</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <div class="box is-paddingless">
                    <div class="build-devices">
                        <div class="box-header">
                            <i class="material-icons">dns</i>
                            <p class="heading is-size-6">Devices Overview</p>
                        </div>
                        <p class="subtitle is-4">Phase</p>
                        <div class="columns">
                            <div
                                class="column"
                                v-for="phase in phaseList"
                                :key="phase"
                            >
                                <a
                                    :class="`filter-devices-phase-${phase}`"
                                    @click="filterDevicesByPhase(phase)"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6 is-capitalized">
                                            {{ phase }}
                                        </h2>
                                        <span class="is-size-3 has-text-info">
                                            {{ getDevicePhaseCount(phase) }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <p class="subtitle is-4">Health</p>
                        <div class="columns">
                            <div
                                class="column"
                                v-for="status in healthStatusList"
                                :key="status"
                            >
                                <a
                                    :class="`filter-devices-health-${status}`"
                                    @click="filterDevicesByHealth(status)"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6 is-capitalized">
                                            {{ status }}
                                        </h2>
                                        <span
                                            class="is-size-3"
                                            :class="{
                                                'has-text-success':
                                                    status === 'pass',
                                                'has-text-warning':
                                                    status === 'unknown',
                                                'has-text-danger':
                                                    status === 'error' ||
                                                    status === 'fail',
                                            }"
                                        >
                                            {{ getDeviceHealthCount(status) }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <a
                        class="button is-fullwidth is-medium view-all"
                        @click="changeTab('DevicesTab')"
                    >
                        <span class="heading is-marginless is-size-6">
                            View All Devices
                        </span>
                        <i class="material-icons view-all">arrow_forward</i>
                    </a>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <div class="box is-paddingless">
                    <div class="rack-devices">
                        <div class="box-header">
                            <i class="material-icons">storage</i>
                            <p class="heading is-size-6">Racks Overview</p>
                        </div>
                        <p class="subtitle is-4">Phase</p>
                        <div class="columns">
                            <div
                                class="column"
                                v-for="phase in phaseList"
                                :key="phase"
                            >
                                <a
                                    :class="`filter-racks-phase-${phase}`"
                                    @click="filterRackByPhase(phase)"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6 is-capitalized">
                                            {{ phase }}
                                        </h2>
                                        <span class="is-size-3 has-text-info">
                                            {{ getRackPhaseCount(phase) }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <a
                        class="button is-fullwidth is-medium view-all"
                        @click="changeTab('RacksTab')"
                    >
                        <span class="heading is-marginless is-size-6">
                            View All Racks
                        </span>
                        <i class="material-icons view-all">arrow_forward</i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { EventBus } from '@src/eventBus.js';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            healthStatusList: ['pass', 'fail', 'error', 'unknown'],
            phaseList: [
                'integration',
                'installation',
                'production',
                'diagnostics',
                'decommissioned',
            ],
        };
    },
    methods: {
        changeTab(tab) {
            this.$parent.changeTab(tab);
        },
        filterDevicesByHealth(health) {
            this.$parent.changeTab('DevicesTab');

            EventBus.$emit('setDeviceTabHealthFilter', health);
        },
        filterDevicesByPhase(phase) {
            this.$parent.changeTab('DevicesTab');

            EventBus.$emit('setDeviceTabPhaseFilter', phase);
        },
        filterRackByPhase(phase) {
            this.$parent.changeTab('RacksTab');

            EventBus.$emit('setRackTabPhaseFilter', phase);
        },
        getDate(date) {
            return moment(date).format('YYYY/MM/DD');
        },
        getDeviceHealthCount(health) {
            if (!this.currentBuildDevices.length) {
                return 0;
            }

            return this.currentBuildDevices.filter(device => {
                if (device.health === health) {
                    return device;
                }
            }).length;
        },
        getDevicePhaseCount(phase) {
            if (!this.currentBuildDevices.length) {
                return 0;
            }

            return this.currentBuildDevices.filter(device => {
                if (device.phase === phase.toLowerCase()) {
                    return device;
                }
            }).length;
        },
        getRackPhaseCount(phase) {
            if (!this.currentBuildRacks.length) {
                return 0;
            }

            return this.currentBuildRacks.filter(rack => {
                if (rack.phase === phase.toLowerCase()) {
                    return rack;
                }
            }).length;
        },
    },
    computed: {
        ...mapState([
            'currentBuild',
            'currentBuildDevices',
            'currentBuildRacks',
        ]),
    },
};
</script>
