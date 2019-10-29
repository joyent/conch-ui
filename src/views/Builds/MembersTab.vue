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
                        <div class="select member-type">
                            <select v-model="userFilter">
                                <option value="all">All Members</option>
                                <option value="admin">
                                    Admins
                                </option>
                                <option value="regular">
                                    Regular Members
                                </option>
                            </select>
                        </div>
                        <i
                            class="material-icons has-text-success"
                            @click="addUser()"
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
                        <tfoot v-if="filteredUsers.length > 10">
                            <th>Name</th>
                            <th>Role</th>
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
                                    <span>{{ user.role }}</span>
                                </td>
                                <td class="organization">
                                    <span>{{ user.organization }}</span>
                                </td>
                                <td class="remove-item has-text-right">
                                    <i
                                        class="fas fa-trash-alt"
                                        @click="removeMember(user)"
                                    ></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <RemoveItemModal
            v-if="removingMember"
            :build="build"
            :item="user"
            item-type="user"
        />
    </div>
</template>

<script>
import search from 'fuzzysearch';
import RemoveItemModal from './RemoveItemModal.vue';
import { EventBus } from '@src/eventBus.js';

export default {
    components: {
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
            removingMember: false,
            searchText: '',
            sortBy: '',
            userFilter: 'all',
        };
    },
    methods: {
        addUser() {

        },
        removeMember(user) {
            this.user = user;
            this.removingMember = true;
        },
        sort() {

        },
    },
    computed: {
        adminUsersCount() {
            if (this.build && this.build.users && this.build.users.length) {
                return this.build.users.filter(user => user.role === 'admin')
                    .length;
            }

            return 0;
        },
        filteredUsers() {
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

            if (this.userFilter) {
                const userFilter = this.userFilter;

                if (userFilter === 'admin') {
                    return users.filter(user => user.role === 'admin');
                } else if (userFilter === 'regular') {
                    return users.filter(user => user.role === 'regular user');
                }
            }

            return users;
        },
        regularUsersCount() {
            if (this.build && this.build.users && this.build.users.length) {
                return this.build.users.filter(
                    user => user.role === 'regular user'
                ).length;
            }

            return 0;
        },
    },
    mounted() {
        EventBus.$on('close-modal:remove-item', () => {
            this.removingMember = false;
        });
    },
};
</script>
