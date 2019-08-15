<template>
    <section class="sign-in hero is-fullheight">
        <div class="hero-body">
            <div class="container has-text-centered">
                <div
                    class="column is-6 is-offset-3 session-notification"
                    v-if="invalidCredentials && showNotification"
                >
                    <article class="message is-danger">
                        <div class="message-header">
                            <p>Session Invalidated</p>
                            <button
                                class="delete"
                                aria-label="delete"
                                @click="showNotification = false"
                            ></button>
                        </div>
                        <div class="message-body">
                            Your session has been invalidated. Please sign in again.
                        </div>
                    </article>
                </div>
                <div class="column is-4 is-offset-4">
                    <div class="box">
                        <div class="h3 title">Login to Conch</div>
                        <p
                            class="subtitle has-text-warning"
                            v-if="badLoginAttempt"
                        >
                            Invalid email address or password
                        </p>
                        <form>
                            <div class="field">
                                <div class="control">
                                    <input
                                        type="email"
                                        class="input is-info is-fullwidth is-rounded"
                                        placeholder="Email address"
                                        v-model="emailAddress"
                                        @keyup.enter="signIn()"
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
                                        @keyup.enter="signIn()"
                                    >
                                </div>
                            </div>
                            <button
                                type="button"
                                class="button is-primary is-fullwidth"
                                :class="{ 'is-loading': isLoading }"
                                @click="signIn()"
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
import { mapActions, mapGetters, mapState } from 'vuex';
import { login } from '@api/authentication.js';
import { loadAllWorkspaces } from '@api/workspaces.js';

export default {
    data() {
        return {
            badLoginAttempt: false,
            currentWorkspaceId: '',
            emailAddress: '',
            isLoading: false,
            password: '',
            showNotification: true,
        };
    },
    methods: {
        ...mapActions([
            'setCurrentWorkspace',
            'setForcePasswordChange',
            'setWorkspaces',
        ]),
        initWorkspaceData() {
            return loadAllWorkspaces()
                .then(response => {
                    const workspaces = response.data;

                    this.setWorkspaces(workspaces);
                    this.setCurrentWorkspace(this.loadCurrentWorkspace());

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
                        if (
                            response.headers &&
                            response.headers.location &&
                            response.headers.location === '/user/me/password'
                        ) {
                            this.setForcePasswordChange();
                            this.$router.push({ name: 'passwordReset' });
                        } else {
                            if (isEmpty(this.workspaces)) {
                                this.initWorkspaceData().then(() => {
                                    this.$router.push({
                                        name: 'status',
                                        params: {
                                            currentWorkspace: this
                                                .currentWorkspaceId,
                                        },
                                    });
                                });
                            } else {
                                this.setCurrentWorkspace(
                                    this.loadCurrentWorkspace()
                                );
                                this.$router.push({
                                    name: 'status',
                                    params: {
                                        currentWorkspace: this.$store.getters
                                            .currentWorkspaceId,
                                    },
                                });
                            }
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
        ...mapGetters([
            'loadCurrentWorkspace'
        ]),
        ...mapState([
            'invalidCredentials',
            'workspaces',
        ]),
    },
};
</script>
