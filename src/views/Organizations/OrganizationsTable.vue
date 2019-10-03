<template>
    <div class="organizations-table">
        <table class="table is-hoverable is-fullwidth" v-if="this.users.length">
            <thead>
                <th>Name</th>
                <th class="has-text-centered">Admin Users</th>
                <th class="has-text-centered">Regular Users</th>
                <th class="has-text-centered">Builds</th>
                <th></th>
            </thead>
            <tfoot v-if="organizations.length >= 10">
                <th>Name</th>
                <th class="has-text-centered">Admin Users</th>
                <th class="has-text-centered">Regular Users</th>
                <th class="has-text-centered">Builds</th>
                <th></th>
            </tfoot>
            <tbody>
                <tr
                    class="row view-organization"
                    v-for="organization in organizations"
                    :key="organization.name"
                    @click="viewOrganization(organization.id)"
                >
                    <td>{{ organization.name }}</td>
                    <td class="has-text-centered">
                        {{ getAdminUsersCount(organization.id) }}
                    </td>
                    <td class="has-text-centered">
                        {{ getRegularUsersCount(organization.id) }}
                    </td>
                    <td class="has-text-centered">
                        {{ organization.builds.length }}
                    </td>
                    <td class="has-text-right">
                        <a class="button">
                            View Organization
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="table is-hoverable is-fullwidth" v-else>
            <tbody>
                <tr class="row">
                    <td colspan="5">
                        <Spinner />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import Spinner from '@src/views/components/Spinner.vue';
import { getOrganizationUsers } from '@api/organizations.js';

export default {
    props: {
        organizations: {
            type: Array,
            required: true,
        },
    },
    components: {
        Spinner,
    },
    data() {
        return {
            users: [],
        };
    },
    methods: {
        async initializeData() {
            await this.getUsers();
        },
        getUsers() {
            this.organizations.forEach(organization => {
                const organizationId = organization.id;
                getOrganizationUsers(organizationId).then(response => {
                    this.users.push({
                        id: organizationId,
                        users: response.data,
                    });
                });
            });
        },
        getAdminUsersCount(organizationId) {
            if (this.users.length) {
                const organization = this.users.find(
                    org => org.id === organizationId
                );

                return organization.users.filter(
                    user => user.role === 'admin'
                ).length;
            }
        },
        getRegularUsersCount(organizationId) {
            if (this.users.length) {
                const organization = this.users.find(
                    organization => organization.id === organizationId
                );

                return organization.users.filter(
                    user => user.role !== 'admin'
                ).length;
            }
        },
        viewOrganization(organizationId) {
            this.$router.push({
                name: 'organization',
                params: {
                    organizationId,
                },
            });
        },
    },
    created() {
        this.initializeData();
    },
};
</script>
