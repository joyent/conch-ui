<template>
    <div class="account-settings-tab">
        <div class="columns">
            <div class="column is-6">
                <div class="box">
                    <transition name="fade">
                        <article
                            class="message is-danger"
                            v-if="
                                showError &&
                                    (errors.passwordLength ||
                                        errors.passwordMismatch)
                            "
                        >
                            <div class="message-header">
                                <p>
                                    <i class="fas fa-exclamation-circle"></i>
                                    <span v-if="errors.passwordLength">
                                        Passwords must contain at least 5
                                        characters.
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
                    <p class="title has-text-weight-bold is-4">
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
                                        'is-success': validPassword,
                                    }"
                                    type="password"
                                    placeholder="New Password"
                                    v-model="password"
                                    ref="passwordInput"
                                    @blur="validatePassword()"
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
                        <div class="field">
                            <label class="label">Confirm Password</label>
                            <div class="control has-icons-right">
                                <input
                                    class="input confirmation"
                                    :class="{
                                        'is-danger': errors.passwordMismatch,
                                        'is-success': validConfirmPassword,
                                    }"
                                    type="password"
                                    placeholder="Confirm Password"
                                    v-model="confirmPassword"
                                    ref="confirmPassword"
                                    @blur="validateConfirmPassword()"
                                />
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
                        <div class="field">
                            <label class="label">Clear tokens?</label>
                            <label class="switch">
                                <input
                                    type="checkbox"
                                    :checked="clearTokens"
                                    v-model="clearTokens"
                                    :true-value="true"
                                    :false-value="false"
                                />
                                <span class="slider round is-success"></span>
                            </label>
                            <span style="margin-left: 8px;">
                                <strong v-if="clearTokens">Yes</strong>
                                <strong v-else>No</strong>
                            </span>
                        </div>
                        <transition name="fade">
                            <div class="field" v-if="clearTokens">
                                <label class="label">Which tokens?</label>
                                <label class="switch">
                                    <input
                                        class="two-tone"
                                        type="checkbox"
                                        :checked="clearAllTokens"
                                        v-model="clearAllTokens"
                                        :true-value="true"
                                        :false-value="false"
                                    />
                                    <span class="slider round is-success">
                                    </span>
                                </label>
                                <span style="margin-left: 8px;">
                                    <strong v-if="clearAllTokens">
                                        Clear All Tokens
                                    </strong>
                                    <strong v-else>
                                        Clear Login Tokens Only
                                    </strong>
                                </span>
                            </div>
                        </transition>
                        <button
                            class="button save is-primary"
                            :class="{ 'is-loading': isLoading }"
                            :disabled="isLoading"
                            @click="savePassword()"
                            type="button"
                        >
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { updatePassword } from '@api/users.js';

export default {
    data() {
        return {
            clearAllTokens: false,
            clearTokens: true,
            confirmPassword: '',
            errors: {},
            isLoading: false,
            password: '',
            showError: false,
            validConfirmPassword: false,
            validPassword: false,
        };
    },
    methods: {
        ...mapActions(['setUserAuthTokens']),
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
                const params = {};

                if (this.clearTokens) {
                    if (this.clearAllTokens) {
                        params.clear_tokens = 'all';
                        this.setUserAuthTokens([]);
                    } else {
                        params.clear_tokens = 'login_only';
                    }
                } else {
                    params.clear_tokens = 0;
                }

                updatePassword(password, params).then(() => {
                    this.$router.push({ name: 'signIn' });
                    this.isLoading = false;
                });
            }
        },
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
    },
    mounted() {
        this.$refs.passwordInput.focus();
    },
};
</script>
