<template>
    <div class="user-profile">
        <PageHeader
            :title="'User Profile'"
            :subtitle="'Update password and profile settings'"
        />
        <section class="info-tiles" style="margin-top: 0.75rem;">
            <div class="tile is-ancestor">
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <transition name="fade">
                            <article
                                class="message is-danger"
                                v-if="showWarning"
                            >
                                <div class="message-header">
                                    <p>
                                        <i
                                            class="fas fa-exclamation-circle"
                                            style="margin-right: 10px;"
                                        ></i>
                                        Passwords must be at least 5 characters. Please enter a secure password.
                                    </p>
                                    <button
                                        class="delete"
                                        aria-label="delete"
                                        @click="showWarning = false"
                                        type="button"
                                    ></button>
                                </div>
                            </article>
                        </transition>
                        <p class="subtitle" style="margin-bottom: 0.75rem;">
                            New Password
                        </p>
                        <form>
                            <input
                                type="password"
                                class="input"
                                :class="{ 'is-loading': isLoading }"
                                placeholder="New Password"
                                v-model="password"
                                ref="passwordInput"
                            >
                            <button
                                class="button save is-primary"
                                :class="{ 'is-loading': isLoading }"
                                :disabled="isLoading"
                                @click="savePassword()"
                                style="margin-top: 0.75rem;"
                                type="button">
                                Save
                            </button>
                        </form>
                    </article>
                </div>
            </div>
        </section>
        <div class="modal is-active" v-if="showModal">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-card">
                <section class="modal-card-body" style="padding: 0px">
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
                            <p style="margin-bottom: 20px;">
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
import { updatePassword } from '@api/authentication.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        PageHeader,
    },
    data() {
        return {
            isLoading: false,
            password: '',
            showModal: false,
            showWarning: false,
        };
    },
    methods: {
        ...mapActions([
            'clearForcePasswordChange',
        ]),
        closeModal() {
            this.showModal = false;
            this.clearForcePasswordChange();
            this.$refs.passwordInput.focus();
        },
        savePassword() {
            this.isLoading = true;
            const password = this.password;

            if (password.length < 5) {
                this.showWarning = true;
                this.isLoading = false;
            } else {
                if (this.showWarning) {
                    this.showWarning = false;
                }

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
