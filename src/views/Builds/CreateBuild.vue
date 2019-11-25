<template>
    <div class="create-build">
        <h1 class="title is-2 has-text-centered">Create a New Build</h1>
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
        <div class="step-description">
            <p
                v-if="step === 1"
                :class="{ 'has-text-danger has-text-weight-bold': errors.name }"
            >
                Build name, Start Date and End Date are required fields.
            </p>
            <p v-if="step === 2">
                You must add at least one user with admin permissions.
            </p>
            <p v-if="step === 3">
                Any devices which are part of a rack are also considered part of
                the build.
            </p>
            <p v-if="step === 4">
                Any devices that are part of a rack that has been added to the
                build will already be a part of the build.
            </p>
            <p v-if="step === 5">
                Review the details of this new build and make any changes
                necessary.
            </p>
        </div>
        <div class="step-content">
            <div class="step-1-content" v-if="step === 1">
                <div class="box">
                    <div class="field">
                        <label class="label">Build Name</label>
                        <div class="control">
                            <input
                                type="text"
                                class="input build-name"
                                :class="{ 'is-danger': errors.name }"
                                v-model="name"
                                placeholder="Enter a name for your build"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Description</label>
                        <textarea
                            class="textarea has-fixed-size"
                            name="description"
                            v-model="description"
                            maxlength="165"
                            placeholder="Add a helpful description for the build"
                        ></textarea>
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
            <UserTable v-else-if="step === 2" />
            <RacksTable v-else-if="step === 3" />
            <DevicesTable v-else-if="step === 4" />
        </div>
        <div class="button-group">
            <a
                class="button is-info"
                :disabled="step === 1"
                @click="previousStep()"
            >
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
// import Vue from 'vue';
// import DevicesTable from './DevicesTable.vue';
// import UsersTable from './UsersTable.vue';
// import RacksTable from './RacksTable.vue';
// import { setupCalendar, DatePicker } from 'v-calendar';
import { EventBus } from '@src/eventBus.js';

// setupCalendar(Vue);
// Vue.component('v-calendar', Calendar);

export default {
    components: {
        // DevicesTable,
        // UsersTable,
        // RacksTable,
        // 'v-date-picker': DatePicker,
    },
    data() {
        return {
            completeSteps: [],
            description: '',
            endDate: new Date(),
            errors: {
                endDate: false,
                name: false,
                hasAdminUser: false,
                startDate: false,
            },
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
            name: '',
            startDate: new Date(),
            step: 1,
        };
    },
    methods: {
        isStepComplete(step) {
            return this.completeSteps.indexOf(step) !== -1;
        },
        nextStep() {
            const step = this.step;
            let advance = true;

            this.resetErrors();

            if (step === 1) {
                // Add potential errors for start and end dates
                if (!this.name) {
                    this.errors.name = true;
                    advance = false;
                }
            }

            if (advance) {
                this.completeSteps.push(this.step);
                this.step++;
            }
        },
        previousStep() {
            this.completeSteps.pop();
            this.step--;
        },
        resetErrors() {
            this.errors = {
                endDate: false,
                hasAdminUser: false,
                name: false,
                startDate: false,
            };
        },
    },
    mounted() {
        EventBus.$on('next-step', step => {
            this.step = step;
        });
    },
};
</script>
