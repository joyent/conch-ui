<template>
    <div class="users-table">
        <table class="table is-fullwidth">
            <tbody>
                <tr class="row search">
                    <td colspan="3">
                        <p class="control has-icons-left">
                            <input
                                class="input search is-marginless"
                                v-model="searchText"
                                placeholder="Search..."
                                type="text"
                            />
                            <span class="icon is-left">
                                <i class="material-icons">search</i>
                            </span>
                        </p>
                    </td>
                </tr>
                <template>
                    <tr
                        class="row item"
                        :class="{ 'is-selected': isUserSelected(user.id) }"
                        v-for="user in filteredUsers"
                        :key="user.id"
                    >
                        <template v-if="isUserSelected(user.id)">
                            <td class="item-name">
                                <span class="name has-text-grey-light">
                                    {{ user.name }}
                                </span>
                            </td>
                            <td class="role-select">
                                <div class="select role">
                                    <select
                                        @change="updateRole(user.id, $event)"
                                    >
                                        <option
                                            value="admin"
                                            :selected="user.role === 'admin'"
                                        >
                                            Admin
                                        </option>
                                        <option
                                            value="rw"
                                            :selected="user.role === 'rw'"
                                        >
                                            Read / Write
                                        </option>
                                        <option
                                            value="ro"
                                            :selected="user.role === 'ro'"
                                        >
                                            Read Only
                                        </option>
                                    </select>
                                </div>
                            </td>
                            <td class="action">
                                <i
                                    class="material-icons has-text-success add-item"
                                    v-if="showRemoveIcon !== user.id"
                                    @mouseover="showRemoveIcon = user.id"
                                >
                                    check
                                </i>
                                <i
                                    class="material-icons has-text-danger remove-item"
                                    v-if="showRemoveIcon === user.id"
                                    @click="removeMember(user.id)"
                                    @mouseleave="showRemoveIcon = ''"
                                >
                                    close
                                </i>
                            </td>
                        </template>
                        <template v-else>
                            <td class="item-name">
                                <span>{{ user.name }}</span>
                            </td>
                            <td class="action">
                                <i
                                    class="material-icons has-text-success add-item"
                                    @click="addItem(user, 'members')"
                                >
                                    add
                                </i>
                            </td>
                        </template>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import search from 'fuzzysearch';
import { mapActions, mapState } from 'vuex';
import { getUsers } from '@api/users.js';

export default {
    data() {
        return {
            searchText: '',
            selectedUsers: [],
            showCloseButton: false,
            showRemoveIcon: false,
            userPermissions: 'ro',
        };
    },
    methods: {
        ...mapActions(['setUsers']),
        addMember(user) {
            this.selectedUsers.push(user);
        },
        isUserSelected(userName) {
            return (
                this.selectedUsers.map(user => user.name).indexOf(userName) !==
                -1
            );
        },
        removeMember(userName) {
            const index = this.selectedUsers
                .map(user => user.name)
                .indexOf(userName);

            this.selectedUsers.splice(index, 1);
        },
        updateRole(userName, event) {
            if (event && event.target && event.target.value) {
                const selectedMembers = this.selectedMembers;

                for (let i = 0; i < selectedMembers.length; i++) {
                    const modifiedUser = selectedMembers[i];

                    if (modifiedUser.name === userName) {
                        this.selectedMembers[i].role = event.target.value;

                        break;
                    }
                }
            }
        },
    },
    computed: {
        ...mapState(['users']),
        filteredUsers() {
            let users = this.users;
            const searchText = this.searchText.toLowerCase();

            if (searchText) {
                return users.reduce((acc, user) => {
                    const name = user.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(user);
                    }

                    return acc;
                }, []);
            }

            return users;
        },
    },
    created() {
        if (!this.users.length) {
            getUsers().then(response => {
                this.setUsers(response.data);
            });
        }
    },
};
</script>
