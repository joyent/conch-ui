<template>
    <div class="authentication-tokens">
        <section class="content">
            <div class="columns" v-if="viewUsers">
                <div class="column">
                    <Spinner v-if="!users.length" />
                    <div class="box is-paddingless" v-else>
                        <div class="auth-users-table">
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
                            <table
                                class="table is-hoverable is-fullwidth"
                                v-if="filteredUsers && filteredUsers.length"
                            >
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
                                                @click="openModalMultipleTokens('login', user)"
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
                <div class="column" v-if="selectedUser && viewTokens">
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
                                @click="closeTokenList()"
                            >
                                <i
                                    class="fas fa-lg fa-long-arrow-alt-left"
                                    style="margin-right: 10px"
                                ></i>
                                Back to User List
                            </button>
                        </div>
                    </div>
                    <div class="box is-paddingless">
                        <div class="user-authentication-tokens">
                            <div class="authentication-tokens-table">
                                <div
                                    class="table-filter"
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
                                        <div style="text-align: right; padding: 12px;">
                                            <button
                                                class="button is-danger"
                                                @click="openModalMultipleTokens('auth')"
                                                v-if="tokens && tokens.length"
                                            >
                                                Delete Auth Tokens
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <table
                                    class="table is-hoverable is-fullwidth"
                                    v-if="filteredTokens && filteredTokens.length"
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
                                            <td v-if="token.last_used">
                                                {{ getDate(token.last_used) }}
                                            </td>
                                            <td v-else>Never</td>
                                            <td>{{ getDate(token.created) }}</td>
                                            <td class="has-text-centered">
                                                <span
                                                    class="icon delete-token"
                                                    @click="openModalSingleToken(token.name)"
                                                >
                                                    <i class="fas fa-trash-alt"></i>
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="tokens && !tokens.length"
                        style="padding: 40px;"
                    >
                        <p class="title is-5 has-text-centered">
                            <strong class="has-text-white">{{ selectedUser.name }}</strong> does not have any auth tokens.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <div
            class="no-results"
            v-if="noSearchResultsTokens || noSearchResultsUsers"
        >
            <p class="title is-5" style="padding: 40px;">No Search Results Found.</p>
        </div>
        <transition name="fade">
            <BaseModal v-if="deleting">
                <template v-slot:icon>
                    <i class="far fa-4x fa-times-circle has-text-danger"></i>
                </template>
                <template v-slot:title>
                    <h1 class="title" v-if="tokenType">
                        Delete Tokens?
                    </h1>
                    <h1 class="title" v-else>
                        Delete Token?
                    </h1>
                </template>
                <template v-slot:body>
                    <p class="subtitle" v-if="tokenType">
                        Are you sure you want to delete the {{ tokenType }} tokens for <strong class="has-text-white">{{ selectedUser.name }}</strong>?
                    </p>
                    <p class="subtitle" v-else>
                        Are you sure you want to delete <strong class="has-text-white">{{ tokenName }}</strong>?
                    </p>
                </template>
                <template v-slot:footer>
                    <a
                        class="button confirm is-success is-fullwidth"
                        @click="deleteLoginTokens()"
                        v-if="tokenType && tokenType === 'login'"
                    >
                        Delete Tokens
                        <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                    </a>
                    <a
                        class="button confirm is-success is-fullwidth"
                        @click="deleteAuthTokens()"
                        v-else-if="tokenType && tokenType === 'auth'"
                    >
                        Delete Tokens
                        <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                    </a>
                    <a
                        class="button confirm is-success is-fullwidth"
                        @click="deleteToken(tokenName)"
                        v-else
                    >
                        Delete Token
                        <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                    </a>
                </template>
            </BaseModal>
            <BaseModal v-else-if="deleteSuccess">
                <template v-slot:icon>
                    <i class="far fa-4x fa-check-circle has-text-success"></i>
                </template>
                <template v-slot:title>
                    <h1 class="title">
                        Success!
                    </h1>
                </template>
                <template v-slot:body>
                    <p class="subtitle" v-if="deletingAuthTokens">
                        <strong class="has-text-white">{{ selectedUser.name }}</strong>'s auth tokens have been deleted.
                    </p>
                    <p class="subtitle" v-else-if="deletingLoginTokens">
                        <strong class="has-text-white">{{ selectedUser.name }}</strong>'s login tokens have been deleted.
                    </p>
                    <p class="subtitle" v-else>
                        <strong class="has-text-white">{{ tokenName }}</strong> has been deleted.
                    </p>
                </template>
                <template v-slot:footer>
                    <a
                        class="button confirm is-success is-fullwidth"
                        @click="closeModal()"
                    >
                        Great!
                        <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                    </a>
                </template>
            </BaseModal>
        </transition>
    </div>
