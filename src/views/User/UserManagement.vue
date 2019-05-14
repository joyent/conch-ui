<template>
    <div class="user-management">
        <Spinner v-if="users.length < 1"/>
        <div class="users" v-else>
            <UsersStatistics :users="users" />
            <div class="users-table">
                <div class="table-filter">
                    <div class="columns is-vcentered">
                        <div class="column">
                            <h1 class="title is-4">User Management</h1>
                        </div>
                        <div class="column is-2">
                            <div class="field">
                                <div class="control">
                                    <div class="select is-fullwidth">
                                        <select v-model="userFilter">
                                            <option value="all">
                                                All Users
                                            </option>
                                            <option value="admins">
                                                Admins
                                            </option>
                                            <option value="users">
                                                Users
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="column is-3">
                            <div class="field">
                                <p class="control has-icons-left has-icons-right">
                                    <input
                                        class="input search"
                                        type="text"
                                        placeholder="Search Users"
                                        v-model="searchText"
                                    >
                                    <span class="icon is-small is-left">
                                        <i class="fas fa-search"></i>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div style="width: 135px; padding: 12px;">
                            <button
                                class="button create is-primary is-pulled-right"
                                @click="action = 'create'"
                            >
                                Create User
                            </button>
                        </div>
                    </div>
                </div>
                <transition name="fade-in-slow">
                    <table
                        class="table is-hoverable is-fullwidth"
                        v-if="filteredUsers.length"
                    >
                        <thead>
                            <th></th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Authentication Issues</th>
                            <th>Last Active</th>
                            <th>Actions</th>
                        </thead>
                        <tfoot>
                            <th></th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Authentication Issues</th>
                            <th>Last Active</th>
                            <th>Actions</th>
                        </tfoot>
                        <tbody>
                            <tr v-for="(user, i) in filteredUsers" :key="user.id">
                                <td class="has-text-centered">
                                    <span>{{ i + 1 }}</span>
                                </td>
                                <td>{{ user.name }}</td>
                                <td>
                                    <span v-if="user.is_admin">Admin</span>
                                    <span v-else>User</span>
                                </td>
                                <td>
                                    <span
                                        v-if="user.force_password_change || user.refuse_session_auth"
                                    >
                                        <span
                                            class="tag pwd-change is-danger"
                                            v-if="user.force_password_change"
                                        >
                                            Password Change Required
                                        </span>
                                        <span
                                            class="tag sess-auth is-danger"
                                            v-if="user.refuse_session_auth"
                                        >
                                            Session Auth Refused
                                        </span>
                                    </span>
                                    <span v-else>
                                        <span class="tag none is-success">
                                            None
                                        </span>
                                    </span>
                                </td>
                                <td>
                                    <span v-if="user.last_login">
                                        {{ lastActive(user.last_login) }}
                                    </span>
                                    <span v-else>
                                        Never
                                    </span>
                                </td>
                                <td>
                                    <div
                                        class="dropdown is-right"
                                        :class="{ 'is-active': activeDropdown === i }"
                                        @click="setActiveDropdown(i)"
                                    >
                                        <div class="dropdown-trigger">
                                            <button
                                                class="button actions is-primary"
                                                aria-haspopup="true"
                                                :aria-controls="`dropdown-menu-${i}`"
                                            >
                                                <span>Actions</span>
                                                <span class="icon is-small">
                                                    <i
                                                        class="fas fa-angle-down"
                                                        aria-hidden="true"
                                                    ></i>
                                                </span>
                                            </button>
                                        </div>
                                        <div
                                            v-if="activeDropdown === i"
                                            class="dropdown-menu"
                                            :id="`dropdown-menu-${i}`"
                                            role="menu"
                                        >
                                            <div class="dropdown-content">
                                                <a
                                                    class="dropdown-item edit"
                                                    @click="openModal('edit', user)"
                                                >
                                                    Edit User
                                                </a>
                                                <a
                                                    class="dropdown-item reset-pwd"
                                                    @click="openModal('reset-pwd', user)"
                                                >
                                                    Reset Password
                                                </a>
                                                <a class="dropdown-item permissions">
                                                    <span
                                                        v-if="user.is_admin"
                                                        @click="openModal('demote', user)"
                                                    >
                                                        Demote to Regular User
                                                    </span>
                                                    <span
                                                        v-else
                                                        @click="openModal('promote', user)"
                                                    >
                                                        Promote to Admin
                                                    </span>
                                                </a>
                                                <hr class="dropdown-divider">
                                                <a
                                                    class="dropdown-item tokens"
                                                    @click="viewTokens(user)"
                                                >
                                                    View Tokens
                                                </a>
                                                <a
                                                    class="dropdown-item delete-login-tokens"
                                                    @click="openModal('delete-login-tokens', user)"
                                                >
                                                    Delete Login Tokens
                                                </a>
                                                <a
                                                    class="dropdown-item delete-auth-tokens"
                                                    @click="openModal('delete-auth-tokens', user)"
                                                >
                                                    Delete Auth Tokens
                                                </a>
                                                <hr class="dropdown-divider">
                                                <a
                                                    class="dropdown-item deactivate"
                                                    @click="openModal('deactivate', user)"
                                                >
                                                    Deactivate User
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="no-results" v-if="!filteredUsers.length">
                        <p class="title">No Search Results Found.</p>
                        <img
                            src="../../assets/no-search-results.svg"
                            width="30%"
                        >
                    </div>
                </transition>
            </div>
            <transition name="fade">
                <UserModal
                    v-if="action === 'create' || action === 'edit'"
                    :action="action"
                    :user="user"
                />
                <UserActionModal
                    v-else-if="action"
                    :action="action"
                    :user="user"
                />
            </transition>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import search from "fuzzysearch";
