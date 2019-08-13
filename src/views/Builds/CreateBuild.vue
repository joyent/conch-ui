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
import { EventBus } from '@src/eventBus.js';

export default {
    data() {
        return {
            completeSteps: [],
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
