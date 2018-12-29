<template>
    <div class="user-profile">
        <PageHeader :title="'User Profile'" :subtitle="'Update password and profile settings'" />
        <section class="info-tiles" style="margin-top: 0.75rem;">
            <div class="tile is-ancestor">
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <p class="subtitle" style="margin-bottom: 0.75rem;">New Password</p>
                        <form>
                            <input type="password" class="input is-small" placeholder="New Password" v-model="password">
                            <button class="button is-primary" @click="savePassword" style="margin-top: 0.75rem;">Save</button>
                        </form>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box"></article>
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
            password: '',
        };
    },
    methods: {
        savePassword() {
            updatePassword(this.password)
                .then(() => {
                    this.$router.push({ path: '/' });
                });
        },
    },
};
</script>