import UserActionModal from './UserActionModal.vue';
import UsersStatistics from './UsersStatistics.vue';
import UserModal from './UserModal.vue';
import Spinner from '@src/views/components/Spinner.vue';
import { getUser, getUsers } from '@api/users.js';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        Spinner,
        UserActionModal,
        UserModal,
        UsersStatistics,
    },
    data() {
        return {
            action: '',
            activeDropdown: null,
            collapsed: true,
            searchText: '',
            user: {},
            userFilter: 'all',
        };
    },
    methods: {
        ...mapActions([
            'setUsers',
        ]),
        getIndex(users, userId) {
            return users.map(user => {
                return user.id;
            }).indexOf(userId);
        },
        lastActive(date) {
            return moment(date).fromNow();
        },
        openModal(action, user) {
            this.action = action;

            if (user) {
                this.user = user;
            } else {
                this.user = {};
            }
        },
        setActiveDropdown(row) {
            if (this.activeDropdown === row) {
                this.activeDropdown = null;
            } else {
                this.activeDropdown = row;
            }
        },
        viewTokens(user) {
            this.$router.push({ name: 'userTokens', params: { userId: user.id }});
        },
    },
    computed: {
        ...mapState([
            'users',
        ]),
        filteredUsers() {
            const searchText = this.searchText.toLowerCase();
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
                });
        }

        EventBus.$on('close-modal', () => {
            this.action = '';
        });

        EventBus.$on('close-modal:success', () => {
            this.action = '';
        });

        EventBus.$on('action-success', (actionData) => {
            const userId = actionData.userId;
            const users = this.users;

            if (actionData.action !== 'deactivate') {
                getUser(userId)
                    .then(response => {
                        const newUser = response.data;

                        if (actionData.action && actionData.action === 'create') {
                            users.push(newUser);
                            this.setUsers(users);
                        } else {
                            const index = this.getIndex(users, userId);
                            users.splice(index, 1, newUser);
                            this.setUsers(users);
                        }
                    });
            } else if (actionData && actionData.action === 'deactivate') {
                const index = this.getIndex(users, userId);
                users.splice(index, 1);
                this.setUsers(users);
            }
        });
    },
};
</script>
