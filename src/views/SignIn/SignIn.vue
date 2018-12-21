<template>
    <section class="hero is-fullheight">
        <div class="hero-body">
            <div class="container has-text-centered">
                <div class="column is-4 is-offset-4">
                    <div class="box">
                        <div class="h3 title">Login to Conch</div>
                        <p class="subtitle has-text-warning" v-if="badLoginAttempt">Invalid email address or password</p>
                        <form>
                            <div class="field">
                                <div class="control">
                                    <input
                                        type="email"
                                        class="input is-info is-fullwidth is-rounded"
                                        placeholder="Email address"
                                        v-model="emailAddress"
                                    >
                                </div>
                            </div>
                            <div class="field">
                                <div class="control">
                                    <input
                                        type="password"
                                        class="input is-info is-fullwidth is-rounded"
                                        placeholder="Password"
                                        v-model="password"
                                    >
                                </div>
                            </div>
                            <button
                                type="submit"
                                class="button is-primary is-fullwidth"
                                :class="{ 'is-loading': isLoading }"
                                @click="signIn"
                            >
                            Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { login, setToken } from '../../api/authentication.js';

export default {
    data() {
        return {
            badLoginAttempt: false,
            emailAddress: '',
            isLoading: false,
            password: '',
        };
    },
    methods: {
        signIn() {
            this.isLoading = true;

            let data = {
                user: this.emailAddress,
                password: this.password,
            };

            login(data)
                .then(response => {
                    this.isLoading = false;

                    if (response && response.jwt_token) {
                        setToken(response.jwt_token);
                    }

                    this.$router.push({ path: '/status'})
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.badLoginAttempt = true;
                });
        },
    },
};
</script>
