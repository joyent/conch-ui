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
                    <table class="table is-hoverable is-fullwidth">
                        <thead>
                            <th>
                                <a
                                    class="table-header-filter name"
                                    :class="{
                                        'has-text-white': sortBy === 'name',
                                    }"
                                    @click="sort()"
                                >
                                    Name
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="
                                            sortBy === 'name' && !reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="
                                            sortBy === 'name' && reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th>
                                <a
                                    class="table-header-filter role"
                                    :class="{
                                        'has-text-white': sortBy === 'role',
                                    }"
                                    @click="sort()"
                                >
                                    Role
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="
                                            sortBy === 'role' && !reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="
                                            sortBy === 'role' && reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th>
                                <a
                                    class="table-header-filter permissions"
                                    :class="{
                                        'has-text-white':
                                            sortBy === 'permissions',
                                    }"
                                    @click="sort()"
                                >
                                    Permissions
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="
                                            sortBy === 'permissions' &&
                                                !reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="
                                            sortBy === 'permissions' &&
                                                reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th>
                                <a
                                    class="table-header-filter organization"
                                    :class="{
                                        'has-text-white':
                                            sortBy === 'organization',
                                    }"
                                    @click="sort()"
                                >
                                    Organization
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="
                                            sortBy === 'organization' &&
                                                !reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="
                                            sortBy === 'organization' &&
                                                reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th></th>
                        </thead>
                        <tfoot
                            v-if="filteredUsers && filteredUsers.length > 10"
                        >
                            <th>Name</th>
                            <th>Role</th>
                            <th>Permissions</th>
                            <th>Organization</th>
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
                                    <span v-else>
                                        Regular Member
                                    </span>
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
import RemoveItemModal from './RemoveItemModal.vue';
import AddUsersModal from './AddUsersModal.vue';
import { EventBus } from '@src/eventBus.js';
import * as Builds from '@api/builds.js';

export default {
    components: {
        AddUsersModal,
        RemoveItemModal,
    },
    props: {
        build: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            addUser: false,
            removeUser: false,
            removingUser: {},
            searchText: '',
            sortBy: '',
            userFilter: 'all',
        };
    },
    methods: {
        closeModal() {
            this.addUser = false;
            this.removeUser = false;
            this.removingUser = {};
        },
        removeUserFromBuild() {
            const buildId = this.build.id;

            Builds.removeUserFromBuild(buildId, this.removingUser.id).then(
                () => {
                    EventBus.$emit('item-removed');
                    this.$parent.getBuildData(buildId);
                }
            );
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
        adminUsersCount() {
            if (this.buildHasUsers) {
                return this.build.users.filter(user => user.role === 'admin')
                    .length;
            }

            return 0;
        },
        buildHasUsers() {
            return this.build && this.build.users && this.build.users.length;
        },
        filteredUsers() {
            if (this.buildHasUsers) {
                let users = this.build.users;

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
            }

            return [];
        },
        regularUsersCount() {
            if (this.buildHasUsers) {
                return this.build.users.filter(
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

        EventBus.$on('remove-item:member', () => {
            this.removeUserFromBuild();
        });

        EventBus.$on('get-current-build', () => {
            this.$parent.getBuildData();
        });
    },
};
</script>
