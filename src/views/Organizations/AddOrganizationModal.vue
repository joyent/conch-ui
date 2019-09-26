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
                                    <p>Every organization must</p>
                                    <p>have at least one user</p>
                                    <p>with admin privileges.</p>
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
                                        Review the members, workspaces and
                                        builds associated with the new
                                        organization and make any changes
                                        necessary.
                                    </p>
                                </template>
                            </div>
                            <div class="steps">
                                <p class="step-text">Step {{ activeStep }}</p>
                                <div class="dots">
                                    <span
                                        class="dot"
                                        :class="{
                                            'is-active': activeStep === 1,
                                        }"
                                        @click="activateStep(1)"
                                    ></span>
                                    <span
                                        class="dot"
                                        :class="{
                                            'is-active': activeStep === 2,
                                        }"
                                        @click="activateStep(2)"
                                    ></span>
                                    <span
                                        class="dot"
                                        :class="{
                                            'is-active': activeStep === 3,
                                        }"
                                        @click="activateStep(3)"
                                    ></span>
                                    <span
                                        class="dot"
                                        :class="{
                                            'is-active': activeStep === 4,
                                        }"
                                        @click="activateStep(4)"
                                    ></span>
                                    <span
                                        class="dot"
                                        :class="{
                                            'is-active': activeStep === 5,
                                        }"
                                        @click="activateStep(5)"
                                    ></span>
                                </div>
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
                                            <div
                                                class="control has-icons-right"
                                            >
                                                <input
                                                    class="input name"
                                                    :class="{
                                                        'is-danger':
                                                            errors.name,
                                                    }"
                                                    v-model="name"
                                                    type="text"
                                                    placeholder="Give your organization a name"
                                                />
                                                <span
                                                    class="icon is-small is-right has-text-danger"
                                                    v-if="errors.name"
                                                >
                                                    <i class="material-icons">
                                                        error
                                                    </i>
                                                </span>
                                            </div>
                                            <p
                                                class="error has-text-danger is-size-6"
                                                v-if="errors.name"
                                                style="padding-top: 5px;"
                                            >
                                                This field is required.
                                            </p>
                                        </div>
                                        <div class="field">
                                            <label class="label">
                                                Description
                                            </label>
                                            <textarea
                                                class="textarea has-fixed-size"
                                                name="description"
                                                v-model="description"
                                                maxlength="165"
                                                placeholder="Add a helpful description of your organization"
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
                                        <div class="review-item details">
                                            <div
                                                class="review-item-title"
                                                :class="{
                                                    'is-expanded': isExpandedDetails,
                                                }"
                                                @click="
                                                    isExpandedDetails = !isExpandedDetails
                                                "
                                            >
                                                <p class="item-title">
                                                    Details
                                                </p>
                                                <i class="material-icons">
                                                    chevron_right
                                                </i>
                                            </div>
                                            <div
                                                class="review-item-content"
                                                v-if="isExpandedDetails"
                                            >
                                                <div class="item-content-row">
                                                    {{ name }}
                                                </div>
                                                <div
                                                    class="item-content-row"
                                                    v-if="description"
                                                >
                                                    {{ description }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="review-item members">
                                            <div
                                                class="review-item-title"
                                                :class="{
                                                    'is-expanded': isExpandedMembers,
                                                }"
                                                @click="
                                                    isExpandedMembers = !isExpandedMembers
                                                "
                                            >
                                                <p class="item-title">
                                                    Members
                                                </p>
                                                <i class="material-icons">
                                                    chevron_right
                                                </i>
                                            </div>
                                            <div
                                                class="review-item-content"
                                                v-if="isExpandedMembers"
                                            >
                                                <div
                                                    class="item-content-row"
                                                    v-for="user in users"
                                                    :key="user.id"
                                                >
                                                    {{ user.email }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="review-item workspaces">
                                            <div
                                                class="review-item-title"
                                                :class="{
                                                    'is-expanded': isExpandedWorkspaces,
                                                }"
                                                @click="
                                                    isExpandedWorkspaces = !isExpandedWorkspaces
                                                "
                                            >
                                                <p class="item-title">
                                                    Workspaces
                                                </p>
                                                <i class="material-icons">
                                                    chevron_right
                                                </i>
                                            </div>
                                            <div
                                                class="review-item-content"
                                                v-if="isExpandedWorkspaces"
                                            >
                                                <div
                                                    class="item-content-row"
                                                    v-for="user in users"
                                                    :key="user.id"
                                                >
                                                    {{ user.email }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="review-item builds">
                                            <div
                                                class="review-item-title"
                                                :class="{
                                                    'is-expanded': isExpandedBuilds,
                                                }"
                                                @click="
                                                    isExpandedBuilds = !isExpandedBuilds
                                                "
                                            >
                                                <p class="item-title">
                                                    Builds
                                                </p>
                                                <i class="material-icons">
                                                    chevron_right
                                                </i>
                                            </div>
                                            <div
                                                class="review-item-content"
                                                v-if="isExpandedBuilds"
                                            >
                                                <div
                                                    class="item-content-row"
                                                    v-for="user in users"
                                                    :key="user.id"
                                                >
                                                    {{ user.email }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                            <div class="modal-footer">
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
                                        @click="nextStep()"
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
import { mapActions, mapState } from 'vuex';
import { getUsers } from '@api/users.js';
import { addOrganization } from '@api/organizations.js';

export default {
    components: {
        ItemTable,
        SuccessModal,
    },
    data() {
        return {
            activeStep: 1,
            description: '',
            errors: {
                name: false,
            },
            isActive: true,
            isExpandedBuilds: false,
            isExpandedDetails: false,
            isExpandedMembers: false,
            isExpandedWorkspaces: false,
            isLoading: false,
            isSuccessful: false,
            name: '',
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
        };
    },
    methods: {
        ...mapActions(['setUsers']),
        activateStep(step) {
            const activeStep = this.activeStep;

            if (activeStep === 1) {
                if (this.name) {
                    this.resetErrors();
                    this.activeStep = step;
                } else {
                    this.errors.name = true;
                }
            } else {
                this.resetErrors();
                this.activeStep = step;
            }
        },
        closeModal() {
            this.isActive = false;

            EventBus.$emit('close-modal:add-organization');
        },
        async createOrganization() {
            this.isLoading = true;
            const data = {
                name: this.name,
                description: this.description,
                admins: [
                    {
                        user_id: '4fc5c040-71bd-4400-9b9c-217465c4ec30',
                    },
                ],
            };

            await addOrganization(data);

            EventBus.$emit('organization-created');

            this.isLoading = false;
            this.isSuccessful = true;
        },
        deselectUser(user) {
            const index = this.selectedUsers.indexOf(user);

            this.selectedUsers.splice(index, 1);
        },
        isUserSelected(user) {
            return this.selectedUsers.indexOf(user) !== -1 ? true : false;
        },
        nextStep() {
            const activeStep = this.activeStep;

            if (activeStep === 1) {
                if (this.name) {
                    this.resetErrors();
                    this.activeStep++;
                } else {
                    this.errors.name = true;
                }
            } else {
                this.resetErrors();
                this.activeStep++;
            }
        },
        resetErrors() {
            this.errors = {
                name: false,
            };
        },
        selectUser(user) {
            this.selectedUsers.push(user);
        },
    },
    computed: {
        ...mapState(['users']),
    },
    created() {
        if (!this.users.length) {
            getUsers().then(response => {
                this.setUsers(response.data);
            });
        }
    },
};
</script>
