<template>
    <div class="members-tab">
        <spinner v-if="fetchingData"></spinner>
        <div v-else class="columns">
            <div class="column">
                <div class="members-table is-paddingless">
                    <div class="datatable-header">
                        <span class="heading is-size-6 is-marginless">
                            {{ `Members (${filteredUsers.length})` }}
                        </span>
                        <div class="control has-icons-left has-icons-right">
                            <input
                                type="text"
                                class="input search"
                                v-model="searchText"
                                placeholder="Search..."
                            />
                            <span class="icon is-small is-left">
                                <i class="material-icons search">search</i>
                            </span>
                        </div>
                        <div class="select-with-label role">
                            <label class="select-label">Role</label>
                            <div class="select member-type">
                                <select
                                    v-model="roleFilter"
                                    class="is-capitalized"
                                    @change="changeFilter($event)"
                                >
                                    <option value="all">All</option>
                                    <option value="admin">Admin</option>
                                    <option value="regular">
                                        Regular
                                    </option>
                                </select>
                            </div>
                        </div>
                        <i
                            class="material-icons has-text-success"
                            @click="showAddUserModal()"
                        >
                            add_circle
                        </i>
                    </div>
                    <table
                        class="table is-hoverable is-fullwidth"
                        v-if="filteredUsers && filteredUsers.length > 0"
                    >
                        <thead>
                            <th v-for="header in headers" :key="header">
                                <a
                                    class="table-header-filter is-capitalized"
                                    :class="{
                                        'has-text-white': sortBy === header,
                                    }"
                                    @click="sort()"
                                >
                                    {{ header }}
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="
                                            sortBy === header && !reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="
                                            sortBy === header && reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th></th>
                        </thead>
                        <tfoot v-if="filteredUsers.length > 10">
                            <th
                                class="is-capitalized"
                                v-for="header in headers"
                                :key="header"
                            >
                                {{ header }}
                            </th>
                            <th></th>
                        </tfoot>
                        <tbody>
                            <tr
                                class="row"
                                v-for="user in filteredUsers"
                                :key="user.name"
                                @click="
                                    $router.push({
                                        name: 'user',
                                        params: { id: user.id },
                                    })
                                "
                                style="cursor: pointer;"
                            >
                                <td class="name">
                                    <span>{{ user.name }}</span>
                                </td>
                                <td class="role">
                                    <span v-if="user.role === 'admin'">
                                        Admin
                                    </span>
                                    <span v-else>Regular Member</span>
                                </td>
                                <td class="permissions">
                                    <span
                                        class="is-capitalized"
                                        v-if="user.role == 'admin'"
                                    >
                                        All
                                    </span>
                                    <span
                                        class="is-capitalized"
                                        v-else-if="user.role === 'ro'"
                                    >
                                        Read Only
                                    </span>
                                    <span
                                        class="is-capitalized"
                                        v-else-if="user.role === 'rw'"
                                    >
                                        Read &#47; Write
                                    </span>
                                </td>
                                <td class="remove-item has-text-right">
                                    <i
                                        class="fas fa-trash-alt"
                                        v-if="
                                            user.role !== 'admin' ||
                                                adminUsersCount > 1
                                        "
                                        @click="showRemoveMemberModal(user)"
                                    ></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="no-results" v-else>
                        <p class="subtitle has-text-centered">
                            No Results to Display
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <RemoveItemModal
            v-if="removeUser"
            :item="removingUser"
            item-type="member"
        />
        <AddUsersModal v-if="addUser" />
    </div>
</template>

<script>
import search from 'fuzzysearch';
import isEmpty from 'lodash/isEmpty';
import AddUsersModal from './AddUsersModal.vue';
import RemoveItemModal from './RemoveItemModal.vue';
import Spinner from '../components/Spinner.vue';
import { EventBus } from '@src/eventBus.js';
import { getBuildUsers, removeUserFromBuild } from '@api/builds.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        AddUsersModal,
        RemoveItemModal,
        Spinner,
    },
    data() {
        return {
            addUser: false,
            fetchingData: false,
            headers: ['name', 'role', 'permissions'],
            removeUser: false,
            removingUser: {},
            roleFilter: 'all',
            searchText: '',
            sortBy: '',
        };
    },
    methods: {
        ...mapActions(['setCurrentBuild', 'setCurrentBuildUsers']),
        changeFilter(event) {
            this.$router.push({
                name: 'build-members',
                params: { id: this.currentBuild.id },
                query: {
                    role:
                        (event && event.target && event.target.value) || 'all',
                },
            });
        },
        closeModal() {
            this.addUser = false;
            this.removeUser = false;
            this.removingUser = {};
        },
        async fetchData() {
            this.fetchingData = true;

            const buildId = this.$route.params.id;
            const currentBuild = this.currentBuild;
            const currentBuildUsers = this.currentBuildUsers;

            if (
                !currentBuild ||
                isEmpty(currentBuild) ||
                currentBuild.id !== buildId
            ) {
                const usersResponse = await getBuildUsers(buildId);
                this.setCurrentBuildUsers(usersResponse.data);
            } else if (!currentBuildUsers || currentBuildUsers.length === 0) {
                const usersResponse = await getBuildUsers(buildId);
                this.setCurrentBuildUsers(usersResponse.data);
            }

            // Process route queries
            if (this.$route.query && this.$route.query.role) {
                this.roleFilter = this.$route.query.role;
            }

            this.fetchingData = false;
        },
        refetchCurrentBuildUsers() {
            getBuildUsers(this.currentBuild.id).then(response => {
                this.setCurrentBuildUsers(response.data);
            });
        },
        removeUserFromBuild(user) {
            removeUserFromBuild(this.currentBuild.id, user.id).then(() => {
                EventBus.$emit('item-removed');

                this.refetchCurrentBuildUsers();
            });
        },
        showAddUserModal() {
            this.addUser = true;
        },
        showRemoveMemberModal(user) {
            this.removingUser = user;
            this.removeUser = true;
        },
    },
    computed: {
        ...mapState(['currentBuild', 'currentBuildUsers']),
        adminUsersCount() {
            if (this.buildHasUsers) {
                return this.currentBuildUsers.filter(
                    user => user.role === 'admin'
                ).length;
            }

            return 0;
        },
        buildHasUsers() {
            return this.currentBuildUsers && this.currentBuildUsers.length;
        },
        filteredUsers() {
            if (!this.buildHasUsers) {
                return [];
            }

            let users = this.currentBuildUsers;

            if (this.searchText) {
                const searchText = this.searchText.toLowerCase();

                users = users.reduce((acc, user) => {
                    const name = user.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(user);
                    }

                    return acc;
                }, []);
            }

            if (this.roleFilter !== 'all') {
                const roleFilter = this.roleFilter;

                if (roleFilter === 'admin') {
                    return users.filter(user => user.role === 'admin');
                } else if (roleFilter === 'regular') {
                    return users.filter(user => user.role !== 'admin');
                }
            }

            return users;
        },
        regularUsersCount() {
            if (this.buildHasUsers) {
                return this.currentBuildUsers.filter(
                    user => user.role === 'regular user'
                ).length;
            }

            return 0;
        },
    },
    created() {
        this.fetchData();

        EventBus.$on(
            ['close-modal:add-item', 'close-modal:remove-item'],
            () => {
                this.closeModal();
            }
        );

        EventBus.$on('remove-item:member', user => {
            this.removeUserFromBuild(user);
        });

        EventBus.$on('users-added-to-build', () => {
            this.refetchCurrentBuildUsers();
        });
    },
};
</script>
