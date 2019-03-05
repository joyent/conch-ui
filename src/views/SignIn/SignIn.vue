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
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapState } from 'vuex';
import { login } from '../../api/authentication.js';
import { loadAllWorkspaces } from '../../api/workspaces.js';

export default {
    data() {
        return {
            badLoginAttempt: false,
            currentWorkspaceId: '',
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
                    let workspaces = response.data;

                    this.setWorkspaces(workspaces);
                    this.setCurrentWorkspace(this.$store.getters.loadCurrentWorkspace());

                    this.currentWorkspaceId = this.$store.getters.currentWorkspaceId;
                    sessionStorage.setItem('currentWorkspace', this.currentWorkspaceId);

                    return Promise.resolve();
                });
        },
        signIn() {
            this.isLoading = true;

            if (this.emailAddress && this.password) {
                const data = {
                    user: this.emailAddress,
                    password: this.password,
                };

                login(data)
                    .then(response => {
                        if (isEmpty(this.workspaces)) {
                            this.initWorkspaceData()
                                .then(() => {
                                    this.$router.push({ name: 'status', params: { currentWorkspace: this.currentWorkspaceId } });
                                });
                        } else {
                            this.setCurrentWorkspace(this.$store.getters.loadCurrentWorkspace());
                            this.$router.push({ name: 'status', params: { currentWorkspace: this.$store.getters.currentWorkspaceId } });
                        }
                    })
                    .catch((error) => {
                        this.isLoading = false;
                        this.badLoginAttempt = true;
                    });
            } else {
                this.isLoading = false;
                this.badLoginAttempt = true;
            }
        },
    },
    computed: {
        ...mapState([
            'workspaces',
        ]),
    },
};
</script>
