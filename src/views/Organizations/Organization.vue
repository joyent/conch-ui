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
                <div class="box stats" v-if="organizationHasUsers">
                    <h2 class="is-6">Members</h2>
                    <span class="is-size-3 has-text-info">
                        {{ organizationUsers.length }}
                    </span>
                </div>
                <div class="box stats" v-else>
                    <Spinner />
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
                        v-if="noBuildsExist"
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
                                v-for="build in organizationBuilds"
                                :key="build.name"
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
        </div>
        <div class="columns">
            <div class="column">
                <div class="datatable-simple">
                    <div class="datatable-header">
                        <p
                            class="datatable-header-title is-size-5 has-text-white"
                        >
                            Organization Members
                        </p>
                        <div
                            class="dropdown dropdown-members is-right"
                            :class="{ 'is-active': showMembersDropdown }"
                            v-if="organizationHasUsers"
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
                                    >
                                        <i class="material-icons">edit</i>
                                        <p v-if="!editMembers">Edit Members</p>
                                        <p v-else>Cancel Editing</p>
                                    </a>
                                    <a
                                        class="dropdown-item remove"
                                        v-if="!editMembers"
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
                        v-if="organizationHasUsers"
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
                                v-for="member in organizationUsers"
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
                                    >
                                        <span class="icon">
                                            <i class="fas fa-trash-alt"></i>
                                        </span>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table
                        class="table is-fullwidth is-hoverable is-marginless"
                        v-else
                    >
                        <tbody>
                            <tr class="row">
                                <td>
                                    <Spinner />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div
                        class="datatable-footer"
                        v-if="!editMembers && organizationHasUsers"
                    >
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
                        v-else-if="editMembers && organizationHasUsers"
                    >
                        <a
                            class="datatable-footer-item save"
                            @click="saveChanges()"
                            :disabled="modifiedMembers.length === 0"
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
            <RemoveItemModal
                v-if="showRemoveItemModal"
                :item="removingItem"
                :type="removingType"
                :organization-id="organization.id"
            />
        </transition>
    </div>
</template>

<script>
import moment from 'moment';
import RemoveItemModal from './RemoveItemModal.vue';
import ActionModal from './ActionModal.vue';
import Spinner from '@src/views/components/Spinner.vue';
import isEmpty from 'lodash/isEmpty';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import { getBuilds } from '@api/builds.js';
import { getUsers } from '@api/users.js';
import { getOrganizations, getOrganizationUsers } from '@api/organizations.js';

export default {
    components: {
        ActionModal,
        RemoveItemModal,
        Spinner,
    },
    data() {
        return {
            action: '',
            availableData: [],
            editMembers: false,
            isActive: false,
            item: '',
            removingItem: {},
            removingType: '',
            organization: {},
            organizationBuilds: [
                // {
                //     name: 'us-west-1',
                //     status: 'complete',
                //     progress: 100,
                //     startDate: '2018-05-16T10:35:16.933374-07:00',
                //     endDate: '2019-05-16T10:35:16.933374-07:00',
                // },
                // {
                //     name: 'us-southwest-1',
                //     status: 'active',
                //     progress: 70,
                //     startDate: '2018-08-16T10:35:16.933374-07:00',
                //     endDate: '2019-05-16T10:35:16.933374-07:00',
                // },
                // {
                //     name: 'us-east-1',
                //     status: 'active',
                //     progress: 50,
                //     startDate: '2018-12-16T10:35:16.933374-07:00',
                //     endDate: '2019-05-16T10:35:16.933374-07:00',
                // },
                // {
                //     name: 'us-southeast-1',
                //     status: 'active',
                //     progress: 25,
                //     startDate: '2018-05-16T10:35:16.933374-07:00',
                //     endDate: '2019-05-16T10:35:16.933374-07:00',
                // },
                // {
                //     name: 'us-northwest-1',
                //     status: 'active',
                //     progress: 10,
                //     startDate: '2018-01-16T10:35:16.933374-07:00',
                //     endDate: '2019-05-16T10:35:16.933374-07:00',
                // },
            ],
            organizationUsers: [],
            modifiedMembers: [],
            noBuildsExist: false,
            noMembersExist: false,
            showRemoveItemModal: false,
            showActionModal: false,
            showBuildsDropdown: false,
            showMembersDropdown: false,
            showUserActionsDropdown: false,
            unavailableData: [],
        };
    },
    methods: {
        ...mapActions(['setBuilds', 'setOrganizations', 'setUsers']),
        closeModal() {
            this.showActionModal = false;
            this.showRemoveItemModal = false;
        },
        getDate(date) {
            return moment(date).format('MM/DD/YYYY');
        },

        // MEMBERS TABLE FUNCTIONS
        removeMemberModification(item) {
            const index = this.modifiedMembers.indexOf(item);

            this.modifiedMembers.splice(index, 1);
        },
        isMemberModified(memberName) {
            return this.modifiedMembers
                .map(member => member.name)
                .some(name => name === memberName);
        },
        getModifiedMemberIndex(memberName) {
            for (let i = 0; i < this.modifiedMembers.length; i++) {
                if (this.modifiedMembers[i].name === memberName) {
                    return i;
                }
            }

            return -1;
        },
        isEmpty,
        openActionModal(action, item) {
            this.action = action;
            this.item = item;

            if (item === 'builds') {
                this.showBuildsDropdown = false;
                this.availableData = this.builds;
                this.unavailableData = this.organizationBuilds.map(
                    build => build.name
                );
            } else if (item === 'members') {
                this.showMembersDropdown = false;
                this.availableData = this.users;
                this.unavailableData = this.organizationUsers;
            }

            this.showActionModal = true;
        },
        removeItem(item, type) {
            this.removingItem = item;
            this.removingType = type;

            this.showRemoveItemModal = true;
        },
        async setOrganizationData(currentOrganizationId, organizations = null) {
            if (organizations) {
                await this.setOrganizations(organizations);
            }

            this.organization = this.organizations.find(
                organization => organization.id === currentOrganizationId
            );

            if (this.organization.builds) {
                this.organizationBuilds = this.organization.builds;
            } else {
                // this.noBuildsExist = true;
            }

            getOrganizationUsers(currentOrganizationId).then(response => {
                const users = response.data;
                this.organizationUsers = users;

                if (!users.length) {
                    this.noMembersExist = true;
                }
            });
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
        buildsActive() {
            return this.organizationBuilds.filter(
                build => build.status === 'active'
            ).length;
        },
        buildsComplete() {
            return this.organizationBuilds.filter(
                build => build.status === 'complete'
            ).length;
        },
        organizationHasBuilds() {
            return this.organizationBuilds.length > 0 && !this.noBuildsExist;
        },
        organizationHasUsers() {
            return this.organizations.length > 0 && !this.noMembersExist;
        },
    },
    created() {
        const currentOrganizationId = this.$route.params.organizationId;

        if (this.organizations.length) {
            this.setOrganizationData(currentOrganizationId);
        } else {
            getOrganizations().then(response => {
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
        EventBus.$on('close-modal:action-modal', () => {
            this.closeModal();
        });

        EventBus.$on('closeModal:baseModal', () => {
            this.closeModal();
        });
    },
};
</script>
