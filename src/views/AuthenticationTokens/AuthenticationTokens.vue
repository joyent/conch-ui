<template>
    <div class="authentication-tokens">
        <section class="content">
            <div class="columns" v-if="!selectedUser">
                <div class="column">
                    <div class="box is-paddingless">
                        <Spinner v-if="!users.length" />
                        <div class="auth-users-table" v-else>
                            <div class="table-filter" >
                                <div class="columns is-vcentered">
                                    <div class="column">
                                        <h1 class="title is-3 is-marginless">
                                            Users
                                        </h1>
                                    </div>
                                    <div class="column is-3">
                                        <div class="field">
                                            <p class="control has-icons-left has-icons-right">
                                                <input
                                                    class="input search"
                                                    type="text"
                                                    placeholder="Search Users"
                                                    v-model="searchTextUsers"
                                                >
                                                <span class="icon is-small is-left">
                                                    <i class="fas fa-search"></i>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table class="table is-hoverable is-fullwidth">
                                <thead>
                                    <th></th>
                                    <th>Name</th>
                                    <th></th>
                                </thead>
                                <tfoot>
                                    <th></th>
                                    <th>Name</th>
                                    <th></th>
                                </tfoot>
                                <tbody>
                                    <tr
                                        v-for="user in filteredUsers"
                                        :key="user.id"
                                        :class="{ 'is-selected': selectedUser && selectedUser.id === user.id }"
                                    >
                                        <td style="width: 50px;">
                                            <span style="margin-right: 20px;">
                                                <i class="fas fa-2x fa-user-circle"></i>
                                            </span>
                                        </td>
                                        <td>{{ user.name }}</td>
                                        <td class="btn-group">
                                            <button
                                                class="button is-info"
                                                @click="selectUser(user)"
                                            >
                                                <i
                                                    class="far fa-eye"
                                                    style="margin-right: 10px;"
                                                ></i>
                                                Auth Tokens
                                            </button>
                                            <button
                                                class="button is-danger"
                                                @click="openModal()"
                                            >
                                                <i
                                                    class="fas fa-trash-alt"
                                                    style="margin-right: 10px;"
                                                ></i>
                                                Login Tokens
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="columns">
                <div class="column" v-if="selectedUser">
                    <div
                        class="box selected-user"
                        style="margin-bottom: 12px;"
                    >
                        <div
                            class="user-heading is-flex"
                            style="align-items: center; justify-content: center;"
                        >
                            <span style="margin-right: 20px;">
                                <i class="fas fa-2x fa-user-circle"></i>
                            </span>
                            <span
                                class="title is-5 username is-marginless"
                                style="flex-grow: 1;"
                            >
                                {{ selectedUser.name }}
                            </span>
                            <button
                                class="button is-info"
                                @click="selectedUser = null"
                            >
                                <i
                                    class="fas fa-lg fa-long-arrow-alt-left"
                                    style="margin-right: 10px"
                                ></i>
                                Back to Users List
                            </button>
                        </div>
                    </div>
                    <div class="box is-paddingless">
                        <div
                            class="user-authentication-tokens"
                        >
                            <div class="authentication-tokens-table">
                                <div
                                    class="table-filter"
                                    v-if="filteredTokens.length"
                                >
                                    <div class="columns is-vcentered">
                                        <div class="column">
                                            <h1 class="title is-4 is-marginless">
                                                Authentication Tokens
                                            </h1>
                                        </div>
                                        <div class="column is-3">
                                            <div class="field">
                                                <p class="control has-icons-left has-icons-right">
                                                    <input
                                                        class="input search"
                                                        type="text"
                                                        placeholder="Search Tokens"
                                                        v-model="searchTextTokens"
                                                    >
                                                    <span class="icon is-small is-left">
                                                        <i class="fas fa-search"></i>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <transition name="fade-in-slow">
                                    <table
                                        class="table is-hoverable is-fullwidth"
                                        v-if="filteredTokens.length"
                                    >
                                        <thead>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Last Used</th>
                                            <th>Created</th>
                                            <th></th>
                                        </thead>
                                        <tfoot>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Last Used</th>
                                            <th>Created</th>
                                            <th></th>
                                        </tfoot>
                                        <tbody>
                                            <tr
                                                v-for="(token, i) in filteredTokens"
                                                :key="token.id"
                                            >
                                                <td class="has-text-centered">
                                                    <span>{{ i + 1 }}</span>
                                                </td>
                                                <td>{{ token.name }}</td>
                                                <td v-if="token.last_used">{{ getDate(token.last_used) }}</td>
                                                <td v-else>Never</td>
                                                <td>{{ getDate(token.created) }}</td>
                                                <td class="has-text-centered">
                                                    <span
                                                        class="icon delete-token"
                                                        @click="openModal()"
                                                    >
                                                        <i class="fas fa-trash-alt"></i>
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="no-results" v-if="!filteredTokens.length && searchTextTokens">
                                        <p class="title">No Search Results Found.</p>
                                        <img
                                            src="../../assets/no-search-results.svg"
                                            width="30%"
                                        >
                                    </div>
                                    <div v-if="!tokens.length" style="padding: 40px;">
                                        <p class="title is-5 has-text-centered">
                                            <span class="has-text-white has-text-weight-bold">{{ selectedUser.name }}</span> does not have any auth tokens.
                                        </p>
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <transition name="fade">
            <ConfirmationModal v-if="deleting">
                <template v-slot:icon>
                    <i class="far fa-4x fa-times-circle has-text-danger"></i>
                </template>
                <template v-slot:title>
                    <h1 class="title">Delete Token?</h1>
                </template>
                <template v-slot:subtitle>
                    <p class="subtitle">
                        Are you sure you want to delete <strong class="name">{{ tokenName }}</strong>?
                    </p>
                </template>
                <template v-slot:footer>
                    <a
                        class="button confirm is-success is-fullwidth"
                        @click="deleteToken(tokenName)"
                    >
                        Delete Token
                        <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                    </a>
                </template>
            </ConfirmationModal>

            <div class="modal is-active" v-else-if="deletingTokens">
                <div class="modal-background" @click="closeModal()"></div>
                <div
                    class="modal-content"
                    style="border-radius: 5px;"
                >
                    <div class="notification">
                        <button
                            class="delete is-medium"
                            @click="closeModal()"
                        ></button>
                        <div class="columns is-vcentered">
                            <div class="column is-2">
                                <i class="fas fa-4x fa-key has-text-danger"></i>
                            </div>
                            <div class="column">
                                <p
                                    class="subtitle has-text-centered is-4"
                                    style="margin-bottom: 20px;"
                                >
                                    Which tokens do you want to delete?
                                </p>
                                <div class="toggle-switches" style="margin: 25px 0">
                                    <div class="field" style="margin-bottom: 0;">
                                        <label class="switch">
                                            <input
                                                type="checkbox"
                                                :checked="deleteLoginTokens"
                                                v-model="deleteLoginTokens"
                                                :true-value="true"
                                                :false-value="false"
                                            >
                                            <span class="slider round is-success"></span>
                                        </label>
                                        <span style="margin-left: 8px;">
                                            <strong>Login Tokens</strong>
                                        </span>
                                    </div>
                                    <div class="field">
                                        <label class="switch">
                                            <input
                                                type="checkbox"
                                                :checked="deleteAuthTokens"
                                                v-model="deleteAuthTokens"
                                                :true-value="true"
                                                :false-value="false"
                                            >
                                            <span class="slider round is-success"></span>
                                        </label>
                                        <span style="margin-left: 8px;">
                                            <strong>Auth Tokens</strong>
                                        </span>
                                    </div>
                                </div>
                                <div class="field is-grouped">
                                    <div class="control" style="flex-grow: 1">
                                        <button
                                            class="button is-danger is-fullwidth"
                                            @click="deleteTokens()"
                                            :disabled="!deleteLoginTokens && !deleteAuthTokens"
                                        >
                                            <span v-if="!deleteLoginTokens && !deleteAuthTokens">Delete Tokens</span>
                                            <span v-else-if="deleteLoginTokens && !deleteAuthTokens">Delete Login Tokens</span>
                                            <span v-else-if="!deleteLoginTokens && deleteAuthTokens">Delete Auth Tokens</span>
                                            <span v-else-if="deleteLoginTokens && deleteAuthTokens">Delete Login and Auth Tokens</span>
                                        </button>
                                    </div>
                                    <div class="control" style="flex-grow: 1">
                                        <button
                                            class="button is-info is-fullwidth"
                                            @click="closeModal()"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ResultModal v-else-if="deleteSuccess">
                <template v-slot:icon>
                    <i class="far fa-4x fa-check-circle has-text-success"></i>
                </template>
                <template v-slot:title>Success!</template>
                <template v-slot:subtitle>
                    <p class="subtitle" v-if="deleteSuccess">
                        <strong class="has-text-white">{{ tokenName }}</strong> has been deleted.
                    </p>
                </template>
            </ResultModal>
        </transition>
    </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import search from "fuzzysearch";
