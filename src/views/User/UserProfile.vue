<template>
    <div class="user-profile">
        <PageHeader :title="'User Profile'" :subtitle="'Update password and profile settings'" />
        <section class="info-tiles" style="margin-top: 0.75rem;">
            <div class="tile is-ancestor">
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <transition name="fade">
                            <article class="message is-danger" v-if="showWarning">
                                <div class="message-header">
                                    <p>
                                        <i class="fas fa-exclamation-circle" style="margin-right: 10px;"></i>
                                        Passwords must be at least 5 characters. Please enter a secure password.
                                    </p>
                                    <button class="delete" aria-label="delete" @click="showWarning = false"></button>
                                </div>
                            </article>
                        </transition>
                        <p class="subtitle" style="margin-bottom: 0.75rem;">New Password</p>
                        <form>
                            <input
                                type="password"
                                class="input"
                                :class="{ 'is-loading': isLoading }"
                                placeholder="New Password"
                                v-model="password"
                            >
                            <button
                                class="button is-primary"
                                :class="{ 'is-loading': isLoading }"
                                :disabled="isLoading"
                                @click="savePassword"
                                style="margin-top: 0.75rem;"
                                type="button">
                                Save
                            </button>
                        </form>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import PageHeader from '../components/PageHeader.vue';
import { updatePassword } from '../../api/authentication.js';

export default {
    components: {
        PageHeader,
    },
    data() {
        return {
            isLoading: false,
            password: '',
            showWarning: false,
        };
    },
    methods: {
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
};
</script>
