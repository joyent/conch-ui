<template>
    <div class="organizations-table">
        <table
            class="table is-hoverable is-fullwidth"
            v-if="this.organizations.length"
        >
            <thead>
                <th>Name</th>
                <th class="has-text-centered">Admin Users</th>
                <th class="has-text-centered">Regular Users</th>
                <th class="has-text-centered">Builds Completed</th>
                <th class="has-text-centered">Builds In Progress</th>
                <th></th>
            </thead>
            <tfoot v-if="organizations.length >= 10">
                <th>Name</th>
                <th class="has-text-centered">Admin Users</th>
                <th class="has-text-centered">Regular Users</th>
                <th class="has-text-centered">Builds Completed</th>
                <th class="has-text-centered">Builds In Progress</th>
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
                        {{ getCompletedBuildsCount(organization.builds) }}
                    </td>
                    <td class="has-text-centered">
                        {{ getInProgressBuildsCount(organization.builds) }}
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
        getAdminUserCount(organization) {
            return organization.users.filter(user => user.role === 'admin')
                .length;
        },
        getCompletedBuildsCount(builds) {
            return builds.filter(build => build.completed !== null).length;
        },
        getInProgressBuildsCount(builds) {
            return builds.filter(build => build.compelted === null).length;
        },
        getRegularUserCount(organization) {
            return organization.users.filter(user => user.role !== 'admin')
                .length;
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
    created() {
        this.initializeData();
    },
};
</script>
