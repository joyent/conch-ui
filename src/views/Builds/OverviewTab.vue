<template>
    <div class="overview-tab">
        <div class="columns">
            <div class="column">
                <div class="box" style="padding: 20px; display: flex;">
                    <div class="box-header" style="margin-bottom: 0;">
                        <i class="fas fa-2x fa-calendar-alt"></i>
                    </div>
                    <div class="dates" style="display: flex; flex-grow: 1; justify-content: space-around; text-align: center;">
                        <div class="start-date">
                            <p class="heading is-size-6">Start Date</p>
                            <p>{{ getDate(build.startDate) }}</p>
                        </div>
                        <div class="end-date">
                            <p class="heading is-size-6">End Date</p>
                            <p>{{ getDate(build.endDate) }}</p>
                        </div>
                        <div class="time-remaining">
                            <p class="heading is-size-6">Time Remaining</p>
                            <p>25 days</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="box sign-off" style="padding: 20px; display: flex;">
                    <div class="box-header">
                        <i class="fas fa-2x fa-signature"></i>
                        <div class="sign-off-details">
                            <p class="heading is-size-6">Sign Off</p>
                            <p>N/A</p>
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
                            <i class="fas fa-2x fa-hdd"></i>
                            <p class="heading is-size-6">Devices Complete</p>
                            <p class="fraction">35 / 60</p>
                        </div>
                        <div class="progress-devices">
                            <progress
                                class="progress is-info"
                                :value="build.progress"
                                max="100"
                            ></progress>
                            <span class="amount is-size-5">
                                {{ build.progress }}&#37;
                            </span>
                        </div>
                    </div>
                    <a
                        class="button is-fullwidth all"
                        @click="changeTab('DevicesTab')"
                    >
                        <span class="heading is-marginless is-size-7">
                            All Devices
                        </span>
                        <i
                            class="fas fa-lg fa-long-arrow-alt-right"
                            style="margin-left: 10px"
                        ></i>
                    </a>
                </div>
            </div>
            <div class="column">
                <div class="box">
                    <div class="build-devices">
                        <div class="box-header">
                            <i class="fas fa-2x fa-server"></i>
                            <p class="heading is-size-6">Racks Complete</p>
                            <p class="fraction">8 / 12</p>
                        </div>
                        <div class="progress-devices">
                            <progress
                                class="progress is-info"
                                :value="build.progress"
                                max="100"
                            ></progress>
                            <span class="amount is-size-5">
                                {{ build.progress }}&#37;
                            </span>
                        </div>
                    </div>
                    <a
                        class="button is-fullwidth all"
                        @click="changeTab('RacksTab')"
                    >
                        <span class="heading is-marginless is-size-7">
                            All racks
                        </span>
                        <i
                            class="fas fa-lg fa-long-arrow-alt-right"
                            style="margin-left: 10px"
                        ></i>
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
