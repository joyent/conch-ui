<template>
    <transition name="fade">
        <div
            class="add-items-modal modal"
            :class="{ 'is-active': isActive }"
            v-if="!isSuccess"
        >
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-card">
                <div class="modal-card-head">
                    <p class="modal-card-title is-uppercase">
                        Add Organizations
                    </p>
                    <i class="material-icons close" @click="closeModal()">
                        close
                    </i>
                </div>
                <div class="modal-card-body">
                    <table class="table is-fullwidth">
                        <tbody>
                            <tr>
                                <td class="search-input" colspan="3">
                                    <p class="control has-icons-left">
                                        <input
                                            class="input is-marginless search"
                                            type="text"
                                            placeholder="Search..."
                                            v-model="searchText"
                                        />
                                        <span class="icon">
                                            <i class="material-icons">search</i>
                                        </span>
                                    </p>
                                </td>
                            </tr>
                            <tr
                                class="row item"
                                :class="{
                                    'is-selected': isOrganizationSelected(
                                        organization.id
                                    ),
                                }"
                                v-for="organization in filteredOrganizations"
                                :key="organization.id"
                            >
                                <template
                                    v-if="
                                        isOrganizationSelected(organization.id)
                                    "
                                >
                                    <td class="item-name">
                                        <span class="name has-text-grey-light">
                                            {{ organization.name }}
                                        </span>
                                    </td>
                                    <td class="role-select">
                                        <div class="select role">
                                            <select
                                                @change="
                                                    updateRole(
                                                        organization.id,
                                                        $event
                                                    )
                                                "
                                            >
                                                <option
                                                    value="admin"
                                                    :selected="
                                                        organization.role ===
                                                            'admin'
                                                    "
                                                >
                                                    Admin
                                                </option>
                                                <option
                                                    value="rw"
                                                    :selected="
                                                        organization.role ===
                                                            'rw'
                                                    "
                                                >
                                                    Read &#47; Write
                                                </option>
                                                <option
                                                    value="ro"
                                                    :selected="
                                                        organization.role ===
                                                            'ro'
                                                    "
                                                >
                                                    Read Only
                                                </option>
                                            </select>
                                        </div>
                                    </td>
                                    <td class="action">
                                        <i
                                            class="material-icons has-text-success add-item"
                                            v-if="
                                                showRemoveIcon !==
                                                    organization.id
                                            "
                                            @mouseover="
                                                showRemoveIcon = organization.id
                                            "
                                        >
                                            check
                                        </i>
                                        <i
                                            class="material-icons has-text-danger remove-item"
                                            v-if="
                                                showRemoveIcon ===
                                                    organization.id
                                            "
                                            @click="
                                                removeOrganization(
                                                    organization.id
                                                )
                                            "
                                            @mouseleave="showRemoveIcon = ''"
                                        >
                                            close
                                        </i>
                                    </td>
                                </template>
                                <template v-else>
                                    <td class="item-name">
                                        <span>
                                            {{ organization.name }}
                                        </span>
                                    </td>
                                    <td class="action">
                                        <i
                                            class="material-icons has-text-success add-item"
                                            @click="
                                                addOrganization(organization)
                                            "
                                        >
                                            add
                                        </i>
                                    </td>
                                </template>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <footer class="modal-card-foot">
                    <div class="buttons is-marginless">
                        <a
                            class="button is-outlined is-danger"
                            @click="closeModal()"
                            :disabled="isLoading"
                        >
                            Cancel
                        </a>
                        <a
                            class="button is-capitalized is-success"
                            :class="{ 'is-loading': isLoading }"
                            @click="addOrganizations()"
                        >
                            Add Organizations
                        </a>
                    </div>
                </footer>
            </div>
        </div>
        <div
            class="add-items-success-modal modal"
            :class="{ 'is-active': isActive }"
            v-else
        >
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-card">
                <header class="modal-card-head is-success">
                    <p class="modal-card-title">Success!</p>
                    <i class="material-icons close" @click="closeModal()">
                        close
                    </i>
                </header>
                <section class="modal-card-body">
                    <p>
                        {{ selectedOrganizations.length }} organizations have
                        been successfully added.
                    </p>
                    <br />
                    <a class="button is-success" @click="closeModal()">
                        Close
                    </a>
                </section>
            </div>
        </div>
    </transition>
</template>

<script>
import search from 'fuzzysearch';
import { EventBus } from '@src/eventBus.js';
import { getOrganizations } from '@api/organizations.js';
import { mapActions, mapState } from 'vuex';
import { addOrganizationToBuild, getBuildOrganizations } from '@api/builds.js';

export default {
    data() {
        return {
            isActive: true,
            isLoading: false,
            isSuccess: false,
            searchText: '',
            selectedOrganizations: [],
            showRemoveIcon: '',
        };
    },
    methods: {
        ...mapActions(['setCurrentBuildOrganizations', 'setOrganizations']),
        async addOrganizations() {
            this.isLoading = true;

            await this.selectedOrganizations.forEach(organization => {
                addOrganizationToBuild(
                    this.currentBuild.id,
                    organization.id,
                    organization.role
                );
            });

            this.isSuccess = true;
            this.isLoading = false;
            EventBus.$emit('organizations-added-to-build');
        },
        addOrganization(organization) {
            const role = { role: 'ro' };
            this.selectedOrganizations.push(Object.assign(organization, role));
        },
        closeModal() {
            this.isActive = false;
            this.isSuccess = false;
            EventBus.$emit('close-modal:add-item');
        },
        isOrganizationSelected(organizationId) {
            return (
                this.selectedOrganizations
                    .map(organization => organization.id)
                    .indexOf(organizationId) !== -1
            );
        },
        removeMember(organizationId) {
            const index = this.selectedOrganizations
                .map(organization => organization.id)
                .indexOf(organizationId);

            this.selectedOrganizations.splice(index, 1);
        },
        updateRole(organizationId, event) {
            if (event && event.target && event.target.value) {
                const selectedOrganizations = this.selectedOrganizations;

                for (let i = 0; i < selectedOrganizations.length; i++) {
                    const modifiedOrganization = selectedOrganizations[i];

                    if (modifiedOrganization.name === organizationId) {
                        this.selectedOrganizations[i].role = event.target.value;

                        break;
                    }
                }
            }
        },
    },
    computed: {
        ...mapState([
            'currentBuild',
            'currentBuildOrganizations',
            'organizations',
        ]),
        filteredOrganizations() {
            return this.organizations.reduce((acc, organization) => {
                const index = this.currentBuildOrganizations
                    .map(buildOrganization => buildOrganization.id)
                    .indexOf(organization.id);

                if (index === -1) {
                    if (this.searchText) {
                        const searchText = this.searchText.toLowerCase();
                        const name = organization.name.toLowerCase();

                        if (search(searchText, name)) {
                            acc.push(organization);
                        }
                    } else {
                        acc.push(organization);
                    }
                }

                return acc;
            }, []);
        },
    },
    created() {
        if (!this.organizations) {
            getOrganizations().then(response => {
                this.setOrganizations(response.data);
            });
        }

        if (!this.currentBuildOrganizations) {
            getBuildOrganizations(this.currentBuild.id).then(response => {
                this.setCurrentBuildOrganizations(response.data);
            });
        }
    },
};
</script>
