<template>
    <div class="users-tab">
        <div class="columns is-vcentered">
            <div class="column">
                <a class="filter-all" @click="userFilter = 'all'">
                    <div class="box">
                        <h2 class="is-6">All Users</h2>
                        <span class="is-size-3 has-text-info">
                            {{ build.users.length }}
                        </span>
                    </div>
                </a>
            </div>
            <div class="column">
                <a class="filter-admin" @click="userFilter = 'admin'">
                    <div class="box">
                        <h2 class="is-6">Admin Users</h2>
                        <span class="is-size-3 has-text-info">
                            {{ adminUsersCount }}
                        </span>
                    </div>
                </a>
            </div>
            <div class="column">
                <a class="filter-regular" @click="userFilter = 'regular'">
                    <div class="box">
                        <h2 class="is-6">Regular Users</h2>
                        <span class="is-size-3 has-text-info">
                            {{ regularUsersCount }}
                        </span>
                    </div>
                </a>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <div class="box users-table is-paddingless">
                    <table class="table is-hoverable is-fullwidth">
                        <tbody>
                            <tr class="users-table-header">
                                <td colspan="2">
                                    <span
                                        class="heading is-size-6 is-marginless"
                                    >
                                        Users
                                    </span>
                                </td>
                            </tr>
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
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        build: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            userFilter: '',
        };
    },
    computed: {
        adminUsersCount() {
            return this.build.users.filter(user => user.role === 'admin').length;
        },
        filteredUsers(filter) {
            let users = this.build.users;

            if (this.userFilter) {
                const userFilter = this.userFilter;

                if (userFilter === 'admin') {
                    return users.filter(user => user.role === 'admin');
                } else if (userFilter === 'regular') {
                    console.log('hi')
                    return users.filter(user => user.role === 'regular user');
                }
            }

            return users;
        },
        regularUsersCount() {
            return this.build.users.filter(user => user.role === 'regular user').length;
        },
    },
};
</script>
