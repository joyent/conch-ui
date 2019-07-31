<template>
    <div class="user-profile">
        <div class="tabs is-toggle">
            <ul>
                <li
                    :class="{ 'is-active': activeTab === 'settings' }"
                    @click="activeTab = 'settings'"
                >
                    <a>
                        <span>Account Settings</span>
                    </a>
                </li>
                <li
                    :class="{ 'is-active': activeTab === 'tokens' }"
                    @click="activeTab = 'tokens'"
                >
                    <a>
                        <span>Authentication Tokens</span>
                    </a>
                </li>
            </ul>
        </div>
        <AccountSettingsTab v-if="activeTab === 'settings'" />
        <AuthenticationTokensTab v-else-if="activeTab === 'tokens'" />
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
import AccountSettingsTab from './AccountSettingsTab.vue';
import AuthenticationTokensTab from './AuthenticationTokensTab.vue';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        AccountSettingsTab,
        AuthenticationTokensTab,
    },
    data() {
        return {
            activeTab: 'settings',
            showModal: false,
        };
    },
    methods: {
        ...mapActions(['clearForcePasswordChange']),
        closeModal() {
            this.showModal = false;
            this.clearForcePasswordChange();
            this.$refs.passwordInput.focus();
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
    },
    computed: {
        ...mapState(['forcePasswordChange']),
    },
    mounted() {
        if (this.forcePasswordChange) {
            this.showModal = true;
        }
    },
};
</script>
