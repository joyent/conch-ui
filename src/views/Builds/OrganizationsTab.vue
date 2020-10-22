<template>
    <div class="organizations-tab">
        <spinner v-if="fetchingData"></spinner>
        <div v-else class="columns">
            <div class="column">
                <div class="organizations-table is-paddingless">
                    <div class="datatable-header">
                        <span class="heading is-size-6 is-marginless">{{
                            `Organizations (${filteredOrganizations.length})`
                        }}</span>
                        <div class="control has-icons-left has-icons-right">
                            <input
                                type="text"
                                class="input search"
                                v-model="searchText"
                                placeholder="Search..."
                            />
                            <span class="icon is-small is-left">
                                <i class="material-icons search">search</i>
                            </span>
                        </div>
                        <div class="select-with-label role">
                            <label class="select-label">Role</label>
                            <div class="select role-type">
                                <select
                                    v-model="roleFilter"
                                    class="is-capitalized"
                                    @change="changeFilter($event)"
                                >
                                    <option value="all">All</option>
                                    <option value="admin">Admin</option>
                                    <option value="regular">
                                        Regular Member
                                    </option>
                                </select>
                            </div>
                        </div>
                        <i
                            class="material-icons has-text-success add-organization"
                            @click="showAddOrganizationModal()"
                        >
                            add_circle
                        </i>
                    </div>
                    <table
                        class="table is-hoverable is-fullwidth"
                        v-if="filteredOrganizations.length"
                    >
                        <thead>
                            <th v-for="header in headers" :key="header">
                                <a
                                    class="table-header-filter is-capitalized"
                                    :class="{
                                        'has-text-white': sortBy === header,
                                    }"
                                    @click="sort()"
                                >
                                    {{ header }}
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="
                                            sortBy === header && !reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="
                                            sortBy === header && reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th></th>
                        </thead>
                        <tfoot v-if="filteredOrganizations.length > 10">
                            <th
                                class="is-capitalized"
                                v-for="header in headers"
                                :key="header"
                            >
                                {{ header }}
                            </th>
                            <th></th>
                        </tfoot>
                        <tbody>
                            <tr
                                class="row"
                                v-for="organization in filteredOrganizations"
                                :key="organization.id"
                                @click="
                                    $router.push({
                                        name: 'organization',
                                        params: { id: organization.id },
                                    })
                                "
                                style="cursor: pointer;"
                            >
                                <td class="name">
                                    <span>{{ organization.name }}</span>
                                </td>
                                <td class="role">
                                    <span v-if="organization.role === 'admin'">
                                        Admin
                                    </span>
                                    <span v-else>Regular User</span>
                                </td>
                                <td class="remove-item has-text-right">
                                    <i
                                        class="fas fa-trash-alt remove-organization"
                                        @click="
                                            showRemoveOrganizationModal(
                                                organization
                                            )
                                        "
                                    ></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="no-results" v-else>
                        <p class="subtitle has-text-centered">
                            No Results to Display
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <RemoveItemModal
            v-if="removeOrganization"
            :item="removingOrganization"
            item-type="organization"
        />
        <AddOrganizationModal v-if="addOrganization" />
    </div>
</template>

<script>
import search from 'fuzzysearch';
import isEmpty from 'lodash/isEmpty';
import AddOrganizationModal from './AddOrganizationsModal.vue';
import RemoveItemModal from './RemoveItemModal.vue';
import Spinner from '../components/Spinner.vue';
import { EventBus } from '@src/eventBus.js';
import {
    getBuildOrganizations,
    removeOrganizationFromBuild,
} from '@api/builds.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        AddOrganizationModal,
        RemoveItemModal,
        Spinner,
    },
    data() {
        return {
            addOrganization: false,
            fetchingData: false,
            headers: ['name', 'role'],
            removeOrganization: false,
            removingOrganization: {},
            roleFilter: 'all',
            reversedSort: false,
            searchText: '',
            sortBy: '',
        };
    },
    methods: {
        ...mapActions(['setCurrentBuild', 'setCurrentBuildOrganizations']),
        changeFilter(event) {
            this.$router.push({
                name: 'build-organizations',
                params: { id: this.currentBuild.id },
                query: {
                    role:
                        (event && event.target && event.target.value) || 'all',
                },
            });
        },
        closeModal() {
            this.addOrganization = false;
            this.removeOrganization = false;
            this.removingOrganization = {};
        },
        async fetchData() {
            this.fetchingData = true;

            const buildId = this.$route.params.id;
            const currentBuild = this.currentBuild;
            const currentBuildOrganizations = this.currentBuildOrganizations;

            if (
                !currentBuild ||
                isEmpty(currentBuild) ||
                currentBuild.id !== buildId
            ) {
                const organizationsResponse = await getBuildOrganizations(
                    buildId
                );
                this.setCurrentBuildOrganizations(organizationsResponse.data);
            } else if (
                !currentBuildOrganizations ||
                currentBuildOrganizations.length === 0
            ) {
                const organizationsResponse = await getBuildOrganizations(
                    buildId
                );
                this.setCurrentBuildOrganizations(organizationsResponse.data);
            }

            // Process route queries
            if (this.$route.query && this.$route.query.role) {
                this.roleFilter = this.$route.query.role;
            }

            this.fetchingData = false;
        },
        refetchCurrentBuildOrganizations() {
            getBuildOrganizations(this.currentBuild.id).then(response => {
                this.setCurrentBuildOrganizations(response.data);
            });
        },
        removeOrganizationFromBuild() {
            removeOrganizationFromBuild(
                this.currentBuild.id,
                this.removingOrganization.id
            ).then(() => {
                EventBus.$emit('item-removed');

                this.refetchCurrentBuildOrganizations();
            });
        },
        showAddOrganizationModal() {
            this.addOrganization = true;
        },
        showRemoveOrganizationModal(organization) {
            this.removingOrganization = organization;
            this.removeOrganization = true;
        },
    },
    computed: {
        ...mapState(['currentBuild', 'currentBuildOrganizations']),
        filteredOrganizations() {
            let organizations = this.currentBuildOrganizations;

            if (this.searchText) {
                const searchText = this.searchText.toLowerCase();

                organizations = organizations.reduce((acc, organization) => {
                    const name = organization.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(organization);
                    }

                    return acc;
                }, []);
            }

            if (this.roleFilter !== 'all') {
                const roleFilter = this.roleFilter;

                if (roleFilter === 'admin') {
                    return organizations.filter(
                        organization => organization.role === 'admin'
                    );
                } else if (roleFilter === 'regular') {
                    return organizations.filter(
                        organization => organization.role !== 'admin'
                    );
                }
            }

            return organizations;
        },
    },
    created() {
        this.fetchData();

        EventBus.$on(
            ['close-modal:add-item', 'close-modal:remove-item'],
            () => {
                this.closeModal();
            }
        );

        EventBus.$on('remove-item:organization', () => {
            this.removeOrganizationFromBuild();
        });

        EventBus.$on('organizations-added-to-build', () => {
            this.refetchCurrentBuildOrganizations();
        });
    },
};
</script>
