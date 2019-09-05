<template>
    <div>
        <table class="users-table table is-hoverable is-fullwidth is-marginless">
            <thead>
                <th></th>
                <th>
                    <a
                        class="table-header-filter username"
                        :class="{ 'has-text-white': sortFilter === 'name' }"
                        @click="sortBy('name')"
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
                <th>
                    <a
                        class="table-header-filter role"
                        :class="{ 'has-text-white': sortFilter === 'is_admin' }"
                        @click="sortBy('is_admin')"
                    >
                        Role
                        <i
                            class="fas fa-angle-down"
                            v-if="sortFilter === 'is_admin' && !reversedSort"
                            style="margin-left: 10px;"
                        ></i>
                        <i
                            class="fas fa-angle-up"
                            v-else-if="sortFilter === 'is_admin' && reversedSort"
                            style="margin-left: 10px;"
                        ></i>
                    </a>
                </th>
                <th>
                    <a
                        class="table-header-filter auth-issues"
                        :class="{ 'has-text-white': sortFilter === 'issues' }"
                        @click="sortBy('issues')"
                    >
                        Authentication Issues
                        <i
                            class="fas fa-angle-down"
                            v-if="sortFilter === 'issues' && !reversedSort"
                            style="margin-left: 10px;"
                        ></i>
                        <i
                            class="fas fa-angle-up"
                            v-else-if="sortFilter === 'issues' && reversedSort"
                            style="margin-left: 10px;"
                        ></i>
                    </a>
                </th>
                <th>
                    <a
                        class="table-header-filter last-active"
                        :class="{ 'has-text-white': sortFilter === 'last_active' }"
                        @click="sortBy('last_active')">
                        Last Active
                        <i
                            class="fas fa-angle-down"
                            v-if="sortFilter === 'last_active' && !reversedSort"
                            style="margin-left: 10px;"
                        ></i>
                        <i
                            class="fas fa-angle-up"
                            v-else-if="sortFilter === 'last_active' && reversedSort"
                            style="margin-left: 10px;"
                        ></i>
                    </a>
                </th>
                <th>Actions</th>
            </thead>
            <tfoot v-if="sortedUsers.length > 10">
                <th></th>
                <th>User Name</th>
                <th>Role</th>
                <th>Authentication Issues</th>
                <th>Last Active</th>
                <th>Actions</th>
            </tfoot>
            <tbody>
                <tr
                    class="row"
                    v-for="(user, index) in paginatedResults"
                    :key="user.id"
                >
                    <td class="has-text-centered">
                        <span>{{ index + 1 }}</span>
                    </td>
                    <td class="username">{{ user.name }}</td>
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
                            :class="{ 'is-active': activeDropdown === index }"
                            @click="setActiveDropdown(index)"
                        >
                            <div class="dropdown-trigger">
                                <button
                                    class="button actions is-primary"
                                    aria-haspopup="true"
                                    :aria-controls="`dropdown-menu-${index}`"
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
                                v-if="activeDropdown === index"
                                class="dropdown-menu"
                                :id="`dropdown-menu-${index}`"
                                role="menu"
                            >
                                <div class="dropdown-content">
                                    <a
                                        class="dropdown-item edit"
                                        @click="openModal('edit', user, 1)"
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
                                        class="dropdown-item workspaces"
                                        @click="openModal('edit', user, 2)"
                                    >
                                        Edit Workspaces
                                    </a>
                                    <hr class="dropdown-divider" />
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
        <TablePagination :totalResults="users.length" />
    </div>
</template>

<script>
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import TablePagination from '@src/views/components/TablePagination.vue';
import { EventBus } from '@src/eventBus.js';

export default {
    props: {
        users: {
            type: Array,
            required: true,
        },
    },
    components: {
        TablePagination,
    },
    data() {
        return {
            activeDropdown: null,
            currentPage: 1,
            resultsPerPage: 25,
            reversedSort: false,
            sortFilter: '',
            sortedUsers: [],
        };
    },
    methods: {
        lastActive(date) {
            return moment(date).fromNow();
        },
        openModal(action, user, step) {
            EventBus.$emit('open-modal', { action, user, step });
        },
        setActiveDropdown(row) {
            if (this.activeDropdown === row) {
                this.activeDropdown = null;
            } else {
                this.activeDropdown = row;
            }
        },
        sortBy(field, updatedUsers = null, sortUsers = false) {
            let users = updatedUsers || this.sortedUsers;

            if (this.sortFilter !== field || sortUsers) {
                if (field === 'name') {
                    this.sortedUsers = orderBy(users, [user => user.name.toLowerCase()], ['asc']);
                } else if (field === 'is_admin') {
                    this.sortedUsers = orderBy(users, [user => user.is_admin], ['desc']);
                } else if (field === 'issues') {
                    this.sortedUsers = orderBy(users, [user => user.force_password_change || user.refuse_session_auth], ['desc']);
                } else if (field === 'last_active') {
                    const inactiveUsers = users.filter(user => user.last_login == null);
                    const activeUsers = users.filter(user => user.last_login != null);

                    users = orderBy(activeUsers, [user => user.last_login], ['desc']);
                    users = users.concat(inactiveUsers)

                    this.sortedUsers = users;
                }

                this.sortFilter = field;
            } else {
                users.reverse();
                this.reversedSort = !this.reversedSort;
                this.sortedUsers = users;
            }
        },
        viewTokens(user) {
            this.$router.push({
                name: 'userTokens',
                params: {
                    userId: user.id
                },
            });
        },
    },
    computed: {
        paginatedResults() {
            let resultSetStartIndex;
            let resultSetEndIndex;
            let users = this.sortedUsers;
            const totalPages = Math.round(users / this.resultsPerPage);

            if (this.currentPage === 1) {
                resultSetStartIndex = 0;
                resultSetEndIndex = this.resultsPerPage;
            } else if (this.currentPage === totalPages) {
                resultSetStartIndex = this.resultsPerPage * this.currentPage;
                resultSetEndIndex = users.length;
            } else {
                resultSetStartIndex = (this.resultsPerPage * (this.currentPage -1 ));
                resultSetEndIndex = this.resultsPerPage * this.currentPage;
            }

            users = users.slice(resultSetStartIndex, resultSetEndIndex);

            return users;
        },
    },
    watch: {
        users: function(newVal, oldVal) {
            if (this.sortFilter) {
                this.sortBy(this.sortFilter, newVal, true);
            } else {
                this.sortedUsers = newVal;
            }
        },
    },
    created() {
        this.sortedUsers = this.users;
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
