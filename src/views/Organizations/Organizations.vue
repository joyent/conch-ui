<template>
    <div class="organizations">
        <div class="page-heading">
            <h1 class="title is-3 has-text-weight-bold">
                Organizations
            </h1>
            <div class="control has-icons-left">
                <input
                    type="text"
                    class="input"
                    placeholder="Search Organizations"
                    v-model="searchText"
                />
                <span class="icon is-small is-left">
                    <i class="fas fa-search"></i>
                </span>
            </div>
            <div class="views">
                <i
                    class="material-icons view-grid"
                    :class="{ 'has-text-info': activeView === 'grid' }"
                    @click="activeView = 'grid'"
                >
                    view_module
                </i>
                <i
                    class="material-icons view-list"
                    :class="{ 'has-text-info': activeView === 'list' }"
                    @click="activeView = 'list'"
                >
                    view_headline
                </i>
            </div>
            <i
                class="material-icons add-organization"
                @click="addOrganization()"
            >
                add_circle
            </i>
        </div>
        <div class="cards" v-if="activeView === 'grid'">
            <div
                class="card"
                v-for="organization in filteredOrganizations"
                :key="organization.created"
            >
                <div class="card-content">
                    <i class="material-icons">recent_actors</i>
                    <p class="organization-title">
                        {{ organization.name }}
                    </p>
                    <p class="organization-desc">
                        {{ organization.description }}
                    </p>
                    <a
                        class="button"
                        @click="viewOrganization(organization.id)"
                    >
                        View Organization
                    </a>
                </div>
            </div>
        </div>
        <OrganizationsTable
            :organizations="filteredOrganizations"
            v-else-if="activeView === 'list'"
        />
        <transition name="fade">
            <AddOrganizationModal v-if="addingOrganization" />
        </transition>
    </div>
</template>

<script>
import search from 'fuzzysearch';
import AddOrganizationModal from './AddOrganizationModal.vue';
import OrganizationsTable from './OrganizationsTable.vue';
import { EventBus } from '@src/eventBus.js';
import { getOrganizations } from '@api/organizations.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        AddOrganizationModal,
        OrganizationsTable,
    },
    data() {
        return {
            activeView: 'grid',
            addingOrganization: false,
            isActive: false,
            isHovered: '',
            // organizations: [
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'First Build Team',
            //         memberCount: 15,
            //         adminUsers: 1,
            //         regularUsers: 14,
            //         builds: 5,
            //         workspaces: 4,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'Ceres Build Team',
            //         memberCount: 50,
            //         adminUsers: 2,
            //         regularUsers: 48,
            //         builds: 10,
            //         workspaces: 5,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'APAC Build Team',
            //         memberCount: 25,
            //         adminUsers: 3,
            //         regularUsers: 22,
            //         builds: 5,
            //         workspaces: 4,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'NetOps Build Team',
            //         memberCount: 5,
            //         adminUsers: 1,
            //         regularUsers: 4,
            //         builds: 2,
            //         workspaces: 4,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'Server Maintenance Team',
            //         memberCount: 10,
            //         adminUsers: 1,
            //         regularUsers: 9,
            //         builds: 1,
            //         workspaces: 4,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'Data Center Build Team',
            //         memberCount: 29,
            //         adminUsers: 1,
            //         regularUsers: 28,
            //         builds: 5,
            //         workspaces: 4,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'Joyent Build Team',
            //         memberCount: 18,
            //         adminUsers: 2,
            //         regularUsers: 16,
            //         builds: 6,
            //         workspaces: 4,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'Integrator Build Team',
            //         memberCount: 8,
            //         adminUsers: 2,
            //         regularUsers: 6,
            //         builds: 2,
            //         workspaces: 4,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'Google Build Team',
            //         memberCount: 40,
            //         adminUsers: 4,
            //         regularUsers: 36,
            //         builds: 15,
            //         workspaces: 4,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'Samsung Build Team',
            //         memberCount: 30,
            //         adminUsers: 1,
            //         regularUsers: 29,
            //         builds: 8,
            //         workspaces: 4,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'Apple Build Team',
            //         memberCount: 12,
            //         adminUsers: 1,
            //         regularUsers: 11,
            //         builds: 3,
            //         workspaces: 4,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'Linux Build Team',
            //         memberCount: 40,
            //         adminUsers: 4,
            //         regularUsers: 36,
            //         builds: 15,
            //         workspaces: 12,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'CloudOps Build Team',
            //         memberCount: 10,
            //         adminUsers: 1,
            //         regularUsers: 9,
            //         builds: 2,
            //         workspaces: 4,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'Samsung Internet Team',
            //         memberCount: 15,
            //         adminUsers: 2,
            //         regularUsers: 13,
            //         builds: 2,
            //         workspaces: 10,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            //     {
            //         id: 'a2dbe92ledsa99d',
            //         name: 'Infrastructure Team',
            //         memberCount: 20,
            //         adminUsers: 2,
            //         regularUsers: 18,
            //         builds: 2,
            //         workspaces: 5,
            //         desc: 'Cloud build engineers assigned to the Ceres build. Tasks include rack builds, net ops and general maintenance',
            //     },
            // ],
            searchText: '',
        };
    },
    methods: {
        ...mapActions(['setOrganizations']),
        addOrganization() {
            this.addingOrganization = true;
        },
        closeModal() {
            this.addingOrganization = false;
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
    computed: {
        ...mapState(['organizations']),
        filteredOrganizations() {
            const searchText = this.searchText.toLowerCase();
            let organizations = this.organizations;

            if (searchText) {
                return organizations.reduce((acc, organization) => {
                    const name = organization.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(organization);
                    }

                    return acc;
                }, []);
            }

            return organizations;
        },
    },
    created() {
        if (!this.organizations.length) {
            getOrganizations().then(response => {
                this.setOrganizations(response.data);
            });
        }
    },
    mounted() {
        EventBus.$on('close-modal:add-organization', () => {
            this.closeModal();
        });

        EventBus.$on('organization-created', () => {
            getOrganizations().then(response => {
                this.setOrganizations(response.data);
            });
        });
    },
};
</script>
