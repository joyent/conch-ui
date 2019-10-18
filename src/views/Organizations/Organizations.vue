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
                    placeholder="Search organizations"
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
                            list_alt
                        </i>
                        <span>Table View</span>
                    </template>
                    <template v-else-if="activeView === 'list'">
                        <i class="material-icons view-grid">
                            apps
                        </i>
                        <span>Grid View</span>
                    </template>
                </a>
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
                <div
                    class="card-content"
                    @mouseover="showDeleteOrganizationButton = organization.id"
                    @mouseleave="showDeleteOrganizationButton = ''"
                >
                    <i
                        class="material-icons close"
                        v-if="showDeleteOrganizationButton === organization.id"
                        @click="showConfirmationModal(organization)"
                    >
                        close
                    </i>
                    <i class="material-icons">recent_actors</i>
                    <p class="organization-name">
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
            :has-search-text="searchText.length > 0"
            v-else-if="activeView === 'list'"
        />
        <transition name="fade">
            <AddOrganizationModal v-if="addingOrganization" />
            <div class="delete-organization-modal" v-if="isActive">
                <div class="modal" :class="{ 'is-active': isActive }">
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
                                {{ organizationBeingRemoved.name }}?
                            </p>
                            <br />
                            <article class="notification">
                                <i class="material-icons">warning</i>
                                <p>This action cannot be undone.</p>
                            </article>
                            <br />
                            <div class="buttons-group">
                                <a class="button" @click="closeModal()">
                                    Cancel
                                </a>
                                <a
                                    class="button is-danger"
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
            <div
                class="delete-organization-success-modal"
                v-if="showSuccessModal === true"
            >
                <div class="modal is-active">
                    <div
                        class="modal-background"
                        @click="showSuccessModal = false"
                    ></div>
                    <div class="modal-card">
                        <header class="modal-card-head">
                            <p class="modal-card-title">Success!</p>
                            <i
                                class="material-icons close"
                                @click="closeModal()"
                            >
                                close
                            </i>
                        </header>
                        <section class="modal-card-body">
                            <p>
                                {{ organizationBeingRemoved.name }} has been
                                removed.
                            </p>
                            <br />
                            <a
                                class="button is-success"
                                @click="showSuccessModal = false"
                            >
                                Close
                            </a>
                        </section>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import search from 'fuzzysearch';
import AddOrganizationModal from './AddOrganizationModal.vue';
import OrganizationsTable from './OrganizationsTable.vue';
import { EventBus } from '@src/eventBus.js';
import * as Organizations from '@api/organizations.js';
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
            isLoading: false,
            organizationBeingRemoved: {},
            showDeleteOrganizationButton: '',
            showSuccessModal: false,
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
            this.isActive = false;
            this.removingOrganization = false;
        },
        async deleteOrganization() {
            this.isLoading = true;

            await Organizations.deleteOrganization(
                this.organizationBeingRemoved.id
            );

            await Organizations.getOrganizations().then(response => {
                this.setOrganizations(response.data);
            });

            this.isActive = false;
            this.showSuccessModal = true;
            this.isLoading = false;
        },
        showConfirmationModal(organization) {
            this.organizationBeingRemoved = organization;
            this.isActive = true;
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
            Organizations.getOrganizations().then(response => {
                this.setOrganizations(response.data);
            });
        }
    },
    mounted() {
        EventBus.$on('close-modal:add-organization', () => {
            this.closeModal();
        });

        EventBus.$on('organization-created', () => {
            Organizations.getOrganizations().then(response => {
                this.setOrganizations(response.data);
            });
        });
    },
};
</script>
