<template>
    <div class="modal user-modal" :class="{ 'is-active': isActive }">
        <div class="modal-background" @click="closeModal()"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title is-capitalized">{{ action }} User</p>
                <i class="material-icons close" @click="closeModal()">
                    close
                </i>
            </header>
            <section class="modal-card-body">
                <article class="notification is-danger" v-if="hasErrors">
                    <i class="material-icons">error</i>
                    <p>Missing required field</p>
                </article>
                <article
                    class="notification is-info"
                    v-else-if="noChangesExist"
                >
                    <p>No changes have been made</p>
                </article>
                <div class="user-details modal-panel" v-if="step === 1">
                    <form autocomplete="off">
                        <div class="field">
                            <label class="label">Name</label>
                            <div class="control">
                                <input
                                    class="input"
                                    :class="{ 'is-danger': errors.name }"
                                    type="text"
                                    placeholder="User Name"
                                    v-model="name"
                                    autocomplete="off"
                                />
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Email</label>
                            <div class="control">
                                <input
                                    class="input"
                                    :class="{
                                        'is-danger': errors.invalidEmail,
                                    }"
                                    type="email"
                                    placeholder="Email Address"
                                    autocomplete="off"
                                    v-model="email"
                                />
                            </div>
                        </div>
                    </form>
                    <div
                        class="field has-switch role"
                        style="margin-top: 20px;"
                    >
                        <label class="label">
                            Is this user an Admin?
                        </label>
                        <div>
                            <label class="switch">
                                <input
                                    type="checkbox"
                                    :checked="isAdmin"
                                    v-model="isAdmin"
                                    :true-value="true"
                                    :false-value="false"
                                />
                                <span class="slider round is-success"></span>
                            </label>
                            <span class="slider-text" style="margin-left: 8px;">
                                <strong v-if="isAdmin">Yes</strong>
                                <strong v-else>No</strong>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="options modal-panel" v-else-if="step === 2">
                    <p v-if="action === 'create'">
                        Do you want to add this user to any builds or
                        organizations?
                    </p>
                    <p v-else>
                        Do you want to edit memberships for this user?
                    </p>
                    <hr />
                    <div class="field has-switch builds">
                        <label
                            class="label is-marginless"
                            v-if="action === 'create'"
                        >
                            Add user to builds
                        </label>
                        <label class="label is-marginless" v-else>
                            Edit user build memberships
                        </label>
                        <label class="switch">
                            <input
                                type="checkbox"
                                :checked="addToBuilds"
                                v-model="addToBuilds"
                                :true-value="true"
                                :false-value="false"
                            />
                            <span class="slider round is-success"></span>
                        </label>
                        <span class="slider-text" style="margin-left: 8px;">
                            <strong v-if="addToBuilds">Yes</strong>
                            <strong v-else>No</strong>
                        </span>
                    </div>
                    <div class="field has-switch organizations">
                        <label
                            class="label is-marginless"
                            v-if="action === 'create'"
                        >
                            Add user to organizations
                        </label>
                        <label class="label is-marginless" v-else>
                            Edit user organization memberships
                        </label>
                        <label class="switch">
                            <input
                                type="checkbox"
                                :checked="addToOrganizations"
                                v-model="addToOrganizations"
                                :true-value="true"
                                :false-value="false"
                            />
                            <span class="slider round is-success"></span>
                        </label>
                        <span class="slider-text" style="margin-left: 8px;">
                            <strong v-if="addToOrganizations">Yes</strong>
                            <strong v-else>No</strong>
                        </span>
                    </div>
                    <hr />
                </div>
                <div class="builds modal-panel" v-else-if="step === 3">
                    <ItemsPanel
                        v-if="action === 'create'"
                        :item-type="'builds'"
                        :items="builds"
                    />
                    <ItemsPanel
                        v-else
                        :item-type="'builds'"
                        :items="builds"
                        :user-items="editingUser.builds"
                    />
                </div>
                <div class="organizations modal-panel" v-else-if="step === 4">
                    <ItemsPanel
                        v-if="action === 'create'"
                        :item-type="'organizations'"
                        :items="organizations"
                    />
                    <ItemsPanel
                        v-else
                        :item-type="'organizations'"
                        :items="organizations"
                        :user-items="editingUser.organizations"
                    />
                </div>
                <div
                    class="buttons-group"
                    :class="{ 'single-button': step === 2 }"
                >
                    <a
                        class="button cancel"
                        @click="closeModal()"
                        v-if="step !== 2"
                    >
                        Cancel
                    </a>
                    <a
                        class="button is-success create-user is-capitalized"
                        :class="{ 'is-loading': isLoading }"
                        @click="editExistingUser()"
                        v-if="step === 1 && action === 'edit'"
                    >
                        Edit User
                    </a>
                    <a
                        class="button is-success create-user is-capitalized"
                        :class="{ 'is-loading': isLoading }"
                        @click="createNewUser()"
                        v-else-if="step === 1 && action === 'create'"
                    >
                        Create User
                    </a>
                    <a
                        class="button close"
                        v-else-if="
                            step === 2 && !addToBuilds && !addToOrganizations
                        "
                        @click="closeModal()"
                    >
                        Close
                    </a>
                    <a
                        class="button is-success next"
                        @click="advanceStep()"
                        v-else-if="
                            step === 2 && (addToBuilds || addToOrganizations)
                        "
                    >
                        Next
                        <i class="material-icons">arrow_forward</i>
                    </a>
                    <a
                        class="button is-success add-builds"
                        :class="{ 'is-loading': isLoading }"
                        v-if="step === 3"
                        @click="updateUserItems('builds')"
                    >
                        <span v-if="action === 'create'">Add Builds</span>
                        <span v-else>Edit Builds</span>
                    </a>
                    <a
                        class="button is-success add-organizations"
                        :class="{ 'is-loading': isLoading }"
                        v-if="step === 4"
                        @click="updateUserItems('organizations')"
                    >
                        <span v-if="action === 'create'">
                            Add Organizations
                        </span>
                        <span v-else>Edit Organizations</span>
                    </a>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import ItemsPanel from './ItemsPanel.vue';
