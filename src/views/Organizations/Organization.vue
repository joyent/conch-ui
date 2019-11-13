<template>
    <div class="organization">
        <div class="columns">
            <div class="column is-6" v-if="!isEmpty(organization)">
                <h1 class="title is-2 organization-name">
                    {{ organization.name }}
                </h1>
                <p class="is-size-6 organization-description">
                    {{ organization.description }}
                </p>
            </div>
            <div
                class="column is-6"
                style="display: flex; align-items: center; justify-content: center;"
                v-else
            >
                <Spinner />
            </div>
            <div class="column">
                <div class="box stats">
                    <h2 class="is-6">Members</h2>
                    <span
                        class="is-size-3 has-text-info"
                        v-if="organizationHasMembers"
                    >
                        {{ organization.users.length }}
                    </span>
                    <span class="is-size-3 has-text-info" v-else>0</span>
                </div>
            </div>
            <div class="column">
                <div class="box stats">
                    <h2 class="is-6">Active Builds</h2>
                    <span class="is-size-3 has-text-warning">
                        {{ buildsActive }}
                    </span>
                </div>
            </div>
            <div class="column">
                <div class="box stats">
                    <h2 class="is-6">Completed Builds</h2>
                    <span class="is-size-3 has-text-success">
                        {{ buildsComplete }}
                    </span>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <div class="datatable-simple">
                    <div class="datatable-header">
                        <p
                            class="datatable-header-title is-size-5 has-text-white"
                        >
                            Builds
                        </p>
                        <div
                            class="dropdown dropdown-builds is-right"
                            :class="{ 'is-active': showBuildsDropdown }"
                        >
                            <a
                                class="datatable-header-icon dropdown-trigger"
                                @click="
                                    showBuildsDropdown = !showBuildsDropdown
                                "
                            >
                                <span class="icon">
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                            </a>
                            <div class="dropdown-menu">
                                <div class="dropdown-content">
                                    <a
                                        class="dropdown-item add"
                                        @click="
                                            openActionModal('add', 'builds')
                                        "
                                    >
                                        <i class="material-icons">add</i>
                                        <p>Add Builds</p>
                                    </a>
                                    <a
                                        class="dropdown-item remove"
                                        @click="
                                            openActionModal('remove', 'builds')
                                        "
                                        v-if="organizationHasBuilds"
                                    >
                                        <i class="fas fa-trash-alt"></i>
                                        <p>Remove Builds</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table
                        class="table is-fullwidth is-hoverable is-marginless"
                        v-if="!noBuildsExist"
                    >
                        <thead>
                            <th>Name</th>
                            <th>Progress</th>
                            <th></th>
                            <th class="has-text-centered">Start Date</th>
                            <th class="has-text-centered">End Date</th>
                            <th></th>
                        </thead>
                        <tbody>
                            <tr
                                class="row"
                                v-for="build in organization.builds"
                                :key="build.id"
                            >
                                <td>{{ build.name }}</td>
                                <td colspan="2">
                                    <div
                                        style="display: flex; align-items: center"
                                    >
                                        <progress
                                            class="progress"
                                            :class="[
                                                {
                                                    'is-success':
                                                        build.status ===
                                                        'complete',
                                                },
                                                {
                                                    'is-info':
                                                        build.status ===
                                                        'active',
                                                },
                                                {
                                                    'is-warning':
                                                        build.status ===
                                                        'on-hold',
                                                },
                                            ]"
                                            :value="build.progress"
                                            max="100"
                                            style="margin: 0 8px 0 0; height: 0.5rem"
                                        >
                                        </progress>
                                        <span>{{ build.progress }}%</span>
                                    </div>
                                </td>
                                <td class="has-text-centered">
                                    {{ getDate(build.startDate) }}
                                </td>
                                <td class="has-text-centered">
                                    {{ getDate(build.endDate) }}
                                </td>
                                <td class="row-action-button">
                                    <a
                                        class="button-delete"
                                        @click="removeItem(build, 'builds')"
                                    >
                                        <span class="icon">
                                            <i class="fas fa-trash-alt"></i>
                                        </span>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table is-fullwidth is-marginless" v-else>
                        <tbody>
                            <tr class="row">
                                <td colspan="6" class="has-text-centered">
                                    <span
                                        class="has-text-white has-text-weight-bold"
                                    >
                                        {{ organization.name }}
                                    </span>
                                    <span>
                                        has no builds.
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="datatable-footer add">
                        <a
                            class="datatable-footer-item"
                            @click="openActionModal('add', 'builds')"
                        >
                            <i class="material-icons">add</i>
                            <span class="heading is-size-6 is-marginless">
                                Add Builds
                            </span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="datatable-simple">
                    <div class="datatable-header">
                        <p
                            class="datatable-header-title is-size-5 has-text-white"
                        >
                            Members
                        </p>
                        <div
                            class="dropdown dropdown-members is-right"
                            :class="{ 'is-active': showMembersDropdown }"
                        >
                            <a
                                class="datatable-header-icon dropdown-trigger"
                                @click="
                                    showMembersDropdown = !showMembersDropdown
                                "
                            >
                                <span class="icon">
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                            </a>
                            <div class="dropdown-menu">
                                <div class="dropdown-content">
                                    <a
                                        class="dropdown-item add"
                                        v-if="!editMembers"
                                        @click="
                                            openActionModal('add', 'members')
                                        "
                                    >
                                        <i class="material-icons">add</i>
                                        <p>Add Members</p>
                                    </a>
                                    <a
                                        class="dropdown-item edit"
                                        @click="toggleEditMembers()"
                                        v-if="organizationHasMembers"
                                    >
                                        <i class="material-icons">edit</i>
                                        <p v-if="!editMembers">Edit Members</p>
                                        <p v-else>Cancel Editing</p>
                                    </a>
                                    <a
                                        class="dropdown-item remove"
                                        v-if="
                                            !editMembers &&
                                                organizationHasMembers
                                        "
                                        @click="
                                            openActionModal('remove', 'members')
                                        "
                                    >
                                        <i class="fas fa-trash-alt"></i>
                                        <p>Remove Members</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table
                        class="table is-fullwidth is-hoverable is-marginless"
                        v-if="organizationHasMembers"
                    >
                        <thead>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Permissions</th>
                            <th></th>
                        </thead>
                        <tbody>
                            <tr
                                class="row"
                                :class="{
                                    'is-modified': isMemberModified(
                                        member.name
                                    ),
                                }"
                                v-for="member in organization.users"
                                :key="member.name"
                            >
                                <td>
                                    {{ member.name }}
                                </td>
                                <template v-if="editMembers">
                                    <td>
                                        <div class="select">
                                            <select
                                                @change="
                                                    updateRole(member, $event)
                                                "
                                            >
                                                <option
                                                    :selected="
                                                        member.role === 'admin'
                                                    "
                                                    value="admin"
                                                >
                                                    Admin
                                                </option>
                                                <option
                                                    :selected="
                                                        member.role === 'ro' ||
                                                            member.role === 'rw'
                                                    "
                                                    value="regular_user"
                                                >
                                                    Regular User
                                                </option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <div
                                            class="select"
                                            v-if="member.role !== 'admin'"
                                        >
                                            <select
                                                v-model="member.role"
                                                @change="
                                                    updateRegularUserPermissions(
                                                        member,
                                                        $event
                                                    )
                                                "
                                            >
                                                <option value="ro">
                                                    Read Only
                                                </option>
                                                <option value="rw">
                                                    Read / Write
                                                </option>
                                            </select>
                                        </div>
                                        <span v-else>
                                            Admin
                                        </span>
                                    </td>
                                </template>
                                <template v-else>
                                    <td>
                                        <p v-if="member.role === 'admin'">
                                            Admin
                                        </p>
                                        <p v-else>Regular User</p>
                                    </td>
                                    <td>
                                        <p v-if="member.role === 'admin'">
                                            Admin
                                        </p>
                                        <p v-else-if="member.role === 'rw'">
                                            Read / Write
                                        </p>
                                        <p v-else>
                                            Read Only
                                        </p>
                                    </td>
                                </template>
                                <td class="row-action-button">
                                    <a
                                        class="button-delete"
                                        @click="removeItem(member, 'members')"
                                        v-if="
                                            member.role !== 'admin' ||
                                                adminMembersCount > 1
                                        "
                                    >
                                        <i class="material-icons">delete</i>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table is-fullwidth is-marginless" v-else>
                        <tbody>
                            <tr class="row">
                                <td colspan="6" class="has-text-centered">
                                    <span
                                        class="has-text-white has-text-weight-bold"
                                    >
                                        {{ organization.name }}
                                    </span>
                                    <span>
                                        has no members.
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="datatable-footer" v-if="!editMembers">
                        <a
                            class="datatable-footer-item add"
                            @click="openActionModal('add', 'members')"
                        >
                            <i class="material-icons">add</i>
                            <span class="heading is-size-6 is-marginless">
                                Add Members
                            </span>
                        </a>
                    </div>
                    <div
                        class="datatable-footer "
                        v-else-if="editMembers && organizationHasMembers"
                    >
                        <a
                            class="datatable-footer-item save"
                            @click="saveChanges()"
                            :disabled="
                                modifiedMembers && modifiedMembers.length === 0
                            "
                        >
                            <i class="material-icons">save</i>
                            <span class="heading is-size-6 is-marginless">
                                Save Changes
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade">
            <ActionModal
                v-if="showActionModal"
                :action="action"
                :available-data="availableData"
                :item-type="item"
                :organization-id="organization.id"
                :unavailable-data="unavailableData"
            />
        </transition>
        <transition name="fade">
            <div class="remove-item-modal" v-if="showRemoveItemModal">
                <div class="modal is-active">
                    <div class="modal-background" @click="closeModal()"></div>
                    <div class="modal-card">
                        <header class="modal-card-head">
                            <p class="modal-card-title">
                                Confirm Removal
                            </p>
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
                                    class="has-text-weight-bold has-text-white"
                                >
                                    {{ removingItem.name }}
                                </span>
                                from the organization?
                            </p>
                            <br />
                            <div class="buttons-group">
                                <a
                                    class="button"
                                    @click="closeModal()"
                                    :disabled="isLoading ? 'disabled' : false"
                                >
                                    Cancel
                                </a>
                                <a
                                    class="button is-danger"
                                    :class="{ 'is-loading': isLoading }"
                                    @click="removeMemberFromOrganization()"
                                    :disabled="isLoading ? 'disabled' : false"
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
                v-if="showSuccessModal"
                :item="removingItem.name"
                :action="action"
                :item-type="itemType"
                :item-count="itemCount"
            />
        </transition>
    </div>
