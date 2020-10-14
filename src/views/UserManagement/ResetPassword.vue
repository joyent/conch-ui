<template>
    <div class="card" style="border-radius: 4px;">
        <div class="card-content">
            <transition name="fade">
                <article
                    v-if="
                        showError &&
                            (errors.passwordLength || errors.passwordMismatch)
                    "
                    class="message is-danger"
                >
                    <div class="message-header">
                        <p>
                            <i class="fas fa-exclamation-circle"></i>
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
                <article v-if="showSuccessMessage" class="message is-success">
                    <div class="message-header">
                        <p>
                            <i
                                class="fas fa-exclamation-circle"
                                style="margin-right: 20px;"
                            ></i>
                            <span>Password reset successfully</span>
                        </p>
                        <button
                            class="delete"
                            aria-label="delete"
                            @click="showSuccessMessage = false"
                            type="button"
                        ></button>
                    </div>
                </article>
                <article
                    v-if="showResetPasswordError"
                    class="message is-success"
                >
                    <div class="message-header">
                        <i
                            class="fas fa-exclamation-circle"
                            style="margin-right: 20px;"
                        ></i>
                        <span>{{ error }}</span>
                        <button
                            class="delete"
                            aria-label="delete"
                            @click="showResetPasswordError = false"
                            type="button"
                        ></button>
                    </div>
                </article>
            </transition>
            <form>
                <template v-if="isCurrentUser">
                    <div class="field">
                        <label class="label">New Password</label>
                        <div class="control has-icons-right">
                            <input
                                class="input password"
                                :class="{
                                    'is-danger': errors.passwordLength,
                                    'is-success': validPassword,
                                }"
                                :disabled="isLoading"
                                type="password"
                                placeholder="New Password"
                                v-model="password"
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
                                :disabled="isLoading"
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
                </template>
                <div class="field">
                    <h2 v-if="!isCurrentUser" class="title is-4">
                        Reset Password
                    </h2>
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
                            <span class="slider round is-success"> </span>
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
                <div
                    class="buttons"
                    style="margin-top: 20px; justify-content: flex-end;"
                >
                    <a
                        v-if="isCurrentUser"
                        class="button is-success"
                        :class="{ 'is-loading': isLoading }"
                        :disabled="isLoading || !password || !confirmPassword"
                        @click="
                            !isLoading && password && confirmPassword
                                ? savePassword()
                                : null
                        "
                    >
                        Update Password
                    </a>
                    <a
                        v-else
                        class="button is-success"
                        :class="{ 'is-loading': isLoading }"
                        :disabled="isLoading"
                        @click="!isLoading ? resetPassword() : null"
                    >
                        Reset Password
                    </a>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { forcePasswordChange, updatePassword } from '@api/users.js';

export default {
    data() {
        return {
            clearAllTokens: false,
            clearTokens: true,
            confirmPassword: '',
            errors: {},
            error: '',
            isLoading: false,
            password: '',
            showError: false,
            showResetPasswordError: false,
            showSuccessMessage: false,
            validConfirmPassword: false,
            validPassword: false,
        };
    },
    methods: {
        ...mapActions(['setUserAuthTokens']),
        resetErrors() {
            this.errors = {};
        },
        resetFields() {
            this.password = '';
            this.confirmPassword = '';
            this.validPassword = false;
            this.validConfirmPassword = false;
            this.resetErrors();
        },
        async resetPassword() {
            this.isLoading = true;
            this.resetErrors();
            const userId = this.$route.params && this.$route.params.id;

            try {
                await forcePasswordChange(userId);
                this.isLoading = false;
                this.showSuccessMessage = true;

                setTimeout(() => {
                    this.showSuccessMessage = false;
                }, 3000);
            } catch (error) {
                this.error = error;
                this.showResetPasswordError = true;

                setTimeout(() => {
                    this.showResetPasswordError = false;
                });
            }
        },
        async savePassword() {
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
                    params.clear_tokens = 'none';
                }

                try {
                    await updatePassword(password, params);

                    this.$toasted.success('Password updated successfully', {
                        icon: 'check_circle',
                    });

                    this.isLoading = false;
                    this.resetFields();
                } catch (error) {
                    this.$toasted.error(`Error: ${error}`, {
                        action: [
                            {
                                icon: 'close',
                                onClick: (e, toastObject) => {
                                    toastObject.goAway(0);
                                },
                            },
                        ],
                        duration: 8000,
                        icon: 'error',
                    });
                }
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
    computed: {
        ...mapState(['currentUser']),
        isCurrentUser() {
            return (
                this.$route.params &&
                this.$route.params.id &&
                this.currentUser &&
                this.currentUser.id &&
                this.$route.params.id === this.currentUser.id
            );
        },
    },
};
</script>
