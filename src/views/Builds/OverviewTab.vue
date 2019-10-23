<template>
    <div class="overview-tab">
        <div class="columns">
            <div class="column">
                <div class="box" style="padding: 20px;">
                    <div class="total-build-progress">
                        <div class="box-header">
                            <i class="material-icons" style="font-size: 36px;">
                                cloud_done
                            </i>
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
                            <span class="amount is-size-5">
                                80%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <div class="box build-dates" style="padding: 20px; display: flex;">
                    <div class="box-header" style="margin-bottom: 0; width: 100%;">
                        <i class="material-icons" style="font-size: 42px;">
                            schedule
                        </i>
                        <div class="dates" style="display: flex; flex-grow: 1; justify-content: space-around; text-align: center;">
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
                <div class="box sign-off" style="padding: 20px; display: flex;">
                    <div class="box-header">
                        <i class="material-icons" style="font-size: 42px;">
                            gesture
                        </i>
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
                <div class="box">
                    <div class="build-devices">
                        <div class="box-header">
                            <i class="material-icons" style="font-size: 36px;">
                                storage
                            </i>
                            <p class="heading is-size-6">Devices Overview</p>
                        </div>
                        <p class="subtitle is-4">Phase</p>
                        <div class="columns">
                            <div class="column">
                                <div
                                    class="box"
                                    style="padding: 20px; background-color: #1f2d3b"
                                >
                                    <h2 class="is-6">Integration</h2>
                                    <span class="is-size-3 has-text-info">
                                        50
                                    </span>
                                </div>
                            </div>
                            <div class="column">
                                <div
                                    class="box"
                                    style="padding: 20px; background-color: #1f2d3b"
                                >
                                    <h2 class="is-6">Installation</h2>
                                    <span class="is-size-3 has-text-info">
                                        25
                                    </span>
                                </div>
                            </div>
                            <div class="column">
                                <div
                                    class="box"
                                    style="padding: 20px; background-color: #1f2d3b"
                                >
                                    <h2 class="is-6">Production</h2>
                                    <span class="is-size-3 has-text-info">
                                        45
                                    </span>
                                </div>
                            </div>
                            <div class="column">
                                <div
                                    class="box"
                                    style="padding: 20px; background-color: #1f2d3b"
                                >
                                    <h2 class="is-6">Diagnostics</h2>
                                    <span class="is-size-3 has-text-info">
                                        10
                                    </span>
                                </div>
                            </div>
                            <div class="column">
                                <div
                                    class="box"
                                    style="padding: 20px; background-color: #1f2d3b"
                                >
                                    <h2 class="is-6">Decommissioned</h2>
                                    <span class="is-size-3 has-text-info">
                                        {{ 50 }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p class="subtitle is-4">Health</p>
                        <div class="columns">
                            <div class="column">
                                <div
                                    class="box"
                                    style="padding: 20px; background-color: #1f2d3b"
                                >
                                    <h2 class="is-6">Pass</h2>
                                    <span class="is-size-3 has-text-success">
                                        50
                                    </span>
                                </div>
                            </div>
                            <div class="column">
                                <div
                                    class="box"
                                    style="padding: 20px; background-color: #1f2d3b"
                                >
                                    <h2 class="is-6">Unknown</h2>
                                    <span class="is-size-3 has-text-warning">
                                        11
                                    </span>
                                </div>
                            </div>
                            <div class="column">
                                <div
                                    class="box"
                                    style="padding: 20px; background-color: #1f2d3b"
                                >
                                    <h2 class="is-6">Error</h2>
                                    <span class="is-size-3 has-text-danger">
                                        9
                                    </span>
                                </div>
                            </div>
                            <div class="column">
                                <div
                                    class="box"
                                    style="padding: 20px; background-color: #1f2d3b"
                                >
                                    <h2 class="is-6">Fail</h2>
                                    <span class="is-size-3 has-text-danger">
                                        32
                                    </span>
                                </div>
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
                        <i class="material-icons" style="margin-left: 10px;">
                            arrow_forward
                        </i>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

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
        getDate(date) {
            return moment(date).format('MM/DD/YYYY');
        },
    },
};
</script>
