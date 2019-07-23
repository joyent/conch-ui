<template>
    <div class="user-management">
        <Spinner v-if="users.length < 1" />
        <div class="users" v-else>
            <div class="columns is-vcentered">
                <div class="column">
                    <a class="filter-all" @click="setUserFilters('all_users')">
                        <div class="box users-stats">
                            <h2 class="is-6">All Users</h2>
                            <span class="is-size-3 has-text-info">
                                {{ users.length }}
                            </span>
                        </div>
                    </a>
                </div>
                <div class="column">
                    <a
                        class="filter-admin"
                        @click="setUserFilters('admin_users')"
                    >
                        <div class="box users-stats">
                            <h2 class="is-6">Admin Users</h2>
                            <span class="is-size-3 has-text-info">
                                {{ adminUsersCount }}
                            </span>
                        </div>
                    </a>
                </div>
                <div class="column">
                    <a
                        class="filter-regular"
                        @click="setUserFilters('regular_users')"
                    >
                        <div class="box users-stats">
                            <h2 class="is-6">Regular Users</h2>
                            <span class="is-size-3 has-text-info">
                                {{ regularUsersCount }}
                            </span>
                        </div>
                    </a>
                </div>
                <div class="column">
                    <a
                        class="filter-inactive"
                        @click="statisticFilter = 'inactive'"
                    >
                        <div class="box users-stats">
                            <h2 class="is-6">Inactive Users</h2>
                            <span class="is-size-3 has-text-info">
                                {{ inactiveUsersCount }}
                            </span>
                        </div>
                    </a>
                </div>
                <div class="column">
                    <a
                        class="filter-auth-issues"
                        @click="statisticFilter = 'authentication_issues'"
                    >
                        <div class="box users-stats">
                            <h2 class="is-6">Authentication Issues</h2>
                            <span class="is-size-3 has-text-info">
                                {{ authenticationIssuesCount }}
                            </span>
                        </div>
                    </a>
                </div>
            </div>
            <div class="tabs">
                <ul>
                    <li :class="{ 'is-active': currentTab === 'users' }">
                        <a
                            class="tab users-tab is-uppercase"
                            @click="currentTab = 'users'"
                        >
                            Users
                        </a>
                    </li>
                    <li :class="{ 'is-active': currentTab === 'workspaces' }">
                        <a
                            class="tab workspaces-tab is-uppercase"
                            @click="currentTab = 'workspaces'"
                        >
                            Workspaces
                        </a>
                    </li>
                </ul>
            </div>
            <div class="data-table">
                <div class="table-header">
                    <h1 class="title is-4">User Management</h1>
                    <div class="table-filter">
                        <div class="control">
                            <div class="select">
                                <select v-model="userFilter">
                                    <option value="all">
                                        All Users
                                    </option>
                                    <option value="admins">
                                        Admin Users
                                    </option>
                                    <option value="users">
                                        Regular Users
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="control has-icons-left has-icons-right">
                            <input
                                class="input search"
                                type="text"
                                placeholder="Search Users"
                                v-model="searchText"
                            />
                            <span class="icon is-small is-left">
                                <i class="fas fa-search"></i>
                            </span>
                        </div>
                        <div
                            class="control has-icons-left has-icons-right"
                            v-if="currentTab === 'workspaces'"
                        >
                            <input
                                class="input search workspaces"
                                type="text"
                                placeholder="Search Workspaces"
                                v-model="searchTextWorkspaces"
                            />
                            <span class="icon is-small is-left">
                                <i class="fas fa-search"></i>
                            </span>
                        </div>
                    </div>
                    <div style="width: 135px;">
                        <button
                            class="button create is-primary is-pulled-right"
                            @click="action = 'create'"
                        >
                            <i
                                class="fas fa-plus"
                                style="margin-right: 8px;"
                            ></i>
                            Add User
                        </button>
                    </div>
                </div>
                <transition name="fade-in-slow">
                    <div v-if="filteredUsers.length">
                        <div v-if="currentTab === 'users'">
                            <UsersTable :users="filteredUsers" />
                        </div>
                        <div v-else>
                            <WorkspaceView
                                :filtered-users="filteredUsers"
                                :search-text="searchTextWorkspaces"
                            />
                        </div>
                    </div>
                    <div class="no-results" v-else>
                        <p class="title">No Results Found.</p>
                        <img
                            src="../../assets/no-search-results.svg"
                            width="30%"
                        />
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
import search from 'fuzzysearch';
import UserActionModal from './UserActionModal.vue';
import UserModal from './UserModal.vue';
import Spinner from '@src/views/components/Spinner.vue';
import WorkspaceView from './WorkspaceView.vue';
import UsersTable from './UsersTable.vue';
import { getUser, getUsers } from '@api/users.js';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        Spinner,
        UserActionModal,
        UserModal,
        UsersTable,
        WorkspaceView,
    },
    data() {
        return {
            action: '',
            activeDropdown: null,
            collapsed: true,
            currentTab: 'users',
            searchText: '',
            searchTextWorkspaces: '',
            statisticFilter: '',
            user: {},
            userFilter: 'all',
        };
    },
    methods: {
        ...mapActions(['setUsers']),
        getIndex(users, userId) {
            return users
                .map(user => {
                    return user.id;
                })
                .indexOf(userId);
        },
        openModal(action, user) {
            this.action = action;

            if (user) {
                this.user = user;
            } else {
                this.user = {};
            }
        },
        setUserFilters(filter) {
            if (filter === 'all_users') {
                this.statisticFilter = 'all_users';
                this.userFilter = 'all';
            } else if (filter === 'admin_users') {
                this.statisticFilter = 'admins';
                this.userFilter = 'admins';
            } else if (filter === 'regular_users') {
                this.statisticFilter = 'regular_users';
                this.userFilter = 'users';
            }
        },
    },
    computed: {
        ...mapState(['users']),
        adminUsersCount() {
            return this.users.filter(user => user.is_admin === true).length;
        },
        authenticationIssuesCount() {
            return this.users.filter(user => {
                if (user.force_password_change || user.refuse_session_auth) {
                    return user;
                }
            }).length;
        },
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

                    if (search(searchText, name) || search(searchText, email)) {
                        acc.push(user);
                    }

                    return acc;
                }, []);
            }

            if (this.statisticFilter) {
                const statisticFilter = this.statisticFilter;

                if (statisticFilter === 'admins') {
                    users = users.filter(user => user.is_admin === true);
                } else if (statisticFilter === 'regular_users') {
                    users = users.filter(user => user.is_admin === false);
                } else if (statisticFilter === 'inactive') {
                    users = users.filter(user => user.last_login == null);
                } else if (statisticFilter === 'authentication_issues') {
                    users = users.filter(user => {
                        if (
                            user.force_password_change === true ||
                            user.refuse_session_auth === true
                        )
                            return user;
                    });
                }
            }

            return users;
        },
        inactiveUsersCount() {
            return this.users.filter(user => user.last_login == null).length;
        },
        regularUsersCount() {
            return this.users.filter(user => user.is_admin === false).length;
        },
    },
    mounted() {
        if (!this.users.length) {
            getUsers().then(response => {
                this.setUsers(response.data);
            });
        }

        EventBus.$on('open-modal', data => {
            this.openModal(data.action, data.user);
        });

        EventBus.$on('close-modal', () => {
            this.action = '';
        });

        EventBus.$on('close-modal:success', () => {
            this.action = '';
        });

        EventBus.$on('action-success', actionData => {
            const userId = actionData.userId;
            const users = this.users;

            if (actionData.action !== 'deactivate') {
                getUser(userId).then(response => {
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
