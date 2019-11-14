<template>
    <div class="members-tab">
        <div class="columns">
            <div class="column">
                <div class="members-table is-paddingless">
                    <div class="datatable-header">
                        <span class="heading is-size-6 is-marginless">
                            Members
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
                                <select v-model="userFilter">
                                    <option value="all">All</option>
                                    <option value="admin">Admin</option>
                                    <option value="regular">
                                        Regular Member
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
                                <td class="organization">
                                    <span>{{ user.organization }}</span>
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
import AddUsersModal from './AddUsersModal.vue';
import RemoveItemModal from './RemoveItemModal.vue';
import { EventBus } from '@src/eventBus.js';
import * as Builds from '@api/builds.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        AddUsersModal,
        RemoveItemModal,
    },
    props: {
        buildId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            addUser: false,
            headers: ['name', 'role', 'permissions', 'organization'],
            removeUser: false,
            removingUser: {},
            searchText: '',
            sortBy: '',
            userFilter: 'all',
        };
    },
    methods: {
        ...mapActions(['setCurrentBuildUsers']),
        closeModal() {
            this.addUser = false;
            this.removeUser = false;
            this.removingUser = {};
        },
        refetchCurrentBuildUsers() {
            Builds.getBuildUsers(this.buildId).then(response => {
                this.setCurrentBuildUsers(response.data);
            });
        },
        removeUserFromBuild(user) {
            Builds.removeUserFromBuild(this.buildId, user.id).then(() => {
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
        sort() {

        },
    },
    computed: {
        ...mapState(['currentBuildUsers']),
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

                return users.reduce((acc, user) => {
                    const name = user.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(user);
                    }

                    return acc;
                }, []);
            }

            if (this.userFilter !== 'all') {
                const userFilter = this.userFilter;

                if (userFilter === 'admin') {
                    return users.filter(user => user.role === 'admin');
                } else if (userFilter === 'regular') {
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
