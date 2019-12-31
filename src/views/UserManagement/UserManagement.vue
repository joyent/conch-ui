<template>
    <div class="user-management">
        <Spinner v-if="users.length < 1" />
        <div class="users" v-else>
            <div class="columns is-vcentered">
                <div class="column">
                    <a class="filter-all" @click="setFilters('all')">
                        <div
                            class="box users-stats"
                            :class="{
                                'is-selected': statisticFilter === 'all',
                            }"
                        >
                            <h2 class="is-6">All Users</h2>
                            <span class="is-size-3 has-text-info">
                                {{ users.length }}
                            </span>
                        </div>
                    </a>
                </div>
                <div class="column">
                    <a class="filter-admin" @click="setFilters('admins')">
                        <div
                            class="box users-stats"
                            :class="{
                                'is-selected': statisticFilter === 'admins',
                            }"
                        >
                            <h2 class="is-6">Admin Users</h2>
                            <span class="is-size-3 has-text-info">
                                {{ adminUsersCount }}
                            </span>
                        </div>
                    </a>
                </div>
                <div class="column">
                    <a class="filter-regular" @click="setFilters('regular')">
                        <div
                            class="box users-stats"
                            :class="{
                                'is-selected': statisticFilter === 'regular',
                            }"
                        >
                            <h2 class="is-6">Regular Users</h2>
                            <span class="is-size-3 has-text-info">
                                {{ regularUsersCount }}
                            </span>
                        </div>
                    </a>
                </div>
                <div class="column">
                    <a class="filter-inactive" @click="setFilters('inactive')">
                        <div
                            class="box users-stats"
                            :class="{
                                'is-selected': statisticFilter === 'inactive',
                            }"
                        >
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
                        @click="setFilters('auth_issues')"
                    >
                        <div
                            class="box users-stats"
                            :class="{
                                'is-selected':
                                    statisticFilter === 'auth_issues',
                            }"
                        >
                            <h2 class="is-6">Authentication Issues</h2>
                            <span class="is-size-3 has-text-info">
                                {{ authenticationIssuesCount }}
                            </span>
                        </div>
                    </a>
                </div>
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
                                    <option value="regular">
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
                        <UsersTable :users="filteredUsers" />
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
                    :edit-user="action === 'create' ? {} : user"
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
import UserModal from './UserModal.vue';
import UserActionModal from './UserActionModal.vue';
import Spinner from '@src/views/components/Spinner.vue';
import UsersTable from './UsersTable.vue';
import { getUser, getUsers } from '@api/users.js';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        UserModal,
        Spinner,
        UserActionModal,
        UsersTable,
    },
    data() {
        return {
            action: '',
            activeDropdown: null,
            collapsed: true,
            currentTab: 'users',
            modalStep: null,
            searchText: '',
            statisticFilter: 'all',
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
        openModal(action, user, step) {
            if (user) {
                this.user = user;
            } else {
                this.user = {};
            }

            if (step) {
                this.modalStep = step;
            }

            this.action = action;
        },
        setFilters(filter) {
            if (filter === this.statisticFilter) {
                this.statisticFilter = 'all';
            } else {
                this.statisticFilter = filter;
            }

            if (
                filter === this.userFilter ||
                filter === 'all' ||
                filter === 'inactive' ||
                filter === 'auth_issues'
            ) {
                this.userFilter = 'all';
            } else if (filter === 'admins') {
                this.userFilter = 'admins';
            } else if (filter === 'regular') {
                this.userFilter = 'regular';
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
            } else if (this.userFilter === 'regular') {
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
                } else if (statisticFilter === 'regular') {
                    users = users.filter(user => user.is_admin === false);
                } else if (statisticFilter === 'inactive') {
                    users = users.filter(user => user.last_login == null);
                } else if (statisticFilter === 'auth_issues') {
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
            this.openModal(data.action, data.user, data.step);
        });

        EventBus.$on(
            ['close-modal', 'close-user-modal', 'close-modal:success'],
            () => {
                this.action = '';
            }
        );

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