</template>

<script>
import moment from 'moment';
import ActionModal from './ActionModal.vue';
import Spinner from '@src/views/components/Spinner.vue';
import SuccessModal from '@src/views/components/SuccessModal.vue';
import isEmpty from 'lodash/isEmpty';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import { getBuilds } from '@api/builds.js';
import { getUsers } from '@api/users.js';
import * as Organizations from '@api/organizations.js';

export default {
    components: {
        ActionModal,
        Spinner,
        SuccessModal,
    },
    data() {
        return {
            action: '',
            availableData: [],
            editMembers: false,
            isActive: false,
            isLoading: false,
            item: '',
            itemCount: 0,
            itemType: '',
            removingItem: {},
            removingType: '',
            organization: {},
            modifiedMembers: [],
            noBuildsExist: false,
            noMembersExist: false,
            showRemoveItemModal: false,
            showActionModal: false,
            showBuildsDropdown: false,
            showMembersDropdown: false,
            showSuccessModal: false,
            showUserActionsDropdown: false,
            unavailableData: [],
        };
    },
    methods: {
        ...mapActions(['setBuilds', 'setOrganizations', 'setUsers']),
        closeModal() {
            this.showActionModal = false;
            this.showRemoveItemModal = false;
            this.showSuccessModal = false;
            this.action = '';
            this.itemCount = 0;
            this.itemType = '';
        },
        getDate(date) {
            return moment(date).format('YYYY/MM/DD');
        },
        getModifiedMemberIndex(memberName) {
            if (this.modifiedMembers) {
                for (let i = 0; i < this.modifiedMembers.length; i++) {
                    if (this.modifiedMembers[i].name === memberName) {
                        return i;
                    }
                }
            }

            return -1;
        },
        getOrganization() {
            Organizations.getOrganization(this.organization.id).then(
                response => {
                    this.organization = response.data;
                }
            );
        },
        isEmpty,
        isMemberModified(memberName) {
            return this.modifiedMembers
                .map(member => member.name)
                .some(name => name === memberName);
        },
        openActionModal(action, item) {
            this.action = action;
            this.item = item;

            if (item === 'builds') {
                this.showBuildsDropdown = false;
                this.availableData = this.builds;
                this.unavailableData = this.organization.builds.map(
                    build => build.name
                );
            } else if (item === 'members') {
                this.showMembersDropdown = false;
                this.availableData = this.users;
                this.unavailableData = this.organization.users;
            }

            this.showActionModal = true;
        },
        removeItem(item, type) {
            this.action = 'remove';
            this.removingItem = item;
            this.removingType = type;

            this.showRemoveItemModal = true;
        },
        removeMemberFromOrganization() {
            this.isLoading = true;

            Organizations.removeUserFromOrganization(
                this.organization.id,
                this.removingItem.id
            ).then(() => {
                this.showRemoveItemModal = false;
                this.showSuccessModal = true;
                this.isLoading = false;
                this.getOrganization();
            });
        },
        removeMemberModification(item) {
            const index = this.modifiedMembers.indexOf(item);

            this.modifiedMembers.splice(index, 1);
        },
        async setOrganizationData(currentOrganizationId, organizations = null) {
            if (organizations) {
                await this.setOrganizations(organizations);
            }

            this.organization = this.organizations.find(
                organization => organization.id === currentOrganizationId
            );

            if (
                !this.organization.builds ||
                this.organization.builds.length === 0
            ) {
                this.noBuildsExist = true;
            }

            if (
                !this.organization.users ||
                this.organization.users.length === 0
            ) {
                this.noMembersExist = true;
            }
        },
        toggleEditMembers() {
            this.editMembers = !this.editMembers;
            this.showMembersDropdown = false;
        },
        updateRegularUserPermissions(member, event) {
            const index = this.getModifiedMemberIndex(memberName);
            const memberName = member.name;
            const newPermissions =
                event && event.target && event.target.value
                    ? event.target.value
                    : 'ro';

            if (index !== -1) {
                this.modifiedMembers[index].role = newPermissions;
            } else {
                this.modifiedMembers.push({
                    name: member.name,
                    id: member.id,
                    role: newPermissions,
                    original_role: member.role,
                });
            }
        },
        updateRole(member, event) {
            const memberName = member.name;
            const index = this.getModifiedMemberIndex(memberName);
            const newRole =
                event && event.target && event.target.value
                    ? event.target.value
                    : 'regular_user';

            if (index !== -1) {
                if (newRole === member.original_role) {
                    this.modifiedMembers.splice(index, 1);
                } else if (newRole === 'admin') {
                    this.modifiedMembers[index].role = 'admin';
                } else {
                    this.modifiedMembers[index].role = 'ro';
                }
            } else {
                this.modifiedMembers.push({
                    name: member.name,
                    id: member.id,
                    role: newRole,
                    original_role: member.role,
                });
            }
        },
    },
    computed: {
        ...mapState(['builds', 'organizations', 'users']),
        adminMembersCount() {
            if (this.organizationHasMembers) {
                return this.organization.users.filter(user => {
                    return user.role === 'admin';
                }).length;
            }

            return 0;
        },
        buildsActive() {
            if (this.organizationHasBuilds) {
                return this.organization.builds.filter(
                    build => build.status === 'active'
                ).length;
            }

            return 0;
        },
        buildsComplete() {
            if (this.organizationHasBuilds) {
                return this.organization.builds.filter(
                    build => build.status === 'complete'
                ).length;
            }

            return 0;
        },
        organizationHasBuilds() {
            return (
                this.organization &&
                this.organization.builds &&
                this.organization.builds.length
            );
        },
        organizationHasMembers() {
            return (
                this.organization &&
                this.organization.users &&
                this.organization.users.length
            );
        },
    },
    created() {
        const currentOrganizationId = this.$route.params.organizationId;

        if (this.organizations.length) {
            this.setOrganizationData(currentOrganizationId);
        } else {
            Organizations.getOrganizations().then(response => {
                const organizations = response.data;
                this.setOrganizationData(currentOrganizationId, organizations);
            });
        }

        if (!this.builds.length) {
            getBuilds().then(response => {
                this.setBuilds(response.data);
            });
        }

        if (!this.users.length) {
            getUsers().then(response => {
                this.setUsers(response.data);
            });
        }
    },
    mounted() {
        EventBus.$on(
            ['close-modal:action-modal', 'close-modal:success-modal'],
            () => {
                this.closeModal();
            }
        );

        EventBus.$on(['build-added', 'members-added'], async data => {
            await this.getOrganization();

            this.action = 'add';
            this.itemCount = data.count;
            this.itemType = data.type;
            this.showSuccessModal = true;
        });
    },
};
</script>
