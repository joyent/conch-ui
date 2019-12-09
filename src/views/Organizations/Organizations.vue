<template>
    <Spinner v-if="organizations.length < 1 && !noOrganizationsExist" />
    <div class="organizations" v-else>
        <div class="empty-state" v-if="noOrganizationsExist">
            <img src="../../assets/organization.svg" width="500" />
            <p class="empty-state-heading">No Organizations exist.</p>
            <a
                class="button is-info create-organization"
                @click="createOrganization()"
            >
                Create an Organization
            </a>
        </div>
        <template v-else>
            <div class="page-heading">
                <h1 class="title is-3 has-text-weight-bold">Organizations</h1>
                <div class="control has-icons-left">
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
                <div class="views">
                    <a class="button is-text" @click="toggleView()">
                        <template v-if="activeView === 'grid'">
                            <i class="material-icons view-list">
                                view_headline
                            </i>
                            <span>Table View</span>
                        </template>
                        <template v-else-if="activeView === 'list'">
                            <i class="material-icons view-grid">apps</i>
                            <span>Grid View</span>
                        </template>
                    </a>
                </div>
                <a
                    class="button is-success create-organization"
                    @click="createOrganization()"
                >
                    Create Organization
                </a>
            </div>
            <div
                class="no-results title is-4 has-text-white has-text-centered"
                v-if="!filteredOrganizations.length && searchText"
            >
                <p>No results found.</p>
            </div>
            <div class="cards" v-if="activeView === 'grid'">
                <div
                    class="card"
                    v-for="organization in filteredOrganizations"
                    :key="organization.id"
                >
                    <div class="card-content">
                        <i
                            class="material-icons close"
                            @click="showConfirmationModal(organization)"
                        >
                            close
                        </i>
                        <i class="material-icons">recent_actors</i>
                        <p class="organization-name">{{ organization.name }}</p>
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
                :has-search-text="searchText.length > 0"
                v-else
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
            activeView: 'grid',
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
        toggleView() {
            if (this.activeView === 'list') {
                this.activeView = 'grid';
            } else {
                this.activeView = 'list';
            }
        },
        viewOrganization(organizationId) {
            this.$router.push({
                name: 'organization',
                params: { organizationId },
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
