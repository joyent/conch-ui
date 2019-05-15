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
                        <div class="column">
                            <a
                                @click="setCurrentTab('list')"
                                style="margin-right: 10px;"
                            >
                                <i
                                    class="fas fa-lg fa-users"
                                    :class="{ 'has-text-white': currentTab === 'list' }"
                                ></i>
                            </a>
                            <a
                                @click="setCurrentTab('workspace')"
                            >
                                <i
                                    class="fas fa-lg fa-sitemap"
                                    :class="{ 'has-text-white': currentTab === 'workspace' }"
                                ></i>
                            </a>
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
                <div v-if="currentTab === 'list'">
                    <transition name="fade-in-slow">
                        <UsersTable v-if="filteredUsers.length" :users="filteredUsers" />
                        <div class="no-results" v-else>
                            <p class="title">No Search Results Found.</p>
                            <img
                                src="../../assets/no-search-results.svg"
                                width="30%"
                            >
                        </div>
                    </transition>
                </div>
                <div v-else>
                    <WorkspaceView />
                </div>
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
import search from "fuzzysearch";
import UserActionModal from './UserActionModal.vue';
import UsersStatistics from './UsersStatistics.vue';
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
        UsersStatistics,
        UsersTable,
        WorkspaceView,
    },
    data() {
        return {
            action: '',
            activeDropdown: null,
            collapsed: true,
            currentTab: 'list',
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
        openModal(action, user) {
            this.action = action;

            if (user) {
                this.user = user;
            } else {
                this.user = {};
            }
        },
        setCurrentTab(tab) {
            this.currentTab = tab;
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

        EventBus.$on('open-modal', data => {
            this.openModal(data.action, data.user);
        });

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