</template>

<script>
import search from "fuzzysearch";
import moment from 'moment';
import { EventBus } from '@src/eventBus.js';
import Spinner from '@src/views/components/Spinner.vue';
import BaseModal from '@src/views/components/BaseModal.vue';
import {
    deleteUserToken,
    deleteUserTokens,
    getTokens,
    getUser,
    getUserTokens,
    getUsers
} from '@api/users.js';
import { logout } from '@api/authentication.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        BaseModal,
        Spinner,
    },
    data() {
        return {
            deleteSuccess: false,
            deleting: false,
            deletingAuthTokens: false,
            deletingLoginTokens: false,
            searchTextTokens: '',
            searchTextUsers: '',
            selectedUser: null,
            tokenName: '',
            tokenType: '',
            tokens: null,
            viewTokens: false,
            viewUsers: true,
        };
    },
    methods: {
        ...mapActions([
            'setUserAuthTokens',
            'setUsers',
        ]),
        closeModal() {
            this.deleting = false;
            this.deletingAuthTokens = false,
            this.deletingLoginTokens = false,
            this.deleteSuccess = false;
            this.tokenName = '';
        },
        closeTokenList() {
            this.viewTokens = false;
            this.viewUsers = true;
            this.selectedUser = null;
            this.tokens = null;
        },
        deleteToken(tokenName) {
            deleteUserToken(tokenName, this.selectedUser.id)
                .then(response => {
                    this.deleting = false;
                    this.deleteSuccess = true;

                    this.setTokens(this.selectedUser.id);
                });
        },
        deleteAuthTokens() {
            const params = { api_only: 1 };
            const userId = this.selectedUser.id;
            this.deletingAuthTokens = true;

            deleteUserTokens(userId, params)
                .then(() => {
                    this.deleting = false;
                    this.deleteSuccess = true;

                    this.setTokens(userId);
                });
        },
        deleteLoginTokens() {
            const params = { login_only: 1 };
            const userId = this.selectedUser.id;
            this.deletingLoginTokens = true;

            deleteUserTokens(userId, params)
                .then(() => {
                    this.deleting = false;
                    this.deleteSuccess = true;

                    // if (userId === this.currentUser.id) {
                    //     logout();
                    // }
                });
        },
        getDate(date) {
            return moment(date).fromNow();
        },
        openModalSingleToken(tokenName) {
            this.deleting = true;
            this.tokenName = tokenName;
        },
        openModalMultipleTokens(tokenType, user = null) {
            this.deleting = true;
            this.tokenType = tokenType;

            if (user) {
                this.selectedUser = user;
            }
        },
        selectUser(user) {
            this.selectedUser = user;
            this.viewUsers = false;
            this.viewTokens = true;
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
        noSearchResultsTokens() {
            return this.searchTextTokens && this.filteredTokens && !this.filteredTokens.length;
        },
        noSearchResultsUsers() {
            return this.searchTextUsers && this.filteredUsers && !this.filteredUsers.length;
        },
    },
    mounted() {
        if (this.$route && this.$route.params && this.$route.params.userId) {
            this.viewUsers = false;
            this.viewTokens = true;
            const userId = this.$route.params.userId;

            getUser(userId)
                .then(response => {
                    this.selectedUser = response.data;
                    this.setTokens(userId);
                });
        } else if (!this.users.length) {
            getUsers()
                .then(response => {
                    this.setUsers(response.data);
                });
        }

        EventBus.$on('closeModal:baseModal', () => {
            this.closeModal();
        });
    },
};
</script>
