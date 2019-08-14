<template>
    <div class="create-build">
        <div class="steps">
            <div
                class="step"
                :class="{
                    'is-current': step === 1,
                    'is-complete': isStepComplete(1),
                }"
            >
                <div class="dot">
                    <i class="material-icons" v-if="step === 1">subject</i>
                    <i class="material-icons" v-else-if="isStepComplete(1)">
                        check
                    </i>
                </div>
                <p class="step-title">Build Details</p>
            </div>
            <hr
                :class="{
                    'is-complete': isStepComplete(2),
                    'is-current': step === 2,
                }"
            />
            <div
                class="step"
                :class="{
                    'is-current': step === 2,
                    'is-complete': isStepComplete(2),
                }"
            >
                <div class="dot">
                    <i class="material-icons" v-if="step === 2">people</i>
                    <i class="material-icons" v-else-if="isStepComplete(2)">
                        check
                    </i>
                </div>
                <p class="step-title">Add Members</p>
            </div>
            <hr
                :class="{
                    'is-complete': isStepComplete(3),
                    'is-current': step === 3,
                }"
            />
            <div
                class="step"
                :class="{
                    'is-complete': isStepComplete(3),
                    'is-current': step === 3,
                }"
            >
                <div class="dot">
                    <i class="material-icons" v-if="step === 3">storage</i>
                    <i class="material-icons" v-else-if="isStepComplete(3)">
                        check
                    </i>
                </div>
                <p class="step-title">Add Racks</p>
            </div>
            <hr
                :class="{
                    'is-complete': isStepComplete(4),
                    'is-current': step === 4,
                }"
            />
            <div
                class="step"
                :class="{
                    'is-complete': isStepComplete(4),
                    'is-current': step === 4,
                }"
            >
                <div class="dot">
                    <i class="material-icons" v-if="step === 4">devices</i>
                    <i class="material-icons" v-else-if="isStepComplete(4)">
                        check
                    </i>
                </div>
                <p class="step-title">Add Devices</p>
            </div>
            <hr
                :class="{
                    'is-complete': isStepComplete(5),
                    'is-current': step === 5,
                }"
            />
            <div
                class="step"
                :class="{
                    'is-current': step === 5,
                    'is-complete': isStepComplete(5),
                }"
            >
                <div class="dot">
                    <i class="material-icons" v-if="step === 5">search</i>
                    <i class="material-icons" v-else-if="isStepComplete(5)">
                        check
                    </i>
                </div>
                <p class="step-title">Final Review</p>
            </div>
        </div>
        <p class="step-description" v-if="step === 1">
            These fields are all required.
        </p>
        <p class="step-description" v-if="step === 2">
            You must add at least one user with admin permissions.
        </p>
        <p class="step-description" v-if="step === 3">
            Any devices which are part of a rack are also considered part of the
            build.
        </p>
        <p class="step-description" v-if="step === 4">
            Any devices that are part of a rack that has been added to the build
            will already be a part of the build.
        </p>
        <p class="step-description" v-if="step === 5">
            Review the details of this new build and make any changes necessary.
        </p>
        <div class="step-content">
            <div class="step-1-content" v-if="step === 1">
                <div class="columns">
                    <div class="column is-4 is-offset-4 box">
                        <label class="label">Build Name</label>
                        <div class="control">
                            <input
                                type="text"
                                class="input build-name"
                                v-model="buildName"
                                placeholder="Enter a name for your build"
                            />
                        </div>
                        <div class="build-dates">
                            <div class="start-date">
                                <label class="label">Start Date</label>
                                <v-date-picker
                                    is-dark
                                    :attributes="datePickerAttrs"
                                    v-model="startDate"
                                    :popover="{ visibility: 'click' }"
                                />
                            </div>
                            <div class="end-date">
                                <label class="label">End Date</label>
                                <v-date-picker
                                    is-dark
                                    :attributes="datePickerAttrs"
                                    v-model="endDate"
                                    :popover="{ visibility: 'click' }"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <MembersTable v-if="step === 2" />
            <RacksTable v-else-if="step === 3" />
            <DevicesTable v-else-if="step === 4" />
        </div>
        <div class="button-group">
            <a class="button is-info" @click="previousStep()">
                <i class="material-icons">arrow_back</i>
                Previous Step
            </a>
            <a class="button is-info" @click="nextStep()">
                Next Step
                <i class="material-icons">arrow_forward</i>
            </a>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import DevicesTable from './DevicesTable.vue';
import MembersTable from './MembersTable.vue';
import RacksTable from './RacksTable.vue';
import { setupCalendar, DatePicker } from 'v-calendar';
import { EventBus } from '@src/eventBus.js';

setupCalendar(Vue);
// Vue.component('v-calendar', Calendar);

export default {
    components: {
        DevicesTable,
        MembersTable,
        RacksTable,
        'v-date-picker': DatePicker,
    },
    data() {
        return {
            endDate: new Date(),
            startDate: new Date(),
            datePickerAttrs: [
                {
                    key: 'today',
                    highlight: true,
                    dates: new Date(),
                    popover: {
                        label: `Today's date`,
                        hideIndicator: true,
                    },
                },
            ],
            completeSteps: [],
            buildName: '',
            step: 1,
        };
    },
    methods: {
        isStepComplete(step) {
            return this.completeSteps.indexOf(step) !== -1;
        },
        nextStep() {
            this.completeSteps.push(this.step);
            this.step++;
        },
        previousStep() {
            this.completeSteps.pop();
            this.step--;
        },
    },
    mounted() {
        EventBus.$on('next-step', step => {
            this.step = step;
        });
    },
};
</script>
