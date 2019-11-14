<template>
    <div class="organizations-tab">
        <div class="columns">
            <div class="column">
                <div class="members-table is-paddingless">
                    <div class="datatable-header">
                        <span class="heading is-size-6 is-marginless">
                            Organizations
                        </span>
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
                        <i
                            class="material-icons has-text-success"
                            @click="showAddOrganizationModal()"
                        >
                            add_circle
                        </i>
                    </div>
                    <table
                        class="table is-hoverable is-fullwidth"
                        v-if="
                            filteredOrganizations &&
                                filteredOrganizations.length > 0
                        "
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
                            >
                                <td class="name">
                                    <span>{{ organization.name }}</span>
                                </td>
                                <td class="role">
                                    <span>{{ organization.role }}</span>
                                </td>
                                <td class="remove-item has-text-right">
                                    <i
                                        class="fas fa-trash-alt"
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
import AddOrganizationModal from './AddOrganizationsModal.vue';
import RemoveItemModal from './RemoveItemModal.vue';
import { EventBus } from '@src/eventBus.js';
import * as Builds from '@api/builds.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        AddOrganizationModal,
        RemoveItemModal,
    },
    props: {
        buildId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            addOrganization: false,
            headers: ['name', 'role'],
            removeOrganization: false,
            removingOrganization: {},
            reversedSort: false,
            searchText: '',
            sortBy: '',
        };
    },
    methods: {
        ...mapActions(['setCurrentBuildOrganizations']),
        closeModal() {
            this.addOrganization = false;
            this.removeOrganization = false;
            this.removingOrganization = {};
        },
        refetchCurrentBuildOrganizations() {
            Builds.getBuildOrganizations(this.buildId).then(response => {
                this.setCurrentBuildOrganizations(response.data);
            });
        },
        removeOrganizationFromBuild() {
            Builds.removeOrganizationFromBuild(
                this.buildId,
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
        ...mapState(['currentBuildOrganizations']),
        filteredOrganizations() {
            let organizations = this.currentBuildOrganizations;

            if (this.searchText) {
                const searchText = this.searchText.toLowerCase();

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
        EventBus.$on('close-modal:remove-item', () => {
            this.closeModal();
        });

        EventBus.$on('remove-item:organization', () => {
            this.removeOrganizationFromBuild();
        });

        EventBus.$on('organizations-added-to-build', () => {
            this.refetchCurrentBuildOrganizations();
        });
    },
};
</script>
