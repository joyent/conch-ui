<template>
    <div class="user-action-modal">
        <div class="modal" :class="{ 'is-active': isActive }" v-if="!success">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content">
                <div class="notification">
                    <button
                        class="delete is-medium"
                        @click="closeModal()"
                    ></button>
                    <div class="columns is-vcentered">
                        <div class="column is-2" style="text-align: center;">
                            <i
                                class="fas fa-3x fa-unlock-alt has-text-warning"
                                v-if="action === 'reset-pwd'"
                            ></i>
                            <i
                                class="far fa-4x fa-arrow-alt-circle-up has-text-warning"
                                v-else-if="action === 'promote'"
                            ></i>
                            <i
                                class="far fa-4x fa-arrow-alt-circle-down has-text-warning"
                                v-else-if="action === 'demote'"
                            ></i>
                            <i
                                class="fas fa-3x fa-user-slash has-text-warning"
                                v-else-if="action === 'deactivate'"
                            ></i>
                        </div>
                        <div class="column">
                            <p class="subtitle" v-if="action === 'reset-pwd'">
                                Are you sure you want to <strong class="has-text-white">reset the password</strong> for <strong class="has-text-white">{{ user.name }}</strong>?
                            </p>
                            <p class="subtitle" v-else>
                                Are you sure you want to <strong class="has-text-white">{{ action }} {{ user.name }}</strong>?
                            </p>
                            <div class="field is-grouped">
                                <div class="control">
                                    <button
                                        class="button confirm is-success"
                                        @click="confirm()"
                                    >
                                        Confirm
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
                </div>
            </div>
        </div>
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
                        this.success = true;
                        EventBus.$emit('action-success', userId);
                    });
            } else if (action === 'promote') {
                promoteUser(userId)
                    .then(() => {
                        this.success = true;
                        EventBus.$emit('action-success', userId);
                    });
            } else if (action === 'demote') {
                demoteUser(userId)
                    .then(() => {
                        this.success = true;
                        EventBus.$emit('action-success', userId);
                    });
            } else if (action === 'deactivate') {
                deactivateUser(userId)
                    .then(() => {
                        this.success = true;
                        EventBus.$emit('action-success', userId);
                    });
            }
        },
    },
};
</script>
