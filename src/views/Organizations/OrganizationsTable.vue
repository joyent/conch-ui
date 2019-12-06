<template>
    <div class="organizations-table">
        <table class="table is-hoverable is-fullwidth" v-if="hasOrganizations">
            <thead>
                <th>Name</th>
                <th class="has-text-centered">Admin Users</th>
                <th class="has-text-centered">Regular Users</th>
                <th class="has-text-centered">Total Build Count</th>
                <th></th>
            </thead>
            <tfoot v-if="hasOrganizations && organizations.length >= 10">
                <th>Name</th>
                <th class="has-text-centered">Admin Users</th>
                <th class="has-text-centered">Regular Users</th>
                <th class="has-text-centered">Total Build Count</th>
                <th></th>
            </tfoot>
            <tbody>
                <tr
                    class="row view-organization"
                    v-for="organization in organizations"
                    :key="organization.name"
                    @click="viewOrganizationPage(organization.id)"
                >
                    <td>{{ organization.name }}</td>
                    <td class="has-text-centered">
                        {{ getAdminUserCount(organization) }}
                    </td>
                    <td class="has-text-centered">
                        {{ getRegularUserCount(organization) }}
                    </td>
                    <td class="has-text-centered">
                        <span v-if="organizationBuildCount(organization) > 0">
                            {{ organizationBuildCount(organization) }}
                        </span>
                        <span v-else>0</span>
                    </td>
                    <td class="has-text-right">
                        <a class="button">View Organization</a>
                    </td>
                </tr>
            </tbody>
        </table>
        <table
            class="table is-hoverable is-fullwidth"
            v-else-if="!organizations.length && !hasSearchText"
        >
            <tbody>
                <tr class="row">
                    <td colspan="5"><Spinner /></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import Spinner from '@src/views/components/Spinner.vue';

export default {
    props: {
        organizations: {
            type: Array,
            required: true,
        },
        hasSearchText: {
            type: Boolean,
            required: true,
        },
    },
    components: {
        Spinner,
    },
    methods: {
        getAdminUserCount(organization) {
            if (
                organization &&
                organization.users &&
                organization.users.length
            ) {
                return organization.users.filter(user => user.role === 'admin')
                    .length;
            }

            return 0;
        },
        getRegularUserCount(organization) {
            if (
                organization &&
                organization.users &&
                organization.users.length
            ) {
                return organization.users.filter(user => user.role !== 'admin')
                    .length;
            }

            return 0;
        },
        organizationBuildCount(organization) {
            if (
                organization &&
                organization.builds &&
                organization.builds.length
            ) {
                return organization.builds.length;
            }

            return 0;
        },
        viewOrganizationPage(organizationId) {
            this.$router.push({
                name: 'organization',
                params: {
                    organizationId,
                },
            });
        },
    },
    computed: {
        hasOrganizations() {
            return this.organizations && this.organizations.length;
        },
    },
};
</script>
