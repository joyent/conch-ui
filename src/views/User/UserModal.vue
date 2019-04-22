<template>
    <div class="user-modal">
        <div v-if="!actionComplete">
            <transition name="fade">
                <div
                    class="modal"
                    :class="{ 'is-active': isActive }"
                    v-if="isActive"
                >
                    <div class="modal-background" @click="closeModal()"></div>
                    <div
                        class="modal-content notification"
                        style="padding: 2rem;"
                    >
                        <div
                            class="modal-title has-text-centered"
                            style="margin-bottom: 10px;"
                        >
                            <i
                                class="far fa-2x fa-address-card"
                                style="margin-right: 10px;"
                            ></i>
                            <span
                                class="title is-3"
                                v-if="action === 'create'"
                            >
                                Create User
                            </span>
                            <span class="title is-3" v-else>Edit User</span>
                        </div>
                        <button
                            class="delete is-medium"
                            aria-label="close"
                            @click="closeModal()"
                        ></button>
                        <form>
                            <div class="field name">
                                <label class="label">Name</label>
                                <div class="control has-icons-right">
                                    <input
                                        class="input"
                                        :class="{ 'is-danger': errors.name }"
                                        type="text"
                                        placeholder="Name"
                                        v-model="name"
                                    >
                                    <span
                                        class="icon is-small is-right has-text-danger"
                                        v-if="errors.name"
                                    >
                                        <i class="fas fa-exclamation-triangle"></i>
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
                            <div class="field email">
                                <label class="label">Email</label>
                                <div class="control has-icons-right">
                                    <input
                                        class="input"
                                        :class="{ 'is-danger': errors.invalidEmail }"
                                        type="email"
                                        placeholder="Email"
                                        v-model="email"
                                    >
                                    <span
                                        class="icon is-small is-right has-text-danger"
                                        v-if="errors.invalidEmail"
                                    >
                                        <i class="fas fa-exclamation-triangle"></i>
                                    </span>
                                </div>
                                <p
                                    class="error has-text-danger is-size-6"
                                    v-if="errors.invalidEmail || errors.duplicateEmail"
                                    style="padding-top: 5px;"
                                >
                                    <span v-if="errors.invalidEmail">
                                        Please enter a valid email.
                                    </span>
                                    <span v-if="errors.duplicateEmail">
                                        This email is already in use.
                                    </span>
                                </p>
                            </div>
                            <div class="field password" v-if="action !== 'edit'">
                                <label class="label">Password</label>
                                <div class="control has-icons-right">
                                    <input
                                        class="input"
                                        :class="{ 'is-danger': errors.password }"
                                        type="text"
                                        placeholder="Password"
                                        v-model="password"
                                    >
                                    <span
                                        class="icon is-small is-right has-text-danger"
                                        v-if="errors.password"
                                    >
                                        <i class="fas fa-exclamation-triangle"></i>
                                    </span>
                                </div>
                                <p
                                    class="error has-text-danger is-size-6"
                                    v-if="errors.password"
                                    style="padding-top: 5px;"
                                >
                                    This field is required.
                                </p>
                            </div>
                            <div class="field" style="margin-top: 15px;">
                                <label class="label">Is Admin?</label>
                                <label class="switch">
                                    <input
                                        type="checkbox"
                                        :checked="isAdmin"
                                        v-model="isAdmin"
                                        :true-value="true"
                                        :false-value="false"
                                    >
                                    <span class="slider round is-success"></span>
                                </label>
                                <span style="margin-left: 8px;">
                                    <strong v-if="isAdmin">Yes</strong>
                                    <strong v-else>No</strong>
                                </span>
                            </div>
                        </form>
                        <div
                            class="field is-grouped"
                            style="margin-top: 20px;"
                        >
                            <div class="control">
                                <button
                                    class="button is-primary create"
                                    :class="{ 'is-loading': isLoading }"
                                    @click="createUser()"
                                    v-if="action === 'create'"
                                >
                                    Create User
                                </button>
                                <button
                                    class="button is-primary edit"
                                    :class="{ 'is-loading': isLoading }"
                                    @click="editUser()"
                                    v-else
                                >
                                    Save Changes
                                </button>
                            </div>
                            <div class="control">
                                <button
                                    class="button cancel"
                                    @click="closeModal()"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <ResultModal v-else>
            <template v-slot:icon>
                <i
                    class="far fa-3x fa-check-circle has-text-success"
                    v-if="success"
                ></i>
                <i v-else class="fas fa-3x fa-id-badge has-text-warning"></i>
            </template>
            <template v-slot:title>
                <span v-if="success">Success!</span>
            </template>
            <template v-slot:subtitle>
                <span v-if="success && action === 'create'">
                    <strong class="has-text-white">{{ name }}</strong> has been successfully created.
                </span>
                <span v-else-if="success && action === 'edit'">
                    <strong class="has-text-white">{{ name }}</strong> has been successfully updated.
                </span>
                <span v-else>
                    No information was changed.
                </span>
            </template>
        </ResultModal>
    </div>
