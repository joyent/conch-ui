<template>
    <div class="create-user-modal">
        <BaseModal v-if="!actionComplete">
            <template v-slot:icon>
                <i class="fas fa-4x fa-address-card has-text-info"></i>
            </template>
            <template v-slot:title>
                <h1 class="title is-3">
                    Create User
                </h1>
            </template>
            <template v-slot:body>
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
                            />
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
                                :class="{
                                    'is-danger': errors.invalidEmail,
                                }"
                                type="email"
                                placeholder="Email"
                                v-model="email"
                            />
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
                    <div class="field password">
                        <label class="label">Password</label>
                        <div class="control has-icons-right">
                            <input
                                class="input"
                                :class="{ 'is-danger': errors.password }"
                                type="text"
                                placeholder="Password"
                                v-model="password"
                            />
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
                            />
                            <span class="slider round is-success"></span>
                        </label>
                        <span style="margin-left: 8px;">
                            <strong v-if="isAdmin">Yes</strong>
                            <strong v-else>No</strong>
                        </span>
                    </div>
                </form>
            </template>
            <template v-slot:footer>
                <a
                    class="button is-success create is-fullwidth"
                    :class="{ 'is-loading': isLoading }"
                    @click="createUser()"
                >
                    Create User
                    <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                </a>
            </template>
        </BaseModal>
        <BaseModal v-else>
            <template v-slot:icon>
                <i
                    class="far fa-3x fa-check-circle has-text-success"
                    v-if="success"
                ></i>
                <i v-else class="fas fa-3x fa-id-badge has-text-warning"></i>
            </template>
            <template v-slot:title>
                <span v-if="success">
                    <h1 class="title">Success!</h1>
                </span>
            </template>
            <template v-slot:body>
                <p class="subtitle" v-if="success">
                    <strong class="has-text-white">{{ name }}</strong> has been
                    successfully created.
                </p>
                <p class="subtitle" v-else>
                    No information was changed.
                </p>
            </template>
            <template v-slot:footer>
                <a
                    class="button confirm is-success is-fullwidth"
                    @click="closeModal()"
                >
                    <span v-if="success">Great!</span>
                    <span v-else>Close</span>
                    <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                </a>
            </template>
        </BaseModal>
    </div>
</template>

<script>
import BaseModal from '@src/views/components/BaseModal.vue';
import * as Users from '@api/users.js';
import { EventBus } from '@src/eventBus.js';

export default {
    components: {
        BaseModal,
    },
    props: {
        user: {
            type: Object,
            required: true,
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

                        EventBus.$emit('action-success', {
                            userId,
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
        resetErrors() {
            this.errors = {
                duplicateEmail: false,
                invalidEmail: false,
                name: false,
                password: false,
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

            if (!this.password) {
                this.errors.password = true;
            }

            return Object.values(this.errors).some(error => error === true)
                ? false
                : true;
        },
    },
    mounted() {
        EventBus.$on('closeModal:baseModal', () => {
            this.closeModal();
        });
    },
};
</script>