import moment from 'moment';
import Spinner from '@src/views/components/Spinner.vue';
import ConfirmationModal from '@src/views/components/ConfirmationModal.vue';
import ResultModal from '@src/views/User/ResultModal.vue';
import {
    deleteUserToken,
    deleteUserTokens,
    getTokens,
    getUser,
    getUserTokens,
    getUsers
} from '@api/users.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        ConfirmationModal,
        ResultModal,
        Spinner,
    },
    data() {
        return {
            deleteAuthTokens: false,
            deleteLoginTokens: false,
            deleteSuccess: false,
            deleteLoginTokens: false,
            deleting: false,
            deletingTokens: false,
            searchTextTokens: '',
            searchTextUsers: '',
            selectedUser: null,
            tokenName: '',
            tokenType: '',
            tokens: [],
        };
    },
    methods: {
        ...mapActions([
            'setUserAuthTokens',
            'setUsers',
        ]),
        closeModal() {
            this.deleting = false;
            this.deletingTokens = false;
            this.deleteSuccess = false;
            this.deleteAuthTokens = false;
            this.deleteLoginTokens = false;
            this.deleteUserLoginTokens = false;
            this.tokenName = '';
        },
        deleteToken(tokenName) {
            deleteUserToken(tokenName, this.selectedUser.id)
                .then(response => {
                    this.deleting = false;
                    this.deleteSuccess = true;

                    this.setTokens(this.selectedUser.id);
                });
        },
        deleteTokens() {
            const userId = this.selectedUser.id;
            let params = {};

            if (this.deleteAuthTokens) {
                params = { login_only: 0 };

                if (this.deleteLoginTokens) {
                    deleteUserTokens(userId, params)
                        .then(() => {
                            params = { api_only: 0 };

                            deleteUserTokens(userId, params)
                                .then(() => {
                                    // this.setTokens(userId);
                                })
                        });
                } else {
                    deleteUserTokens(userId, params)
                        .then(() => {
                            // this.setTokens(userId);
                        });
                }
            } else if (this.deleteLoginTokens) {
                params = { api_only: 0 };

                deleteUserTokens(userId, params)
                    .then(() => {
                        // this.setTokens(userId);
                    })
            }
        },
        deleteLoginTokens(userId) {
            const params = { login_only: 0 };

            deleteUserTokens(userId, params)
                .then(() => {
                    // this.setTokens(userId)
                });
        },
        getDate(date) {
            return moment(date).fromNow();
        },
        isEmpty,
        openModal(tokenType, tokenName) {
            this.deleting = true;
            this.tokenType = tokenType;

            if (tokenType === 'auth') {
                this.tokenName = tokenName;
            }
        },
        getSelectedUser() {
            if (this.$route && this.$route.params) {
                const routeParams = this.$route.params;

                if (routeParams.userId) {
                    const userId = routeParams.userId;

                    getUser(userId)
                        .then(response => {
                            this.selectedUser = response.data;
                        });

                    this.setTokens(userId);
                }
            }
        },
        selectUser(user) {
            this.selectedUser = user;
            this.searchTextUsers = '';

            this.setTokens(user.id);
        },
        setTokens(userId) {
            getUserTokens(userId)
                .then(response => {
                    const tokens = response.data;
                    this.tokens = tokens;

                    if (this.selectedUser) {
                        if (this.currentUser.id === this.selectedUser.id) {
                            this.setUserAuthTokens(tokens);
                        }
                    }
                });
        },
    },
    computed: {
        ...mapState([
            'currentUser',
            'users',
        ]),
        filteredTokens() {
            let searchText = this.searchTextTokens.toLowerCase();
            let tokens = this.tokens;

            if (searchText) {
                return tokens.reduce((acc, token) => {
                    const tokenName = token.name.toLowerCase();

                    if (search(searchText, tokenName)) {
                        acc.push(token);
                    }

                    return acc;
                }, []);
            }

            return tokens;
        },
        filteredUsers() {
            const searchText = this.searchTextUsers.toLowerCase();
            let users = this.users;

            if (this.userFilter === 'admins') {
                users = users.filter(user => user.is_admin === true);
            } else if (this.userFilter === 'users') {
                users = users.filter(user => user.is_admin === false);
            }

            if (searchText) {
                return users.reduce((acc, user) => {
                    const name = user.name.toLowerCase();
                    const email = user.email.toLowerCase();

                    if (
                        search(searchText, name) ||
                        search(searchText, email)
                    ) {
                        acc.push(user);
                    }

                    return acc;
                }, []);
            }

            return users;
        },
    },
    mounted() {
        if (!this.users.length) {
            getUsers()
                .then(response => {
                    this.setUsers(response.data);
                    this.getSelectedUser();
                });
        } else {
            this.getSelectedUser();
        }
    },
};
</script>
