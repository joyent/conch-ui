<template>
    <div class="box user-stats is-flex" style="margin-bottom: 20px;">
        <span style="margin-right: 20px;">
            <h1 class="title is-4">Statistics:</h1>
        </span>
        <div class="tags has-addons">
            <span class="tag is-info">Total Users</span>
            <span class="tag is-dark">{{ users.length }}</span>
        </div>
        <div class="tags has-addons">
            <span class="tag is-info">Admins</span>
            <span class="tag is-dark">{{ adminUsersCount }}</span>
        </div>
        <div class="tags has-addons">
            <span class="tag is-info">Inactive</span>
            <span class="tag is-dark">{{ inactiveUsersCount }}</span>
        </div>
        <div class="tags has-addons">
            <span class="tag is-info">Password Resets</span>
            <span class="tag is-dark">{{ passwordResetCount }}</span>
        </div>
        <div class="tags has-addons">
            <span class="tag is-info">Refuse Session Auth</span>
            <span class="tag is-dark">
                {{ refusedSessionAuthCount }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        users: {
            type: Array,
            required: true,
        },
    },
    computed: {
        adminUsersCount() {
            return this.users.filter(user => user.is_admin === true).length;
        },
        inactiveUsersCount() {
            return this.users.filter(user => user.last_login == null).length;
        },
        passwordResetCount() {
            return this.users.filter(user => user.force_password_change === true).length;
        },
        refusedSessionAuthCount() {
            return this.users.filter(user => user.refuse_session_auth === true).length;
        },
    },
};
</script>
