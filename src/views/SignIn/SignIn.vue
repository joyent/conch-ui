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
                                type="button"
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
import { mapActions, mapGetters } from 'vuex';
import { login } from '../../api/authentication.js';
import { loadAllWorkspaces } from '../../api/workspaces.js';

export default {
    data() {
        return {
            badLoginAttempt: false,
            currentWorkspace: {},
            emailAddress: '',
            isLoading: false,
            password: '',
        };
    },
    methods: {
        ...mapActions([
            'setCurrentWorkspace',
            'setWorkspaces',
        ]),
        initWorkspaceData() {
            return loadAllWorkspaces()
                .then(response => {
                    this.setWorkspaces(response.data);
                    this.setCurrentWorkspace(this.$store.getters.loadCurrentWorkspace());
                    this.currentWorkspace = this.$store.state.currentWorkspace;

                    localStorage.setItem('currentWorkspace', this.currentWorkspaceId);

                    return Promise.resolve();
                });
        },
        signIn() {
            this.isLoading = true;

            let data = {
                user: this.emailAddress,
                password: this.password,
            };

            login(data)
                .then(response => {
                    this.initWorkspaceData()
                        .then(() => {
                            this.$router.push({ name: 'status', params: { currentWorkspace: this.currentWorkspaceId } });
                        });
                })
                .catch((error) => {
                    this.isLoading = false;
                    this.badLoginAttempt = true;
                });
        },
    },
    computed: {
        currentWorkspaceId() {
            return this.currentWorkspace.id;
        },
    },
};
</script>
