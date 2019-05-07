<template>
    <div class="user-action-modal">
        <BaseModal v-if="!success">
            <template v-slot:icon>
                <i
                    class="fas fa-4x fa-unlock-alt has-text-warning"
                    v-if="action === 'reset-pwd'"
                ></i>
                <i
                    class="far fa-4x fa-arrow-alt-circle-up has-text-success"
                    v-else-if="action === 'promote'"
                ></i>
                <i
                    class="far fa-4x fa-arrow-alt-circle-down has-text-danger"
                    v-else-if="action === 'demote'"
                ></i>
                <i
                    class="fas fa-4x fa-user-slash has-text-danger"
                    v-else-if="action === 'deactivate'"
                ></i>
                <i
                    class="far fa-4x fa-times-circle has-text-danger"
                    v-else-if="(action === 'delete-login-tokens' || action === 'delete-auth-tokens') && !hasNoTokens"
                ></i>
                <i
                    class="far fa-4x fa-check-circle has-text-success"
                    v-else-if="hasNoTokens"
                ></i>
            </template>
            <template v-slot:title>
                <h1 class="title" v-if="hasNoTokens">
                    No Tokens to Delete
                </h1>
                <h1 class="title is-capitalized" v-else>
                    {{ titleText }}
                </h1>
            </template>
            <template v-slot:body>
                <p class="subtitle" v-if="hasNoTokens">
                    <strong class="name">{{ user.name }}</strong> has no auth tokens.
                </p>
                <p class="subtitle" v-else>
                    Are you sure you want to {{ actionText }} <strong class="name">{{ user.name }}</strong>?
                </p>
            </template>
            <template v-slot:footer>
                <a
                    class="button close is-success is-fullwidth"
                    @click="closeModal()"
                    v-if="hasNoTokens"
                >
                    Close
                    <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                </a>
                <a
                    class="button confirm is-success is-fullwidth"
                    @click="confirm()"
                    v-else
                >
                    Confirm
                    <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                </a>
            </template>
        </BaseModal>
        <BaseModal v-else>
            <template v-slot:icon>
                <i class="far fa-4x fa-check-circle has-text-success"></i>
            </template>
            <template v-slot:title>
                <h1 class="title">
                    Success!
                </h1>
            </template>
            <template v-slot:body>
                <p class="subtitle" v-if="action === 'reset-pwd'">
                    <strong class="has-text-white">{{ user.name }}</strong>'s password has been reset.
                </p>
                <p class="subtitle" v-else-if="action === 'delete-login-tokens'">
                    <strong class="has-text-white">{{ user.name }}</strong>'s login tokens have been successfully deleted.
                </p>
                <p class="subtitle" v-else-if="action === 'delete-auth-tokens'">
                    <strong class="has-text-white">{{ user.name }}</strong>'s auth tokens have been successfully deleted.
                </p>
                <p class="subtitle" v-else>
                    <strong class="has-text-white">{{ user.name }}</strong> has been successfully <strong class="has-text-white">{{ action }}d</strong>.
                </p>
            </template>
            <template v-slot:footer>
                <a
                    class="button confirm is-success is-fullwidth"
                    @click="closeModal()"
                >
                    <span v-if="hasNoTokens">Close</span>
                    <span v-else>Great!</span>
                    <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                </a>
            </template>
        </BaseModal>
    </div>
</template>

<script>
import BaseModal from '@src/views/components/BaseModal.vue';
import { EventBus } from '@src/eventBus.js';
import {
    deactivateUser,
    deleteUserTokens,
    demoteUser,
    forcePasswordChange,
    getUserTokens,
    promoteUser,
} from '@api/users.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        BaseModal,
    },
    props: {
        action: {
            type: String,
            required: true,
        },
        user: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            actionText: '',
            clearTokens: true,
            deactivateConfirmed: false,
            hasNoTokens: false,
            isActive: true,
            success: false,
            titleText: '',
        };
    },
    methods: {
        ...mapActions([
            'clearUserAuthTokens',
        ]),
        closeModal() {
            this.isActive = false;
            this.hasNoTokens = false;

            if (this.success) {
                this.success = false;

                EventBus.$emit('close-modal:success');
            } else {
                EventBus.$emit('close-modal');
            }
        },
        confirm() {
            const action = this.action;
            const userId = this.user.id;

            if (action === 'reset-pwd') {
                forcePasswordChange(userId)
                    .then(() => {
                        this.triggerSuccess(userId);
                    });
            } else if (action === 'promote') {
                promoteUser(userId)
                    .then(() => {
                        this.triggerSuccess(userId);
                    });
            } else if (action === 'demote') {
                demoteUser(userId)
                    .then(() => {
                        this.triggerSuccess(userId);
                    });
            } else if (action === 'deactivate') {
                const params = {};

                if (this.clearTokens) {
                    params.clear_tokens = 1;
                }

                deactivateUser(userId, params)
                    .then(() => {
                        this.triggerSuccess(userId, true);
                    });
            } else if (action === 'delete-auth-tokens') {
                const params = { api_only: 1 };

                deleteUserTokens(userId, params)
                    .then(() => {
                        if (userId === this.currentUser.id) {
                            this.clearUserAuthTokens();
                        }

                        this.triggerSuccess(userId);
                    });
            } else if (action === 'delete-login-tokens') {
                const params = { login_only: 1 };

                deleteUserTokens(userId, params)
                    .then(() => {
                        this.triggerSuccess(userId);
                    });
            }
        },
        triggerSuccess(userId, deactivate = false) {
            this.success = true;

            if (deactivate) {
                EventBus.$emit('action-success', { userId, action: 'deactivate' });
            } else {
                EventBus.$emit('action-success', { userId });
            }
        },
    },
    computed: {
        ...mapState([
            'currentUser',
        ]),
    },
    created() {
        const action = this.action;

        if (action === 'delete-auth-tokens') {
            getUserTokens(this.user.id)
                .then(response => {
                    if (!response.data.length) {
                        this.hasNoTokens = true;
                    } else {
                        this.actionText = 'delete the auth tokens for';
                        this.titleText = 'Delete Auth Tokens?';
                    }
                });
        } else if (action === 'delete-login-tokens') {
            this.actionText = 'delete the login tokens for';
            this.titleText = 'Delete Login Tokens?';
        } else if (action === 'reset-pwd') {
            this.actionText = 'reset the password for';
            this.titleText = 'Reset Password?';
        } else {
            this.actionText = action;
            this.titleText = `${action} User?`;
        }
    },
};
</script>
