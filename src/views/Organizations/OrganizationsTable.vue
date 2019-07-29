<template>
    <div class="organizations-table">
        <table class="table is-hoverable is-fullwidth">
            <thead>
                <th>Name</th>
                <th class="has-text-centered">Admin Users</th>
                <th class="has-text-centered">Regular Users</th>
                <th class="has-text-centered">Builds</th>
                <th class="has-text-centered">Workspaces</th>
                <th></th>
            </thead>
            <tfoot v-if="organizations.length >= 10">
                <th>Name</th>
                <th class="has-text-centered">Admin Users</th>
                <th class="has-text-centered">Regular Users</th>
                <th class="has-text-centered">Builds</th>
                <th class="has-text-centered">Workspaces</th>
                <th></th>
            </tfoot>
            <tbody>
                <tr
                    v-for="organization in organizations"
                    :key="organization.name"
                >
                    <td>{{ organization.name }}</td>
                    <td class="has-text-centered">
                        {{ organization.adminUsers }}
                    </td>
                    <td class="has-text-centered">
                        {{ organization.regularUsers }}
                    </td>
                    <td class="has-text-centered">
                        {{ organization.builds }}
                    </td>
                    <td class="has-text-centered">
                        {{ organization.workspaces }}
                    </td>
                    <td class="has-text-right">
                        <a
                            class="button view-organization"
                            @click="viewOrganization(organization.id)"
                        >
                            View Organization
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        organizations: {
            type: Array,
            required: true,
        },
    },
    methods: {
        viewOrganization(organizationId) {
            this.$router.push({
                name: 'organization',
                params: {
                    organizationId,
                },
            });
        },
    },
};
</script>
