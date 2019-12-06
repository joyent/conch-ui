<template>
    <section class="sign-in hero is-dark is-fullheight">
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
                            Your session has been invalidated. Please sign in
                            again.
                        </div>
                    </article>
                </div>
                <div
                    class="column is-6 is-offset-3 api-version-notification"
                    v-if="incompatibleApiVersion"
                >
                    <div class="notification is-danger">
                        <p>The API does not meet version requirements.</p>
                        <a
                            class="is-size-7 help-link"
                            @click="showHelp = !showHelp"
                        >
                            How do I fix this problem?
                        </a>
                        <p class="api-version-help" v-if="showHelp">
                            You need to update Conch API to a compatible
                            version.
                            <br />
                            We recommend using the latest release preceding
                            <strong class="has-text-white">
                                v{{ breakingApiVersion }} </strong
                            >.
                            <a
                                class="button is-info conch-releases"
                                :href="conchReleaseUrl"
                                target="_blank"
                            >
                                Latest Conch API Releases
                            </a>
                        </p>
                    </div>
                </div>
                <div class="column is-8 is-offset-2">
                    <div class="card sign-in-card">
                        <div class="card-content">
                            <div class="columns">
                                <div class="column is-5 sign-in-content">
                                    <div class="sign-in-heading">
                                        <p class="title has-text-left">
                                            Welcome to Conch
                                        </p>
                                        <p
                                            class="subtitle is-size-6 has-text-left"
                                        >
                                            Sign in to get started
                                        </p>
                                    </div>
                                    <form>
                                        <div class="sign-in-input">
                                            <div class="field">
                                                <label
                                                    class="label has-text-left"
                                                >
                                                    Email Address
                                                </label>
                                                <div
                                                    class="control has-icons-left"
                                                >
                                                    <input
                                                        type="text"
                                                        class="input"
                                                        :class="{
                                                            'has-error': badEmailAddress,
                                                        }"
                                                        placeholder="Email Address"
                                                        v-model="emailAddress"
                                                        @keyup.enter="signIn()"
                                                        autocomplete="email"
                                                    />
                                                    <span class="icon is-left">
                                                        <i
                                                            class="material-icons has-text-danger"
                                                            v-if="
                                                                badEmailAddress
                                                            "
                                                        >
                                                            error
                                                        </i>
                                                        <i
                                                            class="material-icons has-text-grey"
                                                            v-else
                                                        >
                                                            email
                                                        </i>
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="field">
                                                <label
                                                    class="label has-text-left"
                                                >
                                                    Password
                                                </label>
                                                <div
                                                    class="control has-icons-left"
                                                >
                                                    <input
                                                        type="password"
                                                        class="input"
                                                        :class="{
                                                            'has-error': badPassword,
                                                        }"
                                                        placeholder="Password"
                                                        v-model="password"
                                                        @keyup.enter="signIn()"
                                                        autocomplete="password"
                                                    />
                                                    <span class="icon is-left">
                                                        <i
                                                            class="material-icons has-text-danger"
                                                            v-if="badPassword"
                                                        >
                                                            error
                                                        </i>
                                                        <i
                                                            class="material-icons has-text-grey"
                                                            v-else
                                                        >
                                                            lock
                                                        </i>
                                                    </span>
                                                </div>
                                            </div>
                                            <a
                                                class="button button-sign-in is-info is-fullwidth"
                                                :class="{
                                                    'is-loading': isLoading,
                                                }"
                                                @click="signIn()"
                                                :disabled="
                                                    incompatibleApiVersion
                                                "
                                            >
                                                Sign In
                                            </a>
                                        </div>
                                    </form>
                                </div>
                                <div class="column">
                                    <div class="sign-in-image">
                                        <img
                                            src="../../assets/secure_server.svg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import semver from 'semver';
import {
    breakingApiVersion,
    conchReleaseUrl,
    minimumApiVersion,
} from '@src/config.js';
import { getApiVersion } from '@api/conchApiVersion.js';
import { mapActions, mapGetters, mapState } from 'vuex';
import { login } from '@api/authentication.js';
import { loadAllWorkspaces } from '@api/workspaces.js';

export default {
    data() {
        return {
            apiVersion: '',
            badEmailAddress: false,
            badPassword: false,
            breakingApiVersion: '',
            conchReleaseUrl: '',
            currentWorkspaceId: '',
            emailAddress: '',
            incompatibleApiVersion: false,
            isLoading: false,
            minimumApiVersion: '',
            password: '',
            showHelp: false,
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
            return loadAllWorkspaces().then(response => {
                const workspaces = response.data;

                this.setWorkspaces(workspaces);
                this.setCurrentWorkspace(this.loadCurrentWorkspace());

                this.currentWorkspaceId = this.$store.getters.currentWorkspaceId;
                localStorage.setItem(
                    'currentWorkspace',
                    this.currentWorkspaceId
                );

                return Promise.resolve();
            });
        },
        signIn() {
            if (this.emailAddress && this.password) {
                this.isLoading = true;

                login(this.emailAddress, this.password)
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
                                        name: 'dashboard',
                                    });
                                });
                            } else {
                                this.setCurrentWorkspace(
                                    this.loadCurrentWorkspace()
                                );
                                this.$router.push({
                                    name: 'dashboard',
                                });
                            }
                        }
                    })
                    .catch(() => {
                        this.isLoading = false;
                        this.badEmailAddress = true;
                        this.badPassword = true;
                    });
            } else {
                if (!this.emailAddress) {
                    this.badEmailAddress = true;
                }

                if (!this.password) {
                    this.badPassword = true;
                }
            }
        },
    },
    computed: {
        ...mapGetters(['loadCurrentWorkspace']),
        ...mapState(['invalidCredentials', 'workspaces']),
    },
    created() {
        this.breakingApiVersion = breakingApiVersion;
        this.minimumApiVersion = minimumApiVersion;
        this.conchReleaseUrl = conchReleaseUrl;

        getApiVersion().then(response => {
            const range = `${minimumApiVersion} - ${breakingApiVersion}`;
            let apiVersion = response.data.version;
            let index;

            if (apiVersion.indexOf('-') !== -1) {
                index = apiVersion.indexOf('-');
                apiVersion = apiVersion.slice(0, index);
            }

            this.apiVersion = apiVersion;

            if (!semver.satisfies(apiVersion, range)) {
                this.incompatibleApiVersion = true;
            }
        });
    },
};
</script>
