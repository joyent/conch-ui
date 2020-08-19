<template>
    <div class="organizations-table">
        <table class="table is-hoverable is-fullwidth" v-if="hasOrganizations">
            <thead>
                <th>Name</th>
                <th>Admin Users</th>
                <th>Regular Users</th>
                <th>Total Build Count</th>
                <th></th>
            </thead>
            <tfoot v-if="hasOrganizations && organizations.length >= 10">
                <th>Name</th>
                <th>Admin Users</th>
                <th>Regular Users</th>
                <th>Total Build Count</th>
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
                    <td>
                        {{ getAdminUserCount(organization) }}
                    </td>
                    <td>
                        {{ getRegularUserCount(organization) }}
                    </td>
                    <td>
                        <span v-if="organizationBuildCount(organization) > 0">
                            {{ organizationBuildCount(organization) }}
                        </span>
                        <span v-else>0</span>
                    </td>
                    <td class="has-text-right">
                        <span
                            v-if="currentUser && currentUser.is_admin"
                            class="icon"
                            @click.stop="showConfirmDeleteModal(organization)"
                        >
                            <i class="material-icons has-text-danger">delete</i>
                        </span>
                        <a v-else class="button">View Organization</a>
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
import { mapState } from 'vuex';
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
    data() {
        return {
            organization: {},
        };
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
        showConfirmDeleteModal(organization) {
            this.$emit('delete-organization', { organization });
        },
        viewOrganizationPage(id) {
            this.$router.push({
                name: 'organization',
                params: { id },
            });
        },
    },
    computed: {
        ...mapState(['currentUser']),
        hasOrganizations() {
            return this.organizations && this.organizations.length;
        },
    },
};
</script>
