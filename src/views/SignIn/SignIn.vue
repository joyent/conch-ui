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
                                    <validation-observer v-slot="{ invalid }">
                                        <form>
                                            <div class="sign-in-input">
                                                <div class="field">
                                                    <label
                                                        class="label has-text-left"
                                                    >
                                                        Email
                                                    </label>
                                                    <div
                                                        class="control has-icons-left"
                                                    >
                                                        <validation-provider
                                                            mode="lazy"
                                                            name="Email"
                                                            rules="required|email"
                                                            v-slot="{ errors }"
                                                        >
                                                            <input
                                                                type="text"
                                                                class="input"
                                                                :class="{
                                                                    'has-error': badEmailAddress,
                                                                }"
                                                                placeholder="Email Address"
                                                                v-model="
                                                                    emailAddress
                                                                "
                                                                @keyup.enter="
                                                                    signIn()
                                                                "
                                                            />
                                                            <p
                                                                class="has-text-danger"
                                                                style="margin-top: 6px; font-size: 14px"
                                                                >{{
                                                                    errors[0]
                                                                }}</p
                                                            >
                                                        </validation-provider>
                                                        <span
                                                            class="icon is-left"
                                                        >
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
                                                        <validation-provider
                                                            mode="lazy"
                                                            name="Password"
                                                            rules="required"
                                                            v-slot="{ errors }"
                                                        >
                                                            <input
                                                                type="password"
                                                                class="input"
                                                                :class="{
                                                                    'has-error': badPassword,
                                                                }"
                                                                placeholder="Password"
                                                                v-model="
                                                                    password
                                                                "
                                                                @keyup.enter="
                                                                    signIn()
                                                                "
                                                                autocomplete="password"
                                                            />
                                                            <p
                                                                class="has-text-danger"
                                                                style="font-size: 14px; padding-top: 6px;"
                                                                >{{
                                                                    errors[0]
                                                                }}</p
                                                            >
                                                            <span
                                                                class="icon is-left"
                                                            >
                                                                <i
                                                                    class="material-icons has-text-danger"
                                                                    v-if="
                                                                        badPassword
                                                                    "
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
                                                        </validation-provider>
                                                    </div>
                                                </div>
                                                <a
                                                    class="button button-sign-in is-info is-fullwidth"
                                                    :class="{
                                                        'is-loading': isLoading,
                                                    }"
                                                    @click="
                                                        incompatibleApiVersion ||
                                                        invalid
                                                            ? null
                                                            : signIn()
                                                    "
                                                    :disabled="
                                                        incompatibleApiVersion ||
                                                            invalid
                                                    "
                                                >
                                                    Sign In
                                                </a>
                                            </div>
                                        </form>
                                    </validation-observer>
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
import semver from 'semver';
import { getApiVersion } from '@api/conchApiVersion.js';
import { mapActions, mapState } from 'vuex';
import { login } from '@api/authentication.js';
import { getCurrentUser } from '@api/users.js';
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';

// Extends vee-validate rule messages
extend('email', {
    ...email,
    message: 'Email is not valid',
});
extend('required', {
    ...required,
    message: 'This field is required',
});

import {
    breakingApiVersion,
    conchReleaseUrl,
    minimumApiVersion,
} from '@src/config.js';

export default {
    components: {
        ValidationObserver,
        ValidationProvider,
    },
    data() {
        return {
            apiVersion: '',
            badEmailAddress: false,
            badPassword: false,
            breakingApiVersion: '',
            conchReleaseUrl: '',
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
        ...mapActions(['setCurrentUser', 'setForcePasswordChange']),
        async signIn() {
            if (this.emailAddress && this.password) {
                this.isLoading = true;

                login(this.emailAddress, this.password)
                    .then(async response => {
                        if (
                            response.headers &&
                            response.headers.location &&
                            response.headers.location === '/user/me/password'
                        ) {
                            this.setForcePasswordChange();
                            this.$router.push({ name: 'passwordReset' });
                        } else {
                            await getCurrentUser().then(response => {
                                this.setCurrentUser(response.data);
                            });

                            if (
                                this.$route.query &&
                                this.$route.query.redirect
                            ) {
                                this.$router.push({
                                    path: this.$route.query.redirect,
                                });
                            } else {
                                this.$router.push({ name: 'builds' });
                            }
                        }
                    })
                    .catch(error => {
                        this.isLoading = false;
                        this.badEmailAddress = true;
                        this.badPassword = true;

                        let errorMessage;

                        if (
                            error.response &&
                            error.response.data &&
                            error.response.data.error
                        ) {
                            errorMessage = `Error: ${error.response.data.error}`;
                        } else {
                            errorMessage = 'An error occurred';
                        }

                        this.$toasted.error(errorMessage, {
                            action: [
                                {
                                    icon: 'close',
                                    onClick: (e, toastObject) => {
                                        toastObject.goAway(0);
                                    },
                                },
                            ],
                            duration: 8000,
                            icon: 'error',
                        });
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
        ...mapState(['invalidCredentials']),
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
