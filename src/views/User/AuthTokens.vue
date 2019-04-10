<template>
    <div class="tokens">
        <div class="header">
            <span class="subtitle">
                Authentication Tokens
            </span>
            <button
                class="button add is-outlined is-success"
                @click="creatingToken = true"
                v-if="!creatingToken"
            >
                Add Token
            </button>
            <button
                class="button cancel is-outlined is-danger"
                @click="creatingToken = false"
                v-else
            >
                Cancel
            </button>
        </div>
        <div class="card">
            <div class="card-content">
                <div class="content">
                    <ul>
                        <li class="token create" v-if="creatingToken">
                            <i class="fas fa-key has-text-success"></i>
                            <div class="field has-addons">
                                <div class="control">
                                    <input
                                        class="input"
                                        type="text"
                                        placeholder="Token name"
                                        v-model="tokenName"
                                    >
                                </div>
                                <div class="control">
                                    <a
                                        class="button is-success"
                                        @click="save()"
                                    >
                                        Save
                                    </a>
                                </div>
                            </div>
                        </li>
                        <template
                            v-for="token in tokens"
                        >
                            <li
                                class="token"
                                :class="{ 'is-expanded': isTokenExpanded(token.name) }"
                                :key="token.created"
                            >
                                <i class="fas fa-key has-text-success"></i>
                                <a
                                    class="name"
                                    style="text-decoration: none;"
                                    @click="expandToken(token.name)"
                                >
                                    <p>{{ token.name }}</p>
                                </a>
                                <span
                                    class="icon delete-token"
                                    @click="openModal(token.name)"
                                >
                                    <i class="fas fa-trash-alt"></i>
                                </span>
                                <span
                                    class="icon"
                                    @click="expandToken(token.name)">
                                    <i
                                        class="fas fa-angle-up"
                                        aria-hidden="true"
                                        v-if="isTokenExpanded(token.name)"
                                    ></i>
                                    <i
                                        class="fas fa-angle-down"
                                        aria-hidden="true"
                                        v-else
                                    ></i>
                                </span>
                            </li>
                            <li
                                v-if="isTokenExpanded(token.name)"
                                class="token-details"
                                :class="{ 'is-expanded': isTokenExpanded(token.name) }"
                                :key="`${token.created}a`"

                            >
                                <div
                                    class="field is-grouped is-grouped-multiline"
                                >
                                    <div class="control">
                                        <div class="tags has-addons">
                                            <span class="tag is-info">
                                                Expires
                                            </span>
                                            <span class="tag">
                                                {{ token.expires }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="control">
                                        <div class="tags has-addons">
                                            <span class="tag is-info">
                                                Last Used
                                            </span>
                                            <span class="tag">
                                                {{ token.last_used }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="control">
                                        <div class="tags has-addons">
                                            <span class="tag is-info">
                                                Created
                                            </span>
                                            <span class="tag">
                                                {{ token.created }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
        </div>
        <transition name="fade">
            <div class="modal is-active" v-if="deletingToken">
                <div class="modal-background" @click="closeModal()"></div>
                <div
                    class="modal-content"
                    style="border-radius: 5px; width: 475px;"
                >
                    <div class="notification">
                        <button class="delete" @click="closeModal()"></button>
                        <p>
                            Are you sure you want to delete the Authentication Token <strong>{{ tokenName }}</strong>
                        </p>
                        <div class="buttons">
                            <button
                                class="button confirm is-success"
                                @click="removeToken(tokenName)"
                            >
                                    Delete Token
                            </button>
                            <button
                                class="button cancel is-info"
                                @click="closeModal()"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { createToken, deleteToken, getTokens } from '@api/authTokens.js';
import { mapActions, mapState } from 'vuex';

export default {
    data() {
        return {
            creatingToken: false,
            deletingToken: false,
            expandedTokens: [],
            tokens: [
                {
                    name: 'First Token',
                    expires: 'One Year',
                    last_used: 'Today',
                    created: 'Today',
                },
                {
                    name: 'Second Token',
                    expires: 'One Month',
                    last_used: 'Never',
                    created: 'Yesterday',
                },
                {
                    name: 'Third Token',
                    expires: 'Two weeks',
                    last_used: 'Yesterday',
                    created: 'One week ago',
                },
            ],
            tokenName: '',
        };
    },
    methods: {
        ...mapActions([
            'setAuthTokens',
        ]),
        closeModal() {
            this.deletingToken = false;
            this.tokenName = '';
        },
        expandToken(tokenName) {
            if (this.expandedTokens.indexOf(tokenName) === -1) {
                this.expandedTokens.push(tokenName);
            } else {
                this.expandedTokens.splice(this.expandedTokens.indexOf(tokenName), 1);
            }
        },
        isTokenExpanded(tokenName) {
            return this.expandedTokens.indexOf(tokenName) !== -1;
        },
        openModal(tokenName) {
            this.deletingToken = true;
            this.tokenName = tokenName;
        },
        removeToken(name) {
            deleteToken(name)
                .then(() => {
                    this.deleteSuccess = true;
                });
        },
        save() {
            createToken(this.tokenName)
                .then(response => {
                    this.createSuccess = true;
                    this.tokens.unshift(response.data);
                });
        },
    },
    computed: {
        ...mapState([
            'authTokens',
        ]),
    },
    mounted() {
        if (this.authTokens.length) {
            this.tokens = this.authTokens;
        } else {
            getTokens()
                .then(response => {
                    this.tokens = response.data;
                    this.setAuthTokens(this.tokens);
                });
        }
    },
};
</script>
