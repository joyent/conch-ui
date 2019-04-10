<template>
    <div class="user-profile">
        <PageHeader
            :title="'User Profile'"
            :subtitle="'Update password and profile settings'"
        />
        <section class="content">
            <div class="columns">
                <div class="column">
                    <article class="box">
                        <transition name="fade">
                            <article
                                class="message is-danger"
                                v-if="showError && (errors.passwordLength || errors.passwordMismatch)"
                            >
                                <div class="message-header">
                                    <p>
                                        <i class="fas fa-exclamation-circle">
                                        </i>
                                        <span v-if="errors.passwordLength">
                                            Passwords must contain at least 5 characters.
                                        </span>
                                        <span v-else-if="errors.passwordMismatch">
                                            The passwords you entered do not match.
                                        </span>
                                    </p>
                                    <button
                                        class="delete"
                                        aria-label="delete"
                                        @click="showError = false"
                                        type="button"
                                    ></button>
                                </div>
                            </article>
                        </transition>
                        <p class="subtitle">
                            Reset Password
                        </p>
                        <form>
                            <div class="field">
                                <label class="label">New Password</label>
                                <div class="control has-icons-right">
                                    <input
                                        class="input password"
                                        :class="{
                                            'is-danger': errors.passwordLength,
                                            'is-success': validPassword
                                        }"
                                        type="password"
                                        placeholder="New Password"
                                        v-model="password"
                                        ref="passwordInput"
                                        @blur="validatePassword()"
                                    >
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
                            <div class="field">
                                <label class="label">Confirm Password</label>
                                <div class="control has-icons-right">
                                    <input
                                        class="input confirmation"
                                        :class="{
                                            'is-danger': errors.passwordMismatch,
                                            'is-success': validConfirmPassword
                                        }"
                                        type="password"
                                        placeholder="Confirm Password"
                                        v-model="confirmPassword"
                                        ref="confirmPassword"
                                        @blur="validateConfirmPassword()"
                                    >
                                    <span
                                        class="icon is-small is-right has-text-danger"
                                        v-if="errors.passwordMismatch"
                                    >
                                        <i class="fas fa-exclamation-triangle"></i>
                                    </span>
                                   <span
                                        class="icon is-small is-right has-text-success"
                                        v-if="validConfirmPassword"
                                    >
                                        <i class="fas fa-check"></i>
                                    </span>
                                </div>
                            </div>
                            <button
                                class="button save is-primary"
                                :class="{ 'is-loading': isLoading }"
                                :disabled="isLoading"
                                @click="savePassword()"
                                type="button">
                                Save
                            </button>
                        </form>
                    </article>
                </div>
                <div class="column">
                    <article class="box">
                        <AuthTokens />
                    </article>
                </div>
            </div>
        </section>
        <div class="modal is-active" v-if="showModal">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-card">
                <section class="modal-card-body">
                    <article class="message is-danger is-medium">
                        <div class="message-header">
                            <p>Password Update Required</p>
                            <button
                                class="delete is-medium"
                                aria-label="delete"
                                @click="closeModal()"
                            ></button>
                        </div>
                        <div class="message-body">
                            <p>
                                Your password needs to be updated immediately.
                            </p>
                            <a
                                class="button is-danger update-password"
                                @click="closeModal()"
                            >
                                Update Password
                            </a>
                        </div>
                    </article>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import PageHeader from '@views/components/PageHeader.vue';
import AuthTokens from './AuthTokens.vue';
import { updatePassword } from '@api/users.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        AuthTokens,
        PageHeader,
    },
    data() {
        return {
            confirmPassword: '',
            errors: {},
            isLoading: false,
            password: '',
            showModal: false,
            showError: false,
            validConfirmPassword: false,
            validPassword: false,
        };
    },
    methods: {
        ...mapActions([
            'clearForcePasswordChange',
        ]),
        validateConfirmPassword() {
            this.validConfirmPassword = false;
            const confirmPassword = this.confirmPassword;

            if (!confirmPassword && !this.password) {
                this.errors.passwordMismatch = false;
            } else if (confirmPassword && confirmPassword === this.password) {
                this.validConfirmPassword = true;
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

            if (this.confirmPassword) {
                this.validateConfirmPassword();
            }
        },
        closeModal() {
            this.showModal = false;
            this.clearForcePasswordChange();
            this.$refs.passwordInput.focus();
        },
        resetErrors() {
            this.errors = {};
        },
        savePassword() {
            this.isLoading = true;
            const password = this.password;
            const confirmPassword = this.confirmPassword;
            this.resetErrors();

            if (!password || password.length < 5) {
                this.errors.passwordLength = true;
                this.isLoading = false;
                this.showError = true;
                return;
            }

            if (!confirmPassword || password !== confirmPassword) {
                this.errors.passwordMismatch = true;
                this.isLoading = false;
                this.showError = true;
                return;
            } else {
                updatePassword(password)
                    .then(() => {
                        this.$router.push({ name: 'signIn' });
                        this.isLoading = false;
                    });
            }
        },
    },
    computed: {
        ...mapState([
            'forcePasswordChange',
        ]),
    },
    mounted() {
        if (this.forcePasswordChange) {
            this.showModal = true;
        }
    },
};
</script>
