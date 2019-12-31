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
                <div class="user-details" v-if="step === 1">
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
                        <div class="field password" v-if="action !== 'edit'">
                            <label class="label">New Password</label>
                            <div class="control has-icons-right">
                                <input
                                    class="input password"
                                    :class="{
                                        'is-danger': errors.passwordLength,
                                        'is-success': validPassword,
                                    }"
                                    type="password"
                                    placeholder="New Password"
                                    v-model="password"
                                    ref="passwordInput"
                                    @blur="validatePassword()"
                                    autocomplete="off"
                                />
                                <span
                                    class="icon is-small is-right has-text-danger"
                                    v-if="errors.passwordLength"
                                >
                                    <i class="fas fa-exclamation-triangle"></i>
                                </span>
                                <span
                                    class="icon is-small is-right has-text-success"
                                    v-if="validPassword"
                                >
                                    <i class="fas fa-check"></i>
                                </span>
                            </div>
                        </div>
                        <div
                            class="field password-confirmation"
                            v-if="action !== 'edit'"
                        >
                            <label class="label">Confirm Password</label>
                            <div class="control has-icons-right">
                                <input
                                    class="input confirmation"
                                    :class="{
                                        'is-danger': errors.passwordMismatch,
                                        'is-success': validPasswordConfirmation,
                                    }"
                                    type="password"
                                    placeholder="Confirm Password"
                                    v-model="passwordConfirmation"
                                    ref="passwordConfirmation"
                                    @blur="validatePasswordConfirmation()"
                                    autocomplete="off"
                                />
                                <span
                                    class="icon is-small is-right has-text-danger"
                                    v-if="errors.passwordMismatch"
                                >
                                    <i class="fas fa-exclamation-triangle"></i>
                                </span>
                                <span
                                    class="icon is-small is-right has-text-success"
                                    v-if="validPasswordConfirmation"
                                >
                                    <i class="fas fa-check"></i>
                                </span>
                            </div>
                        </div>
                    </form>
                    <hr :class="{ 'edit-user': action === 'edit' }" />
                    <div class="field has-switch role">
                        <label class="label is-marginless">
                            Is this user an Admin?
                        </label>
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
                    <hr />
                </div>
                <div class="options" v-else-if="step === 2">
                    <p>
                        Do you want to add this user to any builds or
                        organizations?
                    </p>
                    <hr />
                    <div class="field has-switch builds">
                        <label class="label is-marginless">
                            Add user to builds
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
                        <label class="label is-marginless">
                            Add user to organizations
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
                <div class="builds" v-else-if="step === 3">
                    <ItemsPanel :item-type="'builds'" :items="builds" />
                </div>
                <div class="organizations" v-else-if="step === 4">
                    <ItemsPanel
                        :item-type="'organizations'"
                        :items="organizations"
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
                        @click="addUserToBuilds()"
                    >
                        Add Builds
                    </a>
                    <a
                        class="button is-success add-organizations"
                        :class="{ 'is-loading': isLoading }"
                        v-if="step === 4"
                        @click="addUserToOrganizations()"
                    >
                        Add Organizations
                    </a>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import ItemsPanel from './ItemsPanel.vue';
