<template>
    <div class="overview-tab">
        <div class="columns">
            <div class="column">
                <div class="box">
                    <div class="total-build-progress">
                        <div class="box-header">
                            <i class="material-icons">cloud_done</i>
                            <p class="heading is-size-6">
                                Overall Build Progress
                            </p>
                        </div>
                        <div class="progress-overall">
                            <progress
                                class="progress is-success"
                                :value="80"
                                max="100"
                            ></progress>
                            <span class="amount is-size-5">80%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <div class="box build-dates">
                    <div class="box-header">
                        <i class="material-icons">schedule</i>
                        <div class="dates">
                            <div class="start-date">
                                <p class="heading is-size-6">Start Date</p>
                                <p>22/09/2019</p>
                            </div>
                            <div class="sign-off-date">
                                <p class="heading is-size-6">Sign Off Date</p>
                                <p>10/12/2019</p>
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
                            <p>10/12/2019 | Michael Scott</p>
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
                            <div class="column">
                                <a
                                    class="filter-devices-phase-integration"
                                    @click="filterDevicesByPhase('integration')"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Integration</h2>
                                        <span class="is-size-3 has-text-info">
                                            {{
                                                getDeviceHealthCount(
                                                    'integration'
                                                )
                                            }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                            <div class="column">
                                <a
                                    class="filter-devices-phase-installation"
                                    @click="
                                        filterDevicesByPhase('installation')
                                    "
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Installation</h2>
                                        <span class="is-size-3 has-text-info">
                                            {{
                                                getDeviceHealthCount(
                                                    'installation'
                                                )
                                            }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                            <div class="column">
                                <a
                                    class="filter-devices-phase-production"
                                    @click="filterDevicesByPhase('production')"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Production</h2>
                                        <span class="is-size-3 has-text-info">
                                            {{
                                                getDeviceHealthCount(
                                                    'production'
                                                )
                                            }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                            <div class="column">
                                <a
                                    class="filter-devices-phase-diagnostics"
                                    @click="filterDevicesByPhase('diagnostics')"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Diagnostics</h2>
                                        <span class="is-size-3 has-text-info">
                                            {{
                                                getDeviceHealthCount(
                                                    'diagnostics'
                                                )
                                            }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                            <div class="column">
                                <a
                                    class="filter-devices-phase-decommissioned"
                                    @click="
                                        filterDevicesByPhase('decommissioned')
                                    "
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Decommissioned</h2>
                                        <span class="is-size-3 has-text-info">
                                            {{
                                                getDevicePhaseCount(
                                                    'decommissioned'
                                                )
                                            }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <p class="subtitle is-4">Health</p>
                        <div class="columns">
                            <div class="column">
                                <a
                                    class="filter-devices-health-pass"
                                    @click="filterDevicesByHealth('pass')"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Pass</h2>
                                        <span
                                            class="is-size-3 has-text-success"
                                        >
                                            {{ getDeviceHealthCount('pass') }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                            <div class="column">
                                <a
                                    class="filter-devices-health-unknown"
                                    @click="filterDevicesByHealth('unknown')"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Unknown</h2>
                                        <span
                                            class="is-size-3 has-text-warning"
                                        >
                                            {{
                                                getDeviceHealthCount('unknown')
                                            }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                            <div class="column">
                                <a
                                    class="filter-devices-health-error"
                                    @click="filterDevicesByHealth('error')"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Error</h2>
                                        <span class="is-size-3 has-text-danger">
                                            {{ getDeviceHealthCount('error') }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                            <div class="column">
                                <a
                                    class="filter-devices-health-fail"
                                    @click="filterDevicesByHealth('fail')"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Fail</h2>
                                        <span class="is-size-3 has-text-danger">
                                            {{ getDeviceHealthCount('fail') }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <a
                        class="button is-fullwidth is-medium all"
                        @click="changeTab('DevicesTab')"
                    >
                        <span class="heading is-marginless is-size-6">
                            All Devices
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
                            <div class="column">
                                <a
                                    class="filter-racks-phase-integration"
                                    @click="filterRackByPhase('integration')"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Integration</h2>
                                        <span class="is-size-3 has-text-info">
                                            {{
                                                getRackPhaseCount('integration')
                                            }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                            <div class="column">
                                <a
                                    class="filter-racks-phase-installation"
                                    @click="filterRackByPhase('installation')"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Installation</h2>
                                        <span class="is-size-3 has-text-info">
                                            {{
                                                getRackPhaseCount(
                                                    'installation'
                                                )
                                            }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                            <div class="column">
                                <a
                                    class="filter-racks-phase-production"
                                    @click="filterRackByPhase('production')"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Production</h2>
                                        <span class="is-size-3 has-text-info">
                                            {{
                                                getRackPhaseCount('production')
                                            }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                            <div class="column">
                                <a
                                    class="filter-racks-phase-diagnostics"
                                    @click="filterRackByPhase('diagnostics')"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Diagnostics</h2>
                                        <span class="is-size-3 has-text-info">
                                            {{
                                                getRackPhaseCount('diagnostics')
                                            }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                            <div class="column">
                                <a
                                    class="filter-racks-phase-decommissioned"
                                    @click="filterRackByPhase('decommissioned')"
                                >
                                    <div class="box filter">
                                        <h2 class="is-6">Decommissioned</h2>
                                        <span class="is-size-3 has-text-info">
                                            {{
                                                getRackPhaseCount(
                                                    'decommissioned'
                                                )
                                            }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <a
                        class="button is-fullwidth is-medium all"
                        @click="changeTab('RacksTab')"
                    >
                        <span class="heading is-marginless is-size-6">
                            All Racks
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

export default {
    props: {
        build: {
            type: Object,
            required: true,
        },
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
            return moment(date).format('MM/DD/YYYY');
        },
        getDeviceHealthCount(health) {
            if (this.build && this.build.devices && this.build.devices.length) {
                return this.build.devices.filter(device => {
                    device.health === health;
                }).length;
            }

            return 0;
        },
        getDevicePhaseCount(phase) {
            if (this.build && this.build.devices && this.build.devices.length) {
                return this.build.devices.filter(device => {
                    device.phase === phase;
                }).length;
            }

            return 0;
        },
        getRackPhaseCount(phase) {
            if (this.build && this.build.racks && this.build.racks.length) {
                return this.build.racks.filter(rack => {
                    rack.phase === phase;
                }).length;
            }

            return 0;
        },
    },
};
</script>
