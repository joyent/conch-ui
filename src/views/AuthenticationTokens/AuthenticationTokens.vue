<template>
    <div class="authentication-tokens">
        <div class="columns" v-if="viewUsers">
            <div class="column">
                <Spinner v-if="!users.length" />
                <div class="box is-paddingless" v-else>
                    <div class="auth-users-table">
                        <div
                            class="table-header"
                            style="border-top-left-radius: 5px; border-top-right-radius: 5px;"
                        >
                            <h1 class="title is-3">Users</h1>
                            <div class="table-filter">
                                <div class="control has-icons-left has-icons-right">
                                    <input
                                        class="input search"
                                        type="text"
                                        placeholder="Search Users"
                                        v-model="searchTextUsers"
                                    >
                                    <span class="icon is-small is-left">
                                        <i class="fas fa-search"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <table
                            class="table is-hoverable is-fullwidth is-marginless"
                            v-if="filteredUsers && filteredUsers.length"
                        >
                            <thead>
                                <th></th>
                                <th>
                                    <a
                                        class="table-header-filter username"
                                        :class="{ 'has-text-white': sortFilter === 'name' }"
                                        @click="sortUsersBy('name')"
                                    >
                                        User Name
                                        <i
                                            class="fas fa-angle-down"
                                            v-if="sortFilter === 'name' && !reversedSort"
                                            style="margin-left: 10px;"
                                        ></i>
                                        <i
                                            class="fas fa-angle-up"
                                            v-else-if="sortFilter === 'name' && reversedSort"
                                            style="margin-left: 10px;"
                                        ></i>
                                    </a>
                                </th>
                                <th></th>
                            </thead>
                            <tfoot>
                                <th></th>
                                <th>User Name</th>
                                <th></th>
                            </tfoot>
                            <tbody>
                                <tr
                                    class="row"
                                    v-for="user in paginatedResults(filteredUsers)"
                                    :key="user.id"
                                    :class="{ 'is-selected': selectedUser && selectedUser.id === user.id }"
                                >
                                    <td style="width: 50px;">
                                        <span style="margin-right: 20px;">
                                            <i class="fas fa-2x fa-user-circle"></i>
                                        </span>
                                    </td>
                                    <td class="username">
                                        {{ user.name }}
                                    </td>
                                    <td>
                                        <a
                                            class="button view-auth-tokens is-info"
                                            @click="selectUser(user)"
                                            style="margin-right: 10px;"
                                        >
                                            <i
                                                class="far fa-eye"
                                                style="margin-right: 10px;"
                                            ></i>
                                            Auth Tokens
                                        </a>
                                        <a
                                            class="button delete-login-tokens is-danger"
                                            @click="openModalMultipleTokens('login', user)"
                                        >
                                            <i
                                                class="fas fa-trash-alt"
                                                style="margin-right: 10px;"
                                            ></i>
                                            Login Tokens
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <TablePagination :total-results="filteredUsers.length" />
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
                            class="title is-5 name is-marginless"
                            style="flex-grow: 1;"
                        >
                            {{ selectedUser.name }}
                        </span>
                        <a
                            class="button close-token-list is-info"
                            @click="closeTokenList()"
                        >
                            <i
                                class="fas fa-lg fa-long-arrow-alt-left"
                                style="margin-right: 10px"
                            ></i>
                            Back to User List
                        </a>
                    </div>
                </div>
                <div class="box is-paddingless">
                    <div class="user-authentication-tokens">
                        <div class="authentication-tokens-table">
                            <div
                                class="table-header"
                                style="border-top-left-radius: 5px; border-top-right-radius: 5px;"
                            >
                                <h1 class="title is-4">
                                    Authentication Tokens
                                </h1>
                                <div class="table-filter">
                                    <div class="control has-icons-left has-icons-right">
                                        <input
                                            class="input search"
                                            type="text"
                                            placeholder="Search Tokens"
                                            v-model="searchTextTokens"
                                        >
                                        <span
                                            class="icon is-small is-left"
                                        >
                                            <i class="fas fa-search"></i>
                                        </span>
                                    </div>
                                    <div
                                        v-if="sortedTokens && sortedTokens.length"
                                    >
                                        <a
                                            class="button delete-auth-tokens is-danger"
                                            @click="openModalMultipleTokens('auth')"
                                        >
                                            Delete Auth Tokens
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <table
                                class="table is-hoverable is-fullwidth"
                                v-if="filteredTokens && filteredTokens.length"
                            >
                                <thead>
                                    <th></th>
                                    <th>
                                        <a
                                            class="table-header-filter token-name"
                                            :class="{ 'has-text-white': sortFilter === 'name' }"
                                            @click="sortTokensBy('name')"
                                        >
                                            Token Name
                                            <i
                                                class="fas fa-angle-down"
                                                v-if="sortFilter === 'name' && !reversedSort"
                                                style="margin-left: 10px;"
                                            ></i>
                                            <i
                                                class="fas fa-angle-up"
                                                v-else-if="sortFilter === 'name' && reversedSort"
                                                style="margin-left: 10px;"
                                            ></i>
                                        </a>
                                    </th>
                                    <th>
                                        <a
                                            class="table-header-filter last-used"
                                            :class="{ 'has-text-white': sortFilter === 'last_used' }"
                                            @click="sortTokensBy('last_used')"
                                        >
                                            Last Used
                                            <i
                                                class="fas fa-angle-down"
                                                v-if="sortFilter === 'last_used' && !reversedSort"
                                                style="margin-left: 10px;"
                                            ></i>
                                            <i
                                                class="fas fa-angle-up"
                                                v-else-if="sortFilter === 'last_used' && reversedSort"
                                                style="margin-left: 10px;"
                                            ></i>
                                        </a>
                                    </th>
                                    <th>
                                        <a
                                            class="table-header-filter created"
                                            :class="{ 'has-text-white': sortFilter === 'created' }"
                                            @click="sortTokensBy('created')"
                                        >
                                            Created
                                            <i
                                                class="fas fa-angle-down"
                                                v-if="sortFilter === 'created' && !reversedSort"
                                                style="margin-left: 10px;"
                                            ></i>
                                            <i
                                                class="fas fa-angle-up"
                                                v-else-if="sortFilter === 'created' && reversedSort"
                                                style="margin-left: 10px;"
                                            ></i>
                                        </a>
                                    </th>
                                    <th></th>
                                </thead>
                                <tfoot>
                                    <th></th>
                                    <th>Token Name</th>
                                    <th>Last Used</th>
                                    <th>Created</th>
                                    <th></th>
                                </tfoot>
                                <tbody>
                                    <tr
                                        class="token"
                                        v-for="(token, i) in filteredTokens"
                                        :key="token.id"
                                    >
                                        <td class="has-text-centered">
                                            <span>{{ i + 1 }}</span>
                                        </td>
                                        <td class="token-name">{{ token.name }}</td>
                                        <td v-if="token.last_used">
                                            {{ getDate(token.last_used) }}
                                        </td>
                                        <td v-else>Never</td>
                                        <td>{{ getDate(token.created) }}</td>
                                        <td
                                            class="has-text-right"
                                            style="padding: 15px; 20px;"
                                        >
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
                    v-if="sortedTokens && !sortedTokens.length"
                    style="padding: 40px;"
                >
                    <p class="title no-tokens is-5 has-text-centered">
                        <strong class="has-text-white">{{ selectedUser.name }}</strong> does not have any auth tokens.
                    </p>
                </div>
            </div>
        </div>
        <div
            class="no-results"
            v-if="noSearchResultsTokens || noSearchResultsUsers"
        >
            <p class="title is-5" style="padding: 40px;">
                No Search Results Found.
            </p>
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
                        Delete Login Tokens
                        <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                    </a>
                    <a
                        class="button confirm is-success is-fullwidth"
                        @click="deleteAuthTokens()"
                        v-else-if="tokenType && tokenType === 'auth'"
                    >
                        Delete Auth Tokens
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
                    <h1 class="title">Success!</h1>
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
import orderBy from 'lodash/orderBy';
import { EventBus } from '@src/eventBus.js';
import Spinner from '@src/views/components/Spinner.vue';
import BaseModal from '@src/views/components/BaseModal.vue';
import TablePagination from '@src/views/components/TablePagination.vue';
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
        TablePagination,
    },
    data() {
        return {
            currentPage: 1,
            deleteSuccess: false,
            deleting: false,
            deletingAuthTokens: false,
            deletingLoginTokens: false,
            resultsPerPage: 25,
            reversedSort: false,
            searchTextTokens: '',
            searchTextUsers: '',
            selectedUser: null,
            sortFilter: '',
            sortedTokens: [],
            sortedUsers: [],
            tokenName: '',
            tokenType: '',
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
            this.tokenType = '';
        },
        closeTokenList() {
            this.viewTokens = false;
            this.viewUsers = true;
            this.selectedUser = null;
            this.sortFilter = '';
            this.sortedTokens = null;
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

                    if (userId === this.currentUser.id) {
                        logout()
                            .then(() => {
                                this.$router.push({ name: 'signIn' });
                            });
                    }
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
            if (user) {
                this.selectedUser = user;
            }

            this.tokenType = tokenType;
            this.deleting = true;
        },
        paginatedResults(data) {
            let resultSetStartIndex;
            let resultSetEndIndex;
            let paginatedData = data;
            const totalPages = Math.round(paginatedData / this.resultsPerPage);

            if (this.currentPage === 1) {
                resultSetStartIndex = 0;
                resultSetEndIndex = this.resultsPerPage;
            } else if (this.currentPage === totalPages) {
                resultSetStartIndex = this.resultsPerPage * this.currentPage;
                resultSetEndIndex = paginatedData.length;
            } else {
                resultSetStartIndex = (this.resultsPerPage * (this.currentPage -1 ));
                resultSetEndIndex = this.resultsPerPage * this.currentPage;
            }

            paginatedData = paginatedData.slice(resultSetStartIndex, resultSetEndIndex);

            return paginatedData;
        },
        selectUser(user) {
            this.selectedUser = user;
            this.setTokens(user.id);
            this.viewUsers = false;
            this.viewTokens = true;
            this.searchTextUsers = '';
            this.sortFilter = '';
        },
        setTokens(userId) {
            getUserTokens(userId)
                .then(response => {
                    const tokens = response.data;
                    this.sortedTokens = tokens;

                    if (this.selectedUser) {
                        if (this.currentUser.id === this.selectedUser.id) {
                            this.setUserAuthTokens(tokens);
                        }
                    }
                });
        },
        sortTokensBy(field) {
            let tokens = this.sortedTokens;

            if (this.sortFilter !== field) {
                if (field === 'name') {
                    this.sortedTokens = orderBy(tokens, [token => token.name.toLowerCase()], ['asc']);
                } else if (field === 'last_used') {
                    const unusedTokens = tokens.filter(token => token.last_used == null);
                    const usedTokens = tokens.filter(token => token.last_used != null);

                    tokens = orderBy(usedTokens, [token => token.last_used], ['desc']);
                    tokens = tokens.concat(unusedTokens);

                    this.sortedTokens = tokens;
                } else if (field === 'created') {
                    this.sortedTokens = orderBy(tokens, [token => token.created], ['desc']);
                }

                this.sortFilter = field;
            } else {
                tokens.reverse();
                this.reversedSort = !this.reversedSort;
                this.sortedTokens = tokens;
            }
        },
        sortUsersBy(field) {
            let users = this.sortedUsers;

            if (this.sortFilter !== field) {
                if (field === 'name') {
                    this.sortedUsers = orderBy(users, [user => user.name.toLowerCase()], ['asc']);
                }

                this.sortFilter = field;
            } else {
                users.reverse();
                this.reversedSort = !this.reversedSort;
                this.sortedUsers = users;
            }
        },

    },
    computed: {
        ...mapState([
            'currentUser',
            'users',
        ]),
        filteredTokens() {
            let searchText = this.searchTextTokens.toLowerCase();
            let tokens = this.sortedTokens;

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
            let users = this.sortedUsers;

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
    created() {
        const users = this.users;

        if (this.$route && this.$route.params && this.$route.params.userId) {
            this.viewUsers = false;
            this.viewTokens = true;
            const userId = this.$route.params.userId;

            getUser(userId)
                .then(response => {
                    this.selectedUser = response.data;
                    this.setTokens(userId);
                });
        }

        if (!users.length) {
            getUsers()
                .then(response => {
                    this.sortedUsers = response.data;
                    this.setUsers(response.data);
                });
        } else {
            this.sortedUsers = users;
        }

        EventBus.$on('closeModal:baseModal', () => {
            this.closeModal();
        });
    },
    mounted() {
        EventBus.$on('changeResultsPerPage', pagination => {
            this.resultsPerPage = pagination.resultsPerPage;
        });

        EventBus.$on('paginate', pagination => {
            this.currentPage = pagination.currentPage;
            this.resultsPerPage = pagination.resultsPerPage;
        });
    },
};
</script>
