<template>
    <table class="table is-hoverable is-fullwidth">
        <thead>
            <th></th>
            <th>User Name</th>
            <th>Role</th>
            <th>Authentication Issues</th>
            <th>Last Active</th>
            <th>Actions</th>
        </thead>
        <tfoot>
            <th></th>
            <th>User Name</th>
            <th>Role</th>
            <th>Authentication Issues</th>
            <th>Last Active</th>
            <th>Actions</th>
        </tfoot>
        <tbody>
            <tr v-for="(user, index) in users" :key="user.id">
                <td class="has-text-centered">
                    <span>{{ index + 1 }}</span>
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
</template>

<script>
import moment from 'moment';
import { EventBus } from '@src/eventBus.js';

export default {
    props: {
        users: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            activeDropdown: null,
        };
    },
    methods: {
        lastActive(date) {
            return moment(date).fromNow();
        },
        openModal(action, user) {
            EventBus.$emit('open-modal', { action, user });
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
};
</script>