import { mapActions, mapState } from 'vuex';
import { EventBus } from '@src/eventBus.js';
import { createUser, editUser } from '@api/users.js';
import { addUserToBuild, getBuilds } from '@api/builds.js';
import { addUserToOrganization, getOrganizations } from '@api/organizations.js';

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
        editUser: {
            type: Object,
            required: false,
            default: () => {},
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
                password: false,
                passwordLength: false,
                passwordMismatch: false,
            },
            isActive: true,
            isAdmin: false,
            isLoading: false,
            name: '',
            password: '',
            passwordConfirmation: '',
            searchText: '',
            selectedBuilds: [],
            selectedOrganizations: [],
            showError: false,
            step: 1,
            success: false,
            user: {},
            userCreated: false,
            validPassword: false,
            validPasswordConfirmation: false,
        };
    },
    methods: {
        ...mapActions(['setBuilds', 'setOrganizations']),
        async advanceStep() {
            if (this.step === 1 && this.validateForm()) {
                if (this.validateForm()) {
                    this.step++;

                    EventBus.$emit('next-step');
                }
            } else if (this.step === 2) {
                if (this.addToBuilds) {
                    this.step = 3;
                } else {
                    this.step = 4;
                }
            }
        },
        async addUserToBuilds() {
            EventBus.$emit('next-step');

            if (this.selectedBuilds.length) {
                this.isLoading = true;

                for (let i = 0; i < this.selectedBuilds.length; i++) {
                    const build = this.selectedBuilds[i];
                    await addUserToBuild(build.id, this.user.id, build.role);
                }

                this.isLoading = false;
            }

            if (this.addToOrganizations) {
                this.step++;
            } else {
                this.closeModal();
            }
        },
        async addUserToOrganizations() {
            EventBus.$emit('next-step');

            if (this.selectedOrganizations.length) {
                this.isLoading = true;

                for (let i = 0; i < this.selectedOrganizations.length; i++) {
                    const organization = this.selectedOrganizations[i];
                    await addUserToOrganization(
                        organization.id,
                        organization.role,
                        this.user.id
                    );
                }

                this.closeModal();
            }
        },
        closeModal() {
            this.isActive = false;
            EventBus.$emit('close-user-modal');
        },
        createNewUser() {
            this.isLoading = true;
            this.resetErrors();

            if (this.validateForm()) {
                const user = {
                    email: this.email,
                    is_admin: this.isAdmin,
                    name: this.name,
                    password: this.password,
                };

                createUser(user)
                    .then(response => {
                        this.user = response.data;
                        this.isLoading = false;
                        this.step = 2;

                        EventBus.$emit('action-success', {
                            userId: this.user.id,
                            action: 'create',
                        });
                    })
                    .catch(error => {
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
                this.name === this.editUser.name &&
                this.email === this.editUser.email &&
                this.isAdmin === this.editUser.is_admin
            ) {
                this.actionComplete = true;
                this.isLoading = false;

                return;
            } else if (
                this.name !== this.editUser.name ||
                this.email !== this.editUser.email ||
                this.isAdmin !== this.editUser.is_admin
            ) {
                if (this.validateForm()) {
                    const editedUser = {
                        id: this.editUser.id,
                        email: this.email,
                        is_admin: this.isAdmin,
                        name: this.name,
                    };

                    editUser(editedUser)
                        .then(response => {
                            this.user = response.data;
                            this.isLoading = false;
                            this.step = 2;

                            EventBus.$emit('action-success', {
                                userId: this.user.id,
                                action: 'edit',
                            });
                        })
                        .catch(error => {
                            if (error.status === 500) {
                                this.errors.duplicateEmail = true;
                                this.isLoading = false;
                            }
                        });
                }
            }
        },
        resetErrors() {
            this.errors = {
                duplicateEmail: false,
                invalidEmail: false,
                name: false,
                password: false,
                passwordLength: false,
                passwordMismatch: false,
            };
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

            if (this.action !== 'edit') {
                const password = this.password;
                const passwordConfirmation = this.passwordConfirmation;

                if (!password || password.length < 5) {
                    this.errors.passwordLength = true;
                    this.isLoading = false;
                    this.showError = true;
                }

                if (
                    !passwordConfirmation ||
                    password !== passwordConfirmation
                ) {
                    this.errors.passwordMismatch = true;
                    this.isLoading = false;
                    this.showError = true;
                }
            }

            return !this.hasErrors;
        },
        validatePasswordConfirmation() {
            this.validPasswordConfirmation = false;
            const passwordConfirmation = this.passwordConfirmation;

            if (!passwordConfirmation && !this.password) {
                this.errors.passwordMismatch = false;
            } else if (
                passwordConfirmation &&
                passwordConfirmation === this.password
            ) {
                this.validPasswordConfirmation = true;
                this.errors.passwordMismatch = false;
            } else {
                this.errors.passwordMismatch = true;
            }
        },
        validatePassword() {
            this.resetErrors();
            this.showError = false;
            this.validPassword = false;
            const password = this.password;

            if (password && password.length >= 5) {
                this.validPassword = true;
            }

            if (this.passwordConfirmation) {
                this.validatePasswordConfirmation();
            }
        },
    },
    computed: {
        ...mapState(['builds', 'organizations']),
        hasErrors() {
            return Object.values(this.errors).some(error => error === true)
                ? true
                : false;
        },
    },
    created() {
        if (!this.builds.length) {
            getBuilds().then(response => {
                this.setBuilds(response.data);
            });
        }

        if (!this.organizations.length) {
            getOrganizations().then(response => {
                this.setOrganizations(response.data);
            });
        }
    },
    mounted() {
        if (this.editUser) {
            const user = this.editUser;

            this.name = user.name;
            this.email = user.email;
            this.isAdmin = user.is_admin;
        }

        EventBus.$on('close-modal', () => {
            this.closeModal();
        });

        EventBus.$on('items-selected', data => {
            if (data.itemType === 'builds') {
                this.selectedBuilds = data.items;
            } else if (data.itemType === 'organizations') {
                this.selectedOrganizations = data.items;
            }
        });
    },
};
</script>
