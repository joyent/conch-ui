<template>
    <Spinner v-if="organizations.length < 1 && !noOrganizationsExist" />
    <router-view v-else-if="$route.params && $route.params.id"></router-view>
    <div class="organizations" v-else>
        <div class="empty-state" v-if="noOrganizationsExist">
            <img src="../../assets/organization.svg" width="500" />
            <template v-if="currentUser && currentUser.is_admin">
                <p class="empty-state-heading">No organizations exist.</p>
                <a
                    class="button is-info create-organization"
                    @click="createOrganization()"
                >
                    Create an Organization
                </a>
            </template>
            <p v-else class="empty-state-heading">
                You don't have access to any organizations.
            </p>
        </div>
        <template v-else>
            <div
                class="page-heading"
                style="display: flex; align-items: center; margin-bottom: 20px"
            >
                <span class="icon">
                    <i class="material-icons">recent_actors</i>
                </span>
                <h1
                    class="title is-4 has-text-weight-bold"
                    style="margin-left: 8px;"
                >
                    Organizations
                </h1>
            </div>
            <div style="display: flex">
                <div
                    class="control has-icons-left"
                    style="margin-bottom: 20px; margin-right: 20px; flex-grow: 1"
                >
                    <input
                        type="text"
                        class="input search"
                        placeholder="Search..."
                        v-model="searchText"
                    />
                    <span class="icon is-small is-left">
                        <i class="material-icons">search</i>
                    </span>
                </div>
                <a
                    v-if="currentUser && currentUser.is_admin"
                    class="button is-success create-new"
                    @click="createOrganization()"
                >
                    <span class="icon">
                        <i class="material-icons">add</i>
                    </span>
                    <span>Create New</span>
                </a>
            </div>
            <div
                class="no-results title is-4 has-text-white has-text-centered"
                v-if="!filteredOrganizations.length && searchText"
            >
                <p>No results found.</p>
            </div>
            <OrganizationsTable
                :organizations="filteredOrganizations"
                :has-search-text="searchText.length > 0"
                @delete-organization="confirmDeleteOrganization"
            />
        </template>
        <transition name="fade">
            <AddOrganizationModal v-if="creatingOrganization" />
        </transition>
        <transition name="fade">
            <div class="remove-item-modal" v-if="deletingOrganization">
                <div class="modal is-active">
                    <div class="modal-background" @click="closeModal()"></div>
                    <div class="modal-card">
                        <header class="modal-card-head">
                            <p class="modal-card-title">Confirm Removal</p>
                            <i
                                class="material-icons close"
                                @click="closeModal()"
                            >
                                close
                            </i>
                        </header>
                        <section class="modal-card-body">
                            <p>
                                Are you sure you want to remove
                                <span
                                    class="has-text-white has-text-weight-bold"
                                >
                                    {{ organizationBeingEdited.name }}?
                                </span>
                            </p>
                            <br />
                            <article class="notification">
                                <i class="material-icons">warning</i>
                                <p>This action cannot be undone.</p>
                            </article>
                            <br />
                            <div class="buttons-group">
                                <a class="button cancel" @click="closeModal()">
                                    Cancel
                                </a>
                                <a
                                    class="button is-danger confirm"
                                    :class="{ 'is-loading': isLoading }"
                                    @click="deleteOrganization()"
                                >
                                    Confirm
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <SuccessModal
                v-if="showSuccessModal === true"
                :item="organizationBeingEdited.name"
                :action="action"
            />
        </transition>
    </div>
</template>

<script>
import search from 'fuzzysearch';
import AddOrganizationModal from './AddOrganizationModal.vue';
import OrganizationsTable from './OrganizationsTable.vue';
import SuccessModal from '../components/SuccessModal.vue';
import Spinner from '../components/Spinner.vue';
import { EventBus } from '@src/eventBus.js';
import * as Organizations from '@api/organizations.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        AddOrganizationModal,
        OrganizationsTable,
        Spinner,
        SuccessModal,
    },
    data() {
        return {
            action: '',
            creatingOrganization: false,
            deletingOrganization: false,
            isLoading: false,
            noOrganizationsExist: false,
            organizationBeingEdited: {},
            searchText: '',
            showSuccessModal: false,
        };
    },
    methods: {
        ...mapActions(['setOrganizations']),
        createOrganization() {
            this.creatingOrganization = true;
        },
        closeModal() {
            this.action = '';
            this.creatingOrganization = false;
            this.deletingOrganization = false;
            this.organizationBeingEdited = {};
            this.showSuccessModal = false;
        },
        closeCreateOrganizationModal() {
            this.creatingOrganization = false;
        },
        confirmDeleteOrganization(data) {
            this.organizationBeingEdited = data.organization;
            this.deletingOrganization = true;
        },
        async deleteOrganization() {
            this.isLoading = true;
            this.action = 'delete';

            await Organizations.deleteOrganization(
                this.organizationBeingEdited.id
            );

            await Organizations.getOrganizations().then(response => {
                this.setOrganizations(response.data);
            });

            EventBus.$emit('organization-deleted');

            this.getOrganizations();

            this.deletingOrganization = false;
            this.showSuccessModal = true;
            this.isLoading = false;
        },
        getOrganizations() {
            Organizations.getOrganizations().then(response => {
                const organizations = response.data;

                if (organizations.length) {
                    this.setOrganizations(organizations);
                } else {
                    this.noOrganizationsExist = true;
                }
            });
        },
        showConfirmationModal(organization) {
            this.organizationBeingEdited = organization;
            this.deletingOrganization = true;
        },
        viewOrganization(organizationId) {
            this.$router.push({
                name: 'organization',
                params: { id: organizationId },
            });
        },
    },
    computed: {
        ...mapState(['currentUser', 'organizations']),
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
            this.getOrganizations();
        }
    },
    mounted() {
        EventBus.$on('close-modal:create-organization', () => {
            this.closeCreateOrganizationModal();
        });

        EventBus.$on('organization-created', data => {
            this.action = 'create';
            this.noOrganizationsExist = false;
            this.organizationBeingEdited.name = data.name;
            this.showSuccessModal = true;

            Organizations.getOrganizations().then(response => {
                this.setOrganizations(response.data);
            });
        });
    },
};
</script>
