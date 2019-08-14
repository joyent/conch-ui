<template>
    <div class="users-table">
        <div class="columns">
            <div class="column is-6 is-offset-3 box">
                <div class="control has-icons-left">
                    <input
                        type="text"
                        class="input search"
                        v-model="searchText"
                        placeholder="Search Users"
                    />
                    <span class="icon">
                        <i class="fas fa-search"></i>
                    </span>
                </div>
                <table class="table is-fullwidth">
                    <tbody>
                        <tr
                            :class="{ 'is-selected': isUserSelected(user) }"
                            v-for="user in filteredUsers"
                            :key="user"
                        >
                            <td class="username">
                                <span
                                    class="has-text-success adding"
                                    v-if="isUserSelected(user)"
                                >
                                    {{ user }}
                                </span>
                                <span v-else>
                                    {{ user }}
                                </span>
                            </td>
                            <td v-if="isUserSelected(user)">
                                <div class="select">
                                    <select v-model="userPermissions">
                                        <option value="ro">Read Only</option>
                                        <option value="rw">Read / Write</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </td>
                            <td class="has-text-right">
                                <i
                                    class="material-icons has-text-danger"
                                    v-if="isUserSelected(user)"
                                    @click="removeMember(user)"
                                >
                                    close
                                </i>
                                <i
                                    class="material-icons has-text-success add-user"
                                    @click="addMember(user)"
                                    v-else
                                >
                                    add
                                </i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import search from 'fuzzysearch';

export default {
    data() {
        return {
            searchText: '',
            selectedUsers: [],
            showCloseButton: false,
            userPermissions: 'ro',
            users: [
                'Darth Vader',
                'Anakin Skywalker',
                'Qui Gon Jinn',
                'Obi Wan Kenobi',
                'Mace Windu',
                'Padme Amidala',
                'Chewbacca',
                'Yoda',
                'Kit Fisto',
                'Lando Calrissian',
                'dustin.p.ryerson@joyent.com',
                'christopher.tolkien@joyent.com',
                'jeff.emershaw+sin-preflight2@joyent.com',
            ],
        };
    },
    methods: {
        addMember(user) {
            this.selectedUsers.push(user);
        },
        isUserSelected(user) {
            return this.selectedUsers.indexOf(user) !== -1;
        },
        removeMember(user) {
            const index = this.selectedUsers.indexOf(user);

            this.selectedUsers.splice(index, 1);
        },
    },
    computed: {
        filteredUsers() {
            let users = this.users;
            const searchText = this.searchText.toLowerCase();

            if (searchText) {
                return users.reduce((acc, user) => {
                    const name = user.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(user);
                    }

                    return acc;
                }, []);
            }

            return users;
        },
    },
};
</script>
