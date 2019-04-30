<template>
    <div class="user-action-modal">
        <ConfirmationModal v-if="!success">
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
            </template>
            <template v-slot:title>
                <h1 class="title" v-if="action === 'reset-pwd'">
                    Reset Password?
                </h1>
                <h1 class="title is-capitalized" v-else>
                    {{ action }} User?
                </h1>
            </template>
            <template v-slot:subtitle>
                <p class="subtitle" v-if="action === 'reset-pwd'">
                    Are you sure you want to reset the password for <strong class="name">{{ user.name }}</strong>?
                </p>
                <p class="subtitle" v-else>
                    Are you sure you want to {{ action }} <strong class="name">{{ user.name }}</strong>?
                </p>
            </template>
            <template v-slot:footer>
                <a
                    class="button confirm is-success is-fullwidth"
                    @click="confirm()"
                >
                    Confirm
                    <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                </a>
            </template>
        </ConfirmationModal>
        <ResultModal v-else>
            <template v-slot:icon>
                <i class="far fa-3x fa-check-circle has-text-success"></i>
            </template>
            <template v-slot:title>Success!</template>
            <template v-slot:subtitle>
                <p class="subtitle" v-if="action === 'reset-pwd'">
                    <strong class="has-text-white">{{ user.name }}</strong>'s password has been reset.
                </p>
                <p class="subtitle" v-else>
                    <strong class="has-text-white">{{ user.name }}</strong> has been successfully <strong class="has-text-white">{{ action }}d</strong>.
                </p>
            </template>
        </ResultModal>
    </div>
</template>

<script>
import ConfirmationModal from '@src/views/components/ConfirmationModal.vue';
import ResultModal from './ResultModal.vue';
import { EventBus } from '@src/eventBus.js';
import {
    deactivateUser,
    demoteUser,
    forcePasswordChange,
    promoteUser,
} from '@api/users.js';

export default {
    components: {
        ConfirmationModal,
        ResultModal,
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
            clearTokens: true,
            deactivateConfirmed: false,
            isActive: true,
            success: false,
        };
    },
    methods: {
        closeModal() {
            this.isActive = false;

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
                const clearTokens = this.clearTokens ? 1 : 0;

                deactivateUser(userId, clearTokens)
                    .then(() => {
                        this.triggerSuccess(userId, true);
                    });
            }
        },
        triggerSuccess(userId, deactivate) {
            this.success = true;

            if (deactivate) {
                EventBus.$emit('action-success', { userId, action: 'deactivate' });
            } else {
                EventBus.$emit('action-success', { userId });
            }
        },
    },
};
</script>