import { mapActions, mapState } from 'vuex';
import { EventBus } from '@src/eventBus.js';
import { createUser, editUser, getUsers } from '@api/users.js';
import { addUserToBuild, getBuilds, removeUserFromBuild } from '@api/builds.js';
import {
    addUserToOrganization,
    getOrganizations,
    removeUserFromOrganization,
} from '@api/organizations.js';

export default {
    components: {
        ItemsPanel,
    },
    props: {
        action: {
            type: String,
            required: false,
            default: '',
        },
        editingUser: {
            type: Object,
            required: false,
            default: () => {},
        },
        modalStep: {
            type: Number,
            required: false,
            default: 1,
        },
    },
    data() {
        return {
            addToBuilds: false,
            addToOrganizations: false,
            email: '',
            emailIsValid: false,
            errors: {
                duplicateEmail: false,
                invalidEmail: false,
                name: false,
            },
            isActive: true,
            isAdmin: false,
            isLoading: false,
            name: '',
            noChangesExist: false,
            searchText: '',
            selectedBuilds: [],
            selectedOrganizations: [],
            showError: false,
            step: 1,
            success: false,
            user: {},
            userCreated: false,
        };
    },
    methods: {
        ...mapActions(['setBuilds', 'setOrganizations', 'setUsers']),
        async advanceStep() {
            if (this.step === 1 && this.validateForm()) {
                if (this.validateForm()) {
                    this.step++;
                }
            } else if (this.step === 2) {
                if (this.addToBuilds) {
                    this.step = 3;
                } else if (this.addToOrganizations) {
                    this.step = 4;
                }
            }
        },
        closeModal() {
            if (this.reloadUserList) {
                getUsers().then((response) => {
                    this.setUsers(response.data);
                });
            }

            EventBus.$emit('close-user-modal');
            this.isActive = false;
        },
        createNewUser() {
            this.isLoading = true;
            this.resetErrors();

            if (this.validateForm()) {
                const user = {
                    email: this.email,
                    is_admin: this.isAdmin,
                    name: this.name,
                };

                createUser(user)
                    .then((response) => {
                        this.user = response.data;
                        this.reloadUserList = true;
                        this.isLoading = false;
                        this.step = 2;
                    })
                    .catch((error) => {
                        if (error.status === 409) {
                            this.errors.duplicateEmail = true;
                            this.isLoading = false;
                        }
                    });
            } else {
                this.isLoading = false;
            }
        },
        editExistingUser() {
            if (
                this.name === this.editingUser.name &&
                this.email === this.editingUser.email &&
                this.isAdmin === this.editingUser.is_admin
            ) {
                this.noChangesExist = true;
                this.isLoading = false;

                return;
            } else if (
                this.name !== this.editingUser.name ||
                this.email !== this.editingUser.email ||
                this.isAdmin !== this.editingUser.is_admin
            ) {
                this.noChangesExist = false;
                this.isLoading = true;

                if (this.validateForm()) {
                    const editedUser = {
                        id: this.editingUser.id,
                        email: this.email,
                        is_admin: this.isAdmin,
                        name: this.name,
                    };

                    editUser(editedUser)
                        .then((response) => {
                            this.user = response.data;
                            this.reloadUserList = true;
                            this.isLoading = false;
                            this.step = 2;
                        })
                        .catch((error) => {
                            if (error.status === 500) {
                                this.errors.duplicateEmail = true;
                                this.isLoading = false;
                            }
                        });
                } else {
                    this.isLoading = false;
                }
            }
        },
        resetErrors() {
            this.errors = {
                duplicateEmail: false,
                invalidEmail: false,
                name: false,
            };
        },
        async updateUserItems(itemType) {
            EventBus.$emit('get-selected-items');
            this.isLoading = true;

            const userId = this.user.id;

            if (itemType === 'builds') {
                const selectedBuilds = this.selectedBuilds;

                if (selectedBuilds.length) {
                    for (let i = 0; i < selectedBuilds.length; i++) {
                        const build = selectedBuilds[i];
                        await addUserToBuild(build.id, userId, build.role);
                    }

                    if (
                        this.user &&
                        this.user.builds &&
                        this.user.builds.length
                    ) {
                        const userBuilds = this.user.builds;
                        const selectedBuildIds = selectedBuilds.map(
                            (build) => build.id
                        );

                        for (let i = 0; i < userBuilds.length; i++) {
                            const build = userBuilds[i];

                            if (selectedBuildIds.indexOf(build.id) === -1) {
                                await removeUserFromBuild(build.id, userId);
                            }
                        }
                    }

                    this.reloadUserList = true;
                }

                if (this.addToOrganizations) {
                    this.isLoading = false;
                    this.step++;

                    return;
                }
            } else {
                const selectedOrganizations = this.selectedOrganizations;

                if (selectedOrganizations.length) {
                    for (let i = 0; i < selectedOrganizations.length; i++) {
                        const organization = selectedOrganizations[i];
                        await addUserToOrganization(
                            organization.id,
                            organization.role,
                            userId
                        );
                    }

                    if (
                        this.user &&
                        this.user.organizations &&
                        this.user.organizations.length
                    ) {
                        const userOrganizations = this.user.organizations;
                        const selectedOrganizationIds = selectedOrganizations.map(
                            (organization) => organization.id
                        );

                        for (let i = 0; i < userOrganizations.length; i++) {
                            const organization = userOrganizations[i];

                            if (
                                selectedOrganizationIds.indexOf(
                                    organization.id
                                ) === -1
                            ) {
                                await removeUserFromOrganization(
                                    organization.id,
                                    userId
                                );
                            }
                        }
                    }

                    this.reloadUserList = true;
                }
            }

            this.closeModal();

            this.isLoading = false;
        },
        validEmail() {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(this.email);
        },
        validateForm() {
            this.resetErrors();

            if (!this.name) {
                this.errors.name = true;
            }

            if (!this.email || !this.validEmail()) {
                this.errors.invalidEmail = true;
            }

            return !this.hasErrors;
        },
    },
    computed: {
        ...mapState(['builds', 'organizations']),
        hasErrors() {
            return Object.values(this.errors).some((error) => error === true)
                ? true
                : false;
        },
    },
    created() {
        if (!this.builds.length) {
            getBuilds().then((response) => {
                this.setBuilds(response.data);
            });
        }

        if (!this.organizations.length) {
            getOrganizations().then((response) => {
                this.setOrganizations(response.data);
            });
        }
    },
    mounted() {
        if (!isEmpty(this.editingUser)) {
            this.user = this.editingUser;

            this.name = this.user.name;
            this.email = this.user.email;
            this.isAdmin = this.user.is_admin;
        }

        if (this.modalStep) {
            this.step = this.modalStep;
        }

        EventBus.$on('close-modal', () => {
            this.closeModal();
        });

        EventBus.$on('send-selected-items', (data) => {
            if (data.itemType === 'builds') {
                this.selectedBuilds = data.items;
            } else if (data.itemType === 'organizations') {
                this.selectedOrganizations = data.items;
            }
        });
    },
};
</script>
