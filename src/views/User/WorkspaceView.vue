<template>
    <div class="workspace-view">
        <Spinner v-if="!workspaces.length" />
        <table
            class="table workspaces-table is-hoverable is-fullwidth"
            v-else-if="!isEmpty(workspaceUsers)"
        >
            <thead>
                <th></th>
                <th>Workspace Name</th>
                <th>Admin Users</th>
                <th>Regular Users</th>
                <th>Total Users</th>
                <th></th>
            </thead>
            <tfoot v-if="workspaceUsers.length > 10">
                <th></th>
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
                        <td class="has-text-centered">{{ index + 1 }}</td>
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
                        <td colspan="6">
                            <UsersTable :users="users" />
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import Spinner from '@src/views/components/Spinner.vue';
import UsersTable from './UsersTable.vue';
import search from "fuzzysearch";
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import { mapState } from 'vuex';

export default {
    components: {
        Spinner,
        UsersTable,
    },
    props: {
        searchText: {
            type: String,
            required: false,
        },
        users: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            selectedRows: [],
            sortedWorkspaces: [],
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
        isEmpty,
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
            'workspaces',
        ]),
        filteredWorkspaces() {
            const searchText = this.searchText.toLowerCase();
            let workspaces = this.sortedWorkspaces;

            if (searchText) {
                return workspaces.reduce((acc, workspace) => {
                    const name = workspace.name.toLowerCase();

                    if (
                        search(searchText, name)
                    ) {
                        acc.push(workspace);
                    }

                    return acc;
                }, []);
            }

            return workspaces;
        },
        workspaceUsers() {
            return this.filteredWorkspaces.reduce((acc, workspace) => {
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

                if (users.length) {
                    acc[workspace.name] = users;
                }

                return acc;
            }, {});
        }
    },
    mounted() {
        this.sortedWorkspaces = sortBy(this.workspaces, ['name']);
    },
};
</script>
