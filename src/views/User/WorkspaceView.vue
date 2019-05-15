<template>
    <div class="workspace-view">
        <transition name="fade-in-slow">
            <Spinner v-if="!workspaces.length" />
            <table
                class="table workspaces-table is-hoverable is-fullwidth"
                v-else
            >
                <thead>
                    <th>Workspace Name</th>
                    <th>Admin Users</th>
                    <th>Regular Users</th>
                    <th>Total Users</th>
                    <th></th>
                </thead>
                <tfoot>
                    <th>Workspace Name</th>
                    <th>Admin Users</th>
                    <th>Regular Users</th>
                    <th>Total Users</th>
                    <th></th>
                </tfoot>
                <tbody>
                    <template
                        v-for="(users, workspaceName, index) in workspaceUsers"
                    >
                        <tr
                            :class="{ 'is-selected': isRowSelected(index) }"
                            class="row workspace-row"
                            @click="selectWorkspace(index)"
                            :key="workspaceName"
                        >
                            <td>{{ workspaceName }}</td>
                            <td>{{ adminUsers(users) }}</td>
                            <td>{{ regularUsers(users) }}</td>
                            <td>{{ users.length }}</td>
                            <td class="has-text-right">
                                <i class="fas fa-chevron-right"></i>
                            </td>
                        </tr>
                        <tr
                            class="row users-subtable"
                            v-if="isRowSelected(index)"
                            :key="`${workspaceName}-users`"
                        >
                            <td colspan="5">
                                <UsersTable :users="users" />
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </transition>
    </div>
</template>

<script>
import Spinner from '@src/views/components/Spinner.vue';
import UsersTable from './UsersTable.vue';
import sortBy from 'lodash/sortBy';
import { mapState } from 'vuex';

export default {
    components: {
        Spinner,
        UsersTable,
    },
    data() {
        return {
            selectedRows: [],
            workspaceUsers: {},
        };
    },
    methods: {
        adminUsers(users) {
            if (users.length) {
                return users.filter(user => {
                    return user.is_admin === true;
                }).length;
            };

            return 0;
        },
        isRowSelected(index) {
            return this.selectedRows.indexOf(index) >= 0;
        },
        regularUsers(users) {
            if (users.length) {
                return users.filter(user => {
                    return user.is_admin === false;
                }).length;
            }

            return 0;
        },
        selectWorkspace(index) {
            const indexPos = this.selectedRows.indexOf(index);

            if (indexPos === -1) {
                this.selectedRows.push(index);
            } else {
                this.selectedRows.splice(indexPos, 1);
            }
        },
    },
    computed: {
        ...mapState([
            'users',
            'workspaces',
        ]),
    },
    mounted() {
        const workspaces = sortBy(this.workspaces, ['name']);

        this.workspaceUsers = workspaces.reduce((acc, workspace) => {
            const users = [];
            for (let i = 0; i < this.users.length; i++) {
                const user = this.users[i];
                const match = user.workspaces.find(userWorkspace => {
                    return userWorkspace.id === workspace.id;
                });

                if (match) {
                    users.push(user);
                }
            }

            acc[workspace.name] = users;

            return acc;
        }, {});
    },
};
</script>
