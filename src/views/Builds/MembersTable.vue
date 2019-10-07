<template>
    <div class="members-table">
        <table class="table" v-if="filteredUsers.length > 0">
            <tbody>
                <tr class="row search">
                    <td colspan="3">
                        <p class="control has-icons-left">
                            <input
                                class="input search"
                                v-model="searchText"
                                placeholder="Search users"
                                type="text"
                            />
                            <span class="icon is-left">
                                <i class="material-icons">
                                    search
                                </i>
                            </span>
                        </p>
                    </td>
                </tr>
                <tr
                    class="row item"
                    :class="{
                        'is-selected': isUserSelected(user.name),
                    }"
                    v-for="user in filteredUsers"
                    :key="user.id"
                >
                    <template v-if="isUserSelected(user.name)">
                        <td class="item-name">
                            <span class="name has-text-grey-light">
                                {{ user.name }}
                            </span>
                        </td>
                        <td class="role-select">
                            <div class="select role">
                                <select @change="updateRole(user.name, $event)">
                                    <option value="admin">
                                        Admin
                                    </option>
                                    <option value="rw">
                                        Read / Write
                                    </option>
                                    <option value="ro" selected>
                                        Read Only
                                    </option>
                                </select>
                            </div>
                        </td>
                        <td class="action">
                            <i
                                class="material-icons has-text-success add-item"
                                v-if="showRemoveIcon !== user.name"
                                @mouseover="showRemoveIcon = user.name"
                            >
                                check
                            </i>
                            <i
                                class="material-icons has-text-danger remove-item"
                                v-if="showRemoveIcon === user.name"
                                @click="removeMember(user.name)"
                                @mouseleave="showRemoveIcon = ''"
                            >
                                close
                            </i>
                        </td>
                    </template>
                    <template v-else>
                        <td class="item-name">
                            <span>
                                {{ user.name }}
                            </span>
                        </td>
                        <td class="action">
                            <i
                                class="material-icons has-text-success add-item"
                                @click="addMember(user)"
                            >
                                add
                            </i>
                        </td>
                    </template>
                </tr>
            </tbody>
        </table>
        <div class="box" v-else>
            <Spinner />
        </div>
    </div>
</template>

<script>
import search from 'fuzzysearch';
import Spinner from '@src/views/components/Spinner.vue';
import { mapActions, mapState } from 'vuex';
import { getUsers } from '@api/users.js';

export default {
    components: {
        Spinner,
    },
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