</template>

<script>
import ResultModal from './ResultModal.vue';
import * as Users from '@api/users.js';
import { EventBus } from '@src/eventBus.js';

export default {
    components: {
        ResultModal,
    },
    props: {
        action: {
            type: String,
            required: false,
        },
        user: {
            type: Object,
            required: false,
        },
    },
    data() {
        return {
            actionComplete: false,
            email: '',
            emailIsValid: false,
            errors: {
                duplicateEmail: false,
                invalidEmail: false,
                name: false,
                password: false,
            },
            isActive: true,
            isAdmin: false,
            isLoading: false,
            name: '',
            password: '',
            success: false,
        };
    },
    methods: {
        closeModal() {
            this.actionComplete = false;
            this.isActive = false;
            this.resetErrors();

            if (this.success) {
                this.success = false;

                EventBus.$emit('close-modal:success');
            } else {
                EventBus.$emit('close-modal');
            }
        },
        createUser() {
            this.resetErrors();
            this.isLoading = true;

            if (this.validateForm()) {
                const user = {
                    email: this.email,
                    is_admin: this.isAdmin,
                    name: this.name,
                    password: this.password,
                };

                Users.createUser(user)
                    .then(response => {
                        const userId = response.data.id;
                        this.actionComplete = true;
                        this.success = true;
                        this.isLoading = false;

                        EventBus.$emit(
                            'action-success',
                            {
                                userId,
                                action: 'create'
                            }
                        );
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
        editUser() {
            this.resetErrors();
            this.isLoading = true;

            if (
                this.name === this.user.name &&
                this.email === this.user.email &&
                this.isAdmin === this.user.is_admin
            ) {
                    this.actionComplete = true;
                    this.isLoading = false;

                    return;
            }

            if (this.validateForm()) {
                const editedUser = {
                    id: this.user.id,
                    email: this.email,
                    is_admin: this.isAdmin,
                    name: this.name,
                };

                Users.editUser(editedUser)
                    .then(response => {
                        this.actionComplete = true;
                        this.success = true;
                        this.isLoading = false;
                        EventBus.$emit('action-success', editedUser.id);
                    })
                    .catch(error => {
                        if (error.status === 500) {
                            this.errors.duplicateEmail = true;
                            this.isLoading = false;
                        }
                    });
            } else {
                this.isLoading = false;
            }
        },
        resetErrors() {
            this.errors = {
                duplicateEmail: false,
                invalidEmail: false,
                name: false,
                password: false,
            };
        },
        validEmail() {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

            if (this.action === 'create' && !this.password) {
                this.errors.password = true;
            }

            return Object.values(this.errors).some(error => error === true) ? false : true;
        }
    },
    mounted() {
        const action = this.action;
        const user = this.user;

        if (user && action && action  === 'edit') {
            this.email = this.user.email;
            this.name = this.user.name;
            this.password = this.user.password;
            this.isAdmin = this.user.is_admin;
        }
    },
};
</script>
