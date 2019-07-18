<template>
    <div class="workspace-view">
        <Spinner v-if="!sortedWorkspaces.length" />
        <table
            class="table workspaces-table is-hoverable is-fullwidth"
            v-else-if="!isEmpty(workspaceUsers)"
        >
            <thead>
                <th></th>
                <th>
                    <a
                        class="table-header-filter"
                        :class="{
                            'has-text-white': sortFilter === 'workspace_name',
                        }"
                        @click="sortByName()"
                    >
                        Workspace Name
                        <i
                            class="fas fa-angle-down"
                            v-if="
                                sortFilter === 'workspace_name' && !reversedSort
                            "
                            style="margin-left: 10px;"
                        ></i>
                        <i
                            class="fas fa-angle-up"
                            v-else-if="
                                sortFilter === 'workspace_name' && reversedSort
                            "
                            style="margin-left: 10px;"
                        ></i>
                    </a>
                </th>
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
                <th>All Users</th>
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
                        <td class="workspace-name">{{ workspaceName }}</td>
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
import search from 'fuzzysearch';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
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
            default: '',
        },
        filteredUsers: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            reversedSort: false,
            selectedRows: [],
            sortFilter: '',
            sortedWorkspaces: [],
        };
    },
    methods: {
        adminUsers(users) {
            if (users.length) {
                return users.filter(user => {
                    return user.is_admin === true;
                }).length;
            }

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
        sortByName() {
            const workspaces = this.sortedWorkspaces;

            if (!this.sortFilter) {
                this.sortFilter = 'workspace_name';
            }

            workspaces.reverse();
            this.sortedWorkspaces = workspaces;
            this.reversedSort = !this.reversedSort;
        },
    },
    computed: {
        ...mapState(['workspaces']),
        filteredWorkspaces() {
            const searchText = this.searchText;
            let workspaces = this.sortedWorkspaces;

            if (searchText) {
                return workspaces.reduce((acc, workspace) => {
                    const name = workspace.name.toLowerCase();
                    const text = searchText.toLowerCase();

                    if (search(text, name)) {
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

                for (let i = 0; i < this.filteredUsers.length; i++) {
                    const user = this.filteredUsers[i];
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
    },
    mounted() {
        this.sortedWorkspaces = orderBy(
            this.workspaces,
            [workspace => workspace.name.toLowerCase()],
            ['asc']
        );
    },
};
</script>
