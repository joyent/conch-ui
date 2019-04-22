<template>
    <div class="authentication-tokens">
        <section class="content">
            <div class="columns">
                <div class="column">
                    <div class="box">
                        <Spinner v-if="!users.length" />
                        <div class="auth-users-table" v-else>
                            <div class="table-filter" >
                                <div class="columns is-vcentered">
                                    <div class="column">
                                        <h1 class="title is-5">Users</h1>
                                    </div>
                                    <div class="column is-5">
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
                                    <th>Actions</th>
                                </thead>
                                <tfoot>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tfoot>
                                <tbody>
                                    <tr
                                        v-for="(user, i) in filteredUsers"
                                        :key="user.id"
                                    >
                                        <td class="has-text-centered">
                                            <span>{{ i + 1 }}</span>
                                        </td>
                                        <td>{{ user.name }}</td>
                                        <td>
                                            <div class="control">
                                                <button class="button is-info" @click="selectUser(user)">
                                                    View Tokens
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="box">
                        <div class="user-authentication-tokens" v-if="selectedUser">
                            <div
                                class="box selected-user is-flex"
                                style="margin-bottom: 20px; align-items: center;"
                            >
                                <span style="margin-right: 20px;">
                                    <i class="fas fa-2x fa-user-circle"></i>
                                </span>
                                <span
                                    class="title is-4 username"
                                    style="flex-grow: 1;"
                                >
                                    {{ selectedUser.name }}
                                </span>
                            </div>
                            <div class="authentication-tokens-table">
                                <div class="table-filter" v-if="filteredTokens.length">
                                    <div class="columns is-vcentered">
                                        <div class="column">
                                            <h1 class="title is-4">Tokens</h1>
                                        </div>
                                        <div class="column is-5">
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
                                            <th>Actions</th>
                                        </thead>
                                        <tfoot>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Last Used</th>
                                            <th>Created</th>
                                            <th>Actions</th>
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
                                                <td>
                                                    <div class="field is-grouped">
                                                        <div class="control">
                                                            <button
                                                                class="button is-success tooltip is-tooltip-top is-tooltip-info"
                                                                data-tooltip="Reset Token"
                                                            >
                                                                <span
                                                                    class="icon reset-token"
                                                                >
                                                                    <i class="fas fa-sync-alt"></i>
                                                                </span>
                                                            </button>
                                                        </div>
                                                        <div class="control">
                                                            <button
                                                                class="button is-danger tooltip is-tooltip-top is-tooltip-info"
                                                                data-tooltip="Delete Token"
                                                                @click="openModal(token.name)"
                                                            >
                                                                <span
                                                                    class="icon delete-token"
                                                                >
                                                                    <i class="fas fa-trash-alt"></i>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
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
                                    <div v-if="!filteredTokens.length" style="padding: 40px;">
                                        <p class="title is-4 has-text-centered">
                                            <span class="has-text-white has-text-weight-bold">{{ selectedUser.name }}</span> does not have any tokens.
                                        </p>
                                    </div>
                                </transition>
                            </div>
                        </div>
                        <div v-else>
                            <p class="subtitle has-text-centered" style="padding: 50px 0">Select a user to view tokens.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <transition name="fade">
            <div class="modal is-active" v-if="deletingToken">
                <div class="modal-background" @click="closeModal()"></div>
                <div
                    class="modal-content"
                    style="border-radius: 5px; width: 520px;"
                >
                    <div class="notification">
                        <button class="delete" @click="closeModal()"></button>
                        <p class="subtitle" style="margin-bottom: 20px;">
                            Are you sure you want to delete <strong class="has-text-white">{{ tokenName }}</strong>?
                        </p>
                        <div class="field is-grouped">
                            <div class="control">
                                <button
                                    class="button confirm is-success"
                                    @click="deleteToken(tokenName)"
                                >
                                        Delete Token
                                </button>
                            </div>
                            <div class="control">
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
            </div>
            <ResultModal v-else-if="deleteSuccess">
                <template v-slot:icon>
                    <i class="far fa-3x fa-check-circle has-text-success"></i>
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
import ResultModal from '@src/views/User/ResultModal.vue';
import { deleteUserToken, getTokens, getUser, getUserTokens, getUsers } from '@api/users.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        ResultModal,
        Spinner,
    },
    data() {
        return {
            deleteSuccess: false,
            deletingToken: false,
            searchTextTokens: '',
            searchTextUsers: '',
            selectedUser: null,
            tokenName: '',
            tokens: [],
        };
    },
    methods: {
        ...mapActions([
            'setUserAuthTokens',
            'setUsers',
        ]),
        closeModal() {
            this.deletingToken = false;
            this.deleteSuccess = false;
            this.tokenName = '';
        },
        deleteToken(tokenName) {
            deleteUserToken(tokenName, this.selectedUser.id)
                .then(response => {
                    this.deletingToken = false;
                    this.deleteSuccess = true;

                    this.setTokens(this.selectedUser.id);
                });
        },
        getDate(date) {
            return moment(date).fromNow();
        },
        isEmpty,
        openModal(tokenName) {
            this.deletingToken = true;
            this.tokenName = tokenName;
        },
        selectUser(user) {
            this.selectedUser = user;
            this.searchText = '';

            this.setTokens(user.id);
        },
        setTokens(userId) {
            getUserTokens(userId)
                .then(response => {
                    const tokens = response.data;

                    this.tokens = tokens;

                    if (this.currentUser.id === this.selectedUser.id) {
                        this.setUserAuthTokens(tokens);
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
        if (!isEmpty(this.user)) {
            this.selectedUser = this.user;
        } else {
            if (!this.users.length) {
                getUsers()
                    .then(response => {
                        this.setUsers(response.data);
                    });
            }
        }

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
        } else {
            this.$refs.userSearch.focus()
        }
    },
};
</script>
