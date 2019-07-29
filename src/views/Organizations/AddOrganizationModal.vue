<template>
    <div class="add-organization-modal">
        <div
            class="modal"
            :class="{ 'is-active': isActive }"
            v-if="!isSuccessful"
        >
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content">
                <div class="notification">
                    <div class="columns">
                        <div class="column is-4 step-details">
                            <div class="step-content">
                                <p class="title is-marginless">
                                    {{ steps[activeStep - 1].title }}
                                </p>
                                <hr />
                                <template v-if="activeStep === 1">
                                    <p>Let’s get started!</p>
                                    <br />
                                    <p>Give the new organization a</p>
                                    <p>name and description.</p>
                                </template>
                                <template v-else-if="activeStep === 2">
                                    <p>Add some members to the</p>
                                    <p>organization.</p>
                                    <br />
                                    <p>NOTE: Every organization </p>
                                    <p>must have at least one</p>
                                    <p>user with admin privileges.</p>
                                </template>
                                <template v-else-if="activeStep === 3">
                                    <p>Give the organization access</p>
                                    <p>to a workspace.</p>
                                </template>
                                <template v-else-if="activeStep === 4">
                                    <p>Give the organization access</p>
                                    <p>to a build.</p>
                                </template>
                                <template v-else>
                                    <p>Last step!</p>
                                    <br />
                                    <p>
                                        Review the members, workspaces and builds associated with the new organization and make any changes necessary.
                                    </p>
                                </template>
                            </div>
                            <div class="steps">
                                <p class="step-text">Step {{ activeStep }}</p>
                                <span
                                    class="dot"
                                    :class="{ 'is-active': activeStep === 1 }"
                                    @click="activeStep = 1"
                                ></span>
                                <span
                                    class="dot"
                                    :class="{ 'is-active': activeStep === 2 }"
                                    @click="activeStep = 2"
                                ></span>
                                <span
                                    class="dot"
                                    :class="{ 'is-active': activeStep === 3 }"
                                    @click="activeStep = 3"
                                ></span>
                                <span
                                    class="dot"
                                    :class="{ 'is-active': activeStep === 4 }"
                                    @click="activeStep = 4"
                                ></span>
                                <span
                                    class="dot"
                                    :class="{ 'is-active': activeStep === 5 }"
                                    @click="activeStep = 5"
                                ></span>
                            </div>
                        </div>
                        <div class="column organization-details">
                            <div class="modal-heading">
                                <p class="modal-title">
                                    Create Organization
                                </p>
                                <i
                                    class="material-icons close"
                                    @click="closeModal()"
                                >
                                    close
                                </i>
                            </div>
                            <div class="modal-body">
                                <transition name="fade">
                                    <div
                                        class="step-body"
                                        v-if="activeStep === 1"
                                    >
                                        <div class="field">
                                            <label class="label">Name</label>
                                            <input
                                                type="text"
                                                class="input name"
                                            />
                                        </div>
                                        <div class="field">
                                            <label class="label">
                                                Description
                                            </label>
                                            <textarea
                                                class="textarea has-fixed-size"
                                                name="description"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div
                                        class="step-body"
                                        v-else-if="activeStep === 2"
                                    >
                                        <ItemTable
                                            :title="'Available Members'"
                                            :data="users"
                                        />
                                    </div>
                                    <div
                                        class="step-body"
                                        v-else-if="activeStep === 3"
                                    >
                                        <ItemTable
                                            :title="'Available Workspaces'"
                                            :data="users"
                                        />
                                    </div>
                                    <div
                                        class="step-body"
                                        v-else-if="activeStep === 4"
                                    >
                                        <ItemTable
                                            :title="'Available Builds'"
                                            :data="users"
                                        />
                                    </div>
                                    <div
                                        class="step-body review"
                                        v-else-if="activeStep === 5"
                                    >
                                        <div class="item members">
                                            <div class="item-title">
                                                Members
                                            </div>
                                            <i class="fas fa-arrow-right"></i>
                                        </div>
                                        <div class="item workspaces">
                                            <div class="item-title">
                                                Workspaces
                                            </div>
                                            <i class="fas fa-arrow-right"></i>
                                        </div>
                                        <div class="item builds">
                                            <div class="item-title">Builds</div>
                                            <i class="fas fa-arrow-right"></i>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                            <div
                                class="buttons"
                                :class="{ 'first-step': activeStep === 1 }"
                                v-if="activeStep < 5"
                            >
                                <a
                                    class="button previous is-link"
                                    @click="activeStep--"
                                    v-if="activeStep !== 1"
                                >
                                    Previous
                                </a>
                                <a
                                    class="button next is-info"
                                    @click="activeStep++"
                                >
                                    Next
                                </a>
                            </div>
                            <a
                                class="button is-fullwidth is-success"
                                :class="{ 'is-loading': isLoading }"
                                @click="createOrganization()"
                                style="border-radius: 3px; font-weight: bold;"
                                v-else
                            >
                                Create Organization
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <SuccessModal
            :organization-name="'Super Cool Organization Title'"
            v-if="isSuccessful"
        />
    </div>
</template>

<script>
import ItemTable from './ItemTable.vue';
import SuccessModal from './SuccessModal.vue';
import { EventBus } from '@src/eventBus.js';

export default {
    components: {
        ItemTable,
        SuccessModal,
    },
    data() {
        return {
            activeStep: 1,
            isActive: true,
            isLoading: false,
            isSuccessful: false,
            selectedUsers: [],
            steps: [
                {
                    title: 'Add Details',
                },
                {
                    title: 'Add Members',
                },
                {
                    title: 'Add Workspaces',
                },
                {
                    title: 'Add Builds',
                },
                {
                    title: 'Final Review',
                },
            ],
            users: [
                'Anakin Skywalker',
                'Darth Vader',
                'Leia Organa Solo',
                // 'Lando Calrissian',
                // 'Han Solo',
                // 'Chewbacca',
                // 'Jaina Solo',
                // 'Darth Sideous',
                // 'Jyn Erso',
                // 'Emporer Palpatine',
                // 'Jar Jar Binks',
            ],
        };
    },
    methods: {
        closeModal() {
            this.isActive = false;

            EventBus.$emit('close-modal:add-organization');
        },
        createOrganization() {
            this.isLoading = true;

            setTimeout(() => {
                this.isLoading = false;
                this.isSuccessful = true;
            }, 2000);
        },
        deselectUser(user) {
            const index = this.selectedUsers.indexOf(user);

            this.selectedUsers.splice(index, 1);
        },
        isUserSelected(user) {
            return this.selectedUsers.indexOf(user) !== -1 ? true : false;
        },
        selectUser(user) {
            this.selectedUsers.push(user);
        },
    },
};
</script>
