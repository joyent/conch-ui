<template>
    <div class="organization">
        <div class="columns">
            <div class="column is-6">
                <h1 class="title is-2 organization-name">
                    {{ organization.name }}
                </h1>
                <p class="is-size-6 organization-description">
                    {{ organization.description }}
                </p>
            </div>
            <div class="column">
                <div class="box stats">
                    <h2 class="is-6">Members</h2>
                    <span class="is-size-3 has-text-info">
                        {{ organizationUsers.length }}
                    </span>
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
            <div class="column is-4">
                <div class="datatable-simple">
                    <div class="datatable-header">
                        <p
                            class="datatable-header-title is-size-5 has-text-white"
                        >
                            Workspace Memberships
                        </p>
                        <div
                            class="dropdown dropdown-workspace is-right"
                            :class="{ 'is-active': showWorkspacesDropdown }"
                        >
                            <a
                                class="datatable-header-icon dropdown-trigger"
                                @click="
                                    showWorkspacesDropdown = !showWorkspacesDropdown
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
                                            openActionModal('add', 'workspace')
                                        "
                                    >
                                        <i class="material-icons">add</i>
                                        <p>Add Workspaces</p>
                                    </a>
                                    <a
                                        class="dropdown-item remove"
                                        @click="
                                            openActionModal(
                                                'remove',
                                                'workspace'
                                            )
                                        "
                                    >
                                        <i class="fas fa-trash-alt"></i>
                                        <p>Remove Workspaces</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table
                        class="table is-fullwidth is-hoverable is-marginless"
                    >
                        <tbody>
                            <tr class="row-simple" v-for="i in 6" :key="i">
                                <td class="table-data">
                                    {{ org.workspaces[i] }}
                                </td>
                                <td class="row-action-button">
                                    <a
                                        class="button-delete"
                                        @click="
                                            removeItem(
                                                org.workspaces[i],
                                                'workspace'
                                            )
                                        "
                                    >
                                        <span class="icon">
                                            <i class="fas fa-trash-alt"></i>
                                        </span>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="datatable-footer add">
                        <a
                            class="datatable-footer-item"
                            @click="openActionModal('add', 'workspace')"
                        >
                            <i class="material-icons">add</i>
                            <span class="heading is-size-6 is-marginless">
                                Add a Workspace
                            </span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="column is-8">
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
                                        @click="openActionModal('add', 'build')"
                                    >
                                        <i class="material-icons">add</i>
                                        <p>Add Build</p>
                                    </a>
                                    <a
                                        class="dropdown-item remove"
                                        @click="
                                            openActionModal('remove', 'build')
                                        "
                                    >
                                        <i class="fas fa-trash-alt"></i>
                                        <p>Remove Build</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table
                        class="table is-fullwidth is-hoverable is-marginless"
                    >
                        <thead>
                            <th>Name</th>
                            <th>Progress</th>
                            <th></th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th></th>
                        </thead>
                        <tbody>
                            <tr
                                class="row"
                                v-for="build in org.builds"
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
                                <td>{{ getDate(build.startDate) }}</td>
                                <td>{{ getDate(build.endDate) }}</td>
                                <td class="row-action-button">
                                    <a
                                        class="button-delete"
                                        @click="removeItem(build, 'build')"
                                    >
                                        <span class="icon">
                                            <i class="fas fa-trash-alt"></i>
                                        </span>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="datatable-footer add">
                        <a
                            class="datatable-footer-item"
                            @click="openActionModal('add', 'build')"
                        >
                            <i class="material-icons">add</i>
                            <span class="heading is-size-6 is-marginless">
                                Add a Build
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
                                        @click="
                                            openActionModal('add', 'member')
                                        "
                                    >
                                        <i class="material-icons">add</i>
                                        <p>Add Members</p>
                                    </a>
                                    <a
                                        class="dropdown-item remove"
                                        @click="
                                            openActionModal('remove', 'member')
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
                                <td>
                                    <div class="select">
                                        <select v-model="member.role">
                                            <option value="admin">Admin</option>
                                            <option value="regular user">
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
                                        <select v-model="member.permissions">
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
                                <td class="row-action-button">
                                    <a
                                        class="button-delete"
                                        @click="
                                            removeItem(member, 'member')
                                        "
                                    >
                                        <span class="icon">
                                            <i class="fas fa-trash-alt"></i>
                                        </span>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="datatable-footer add">
                        <a
                            class="datatable-footer-item"
                            @click="openActionModal('add', 'member')"
                        >
                            <i class="material-icons">add</i>
                            <span class="heading is-size-6 is-marginless">
                                Add a Member
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
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import { getUsers } from '@api/users.js';
import { getOrganizations, getOrganizationUsers } from '@api/organizations.js';

export default {
    components: {
        ActionModal,
        RemoveItemModal,
    },
    data() {
        return {
            action: '',
            availableData: [],
            isActive: false,
            item: '',
            removingItem: {},
            removingType: '',
            organization: {},
            organizationUsers: [],
            builds: [
                'us-west-1',
                'us-east-1',
                'us-southeast-1',
                'us-southwest-1',
                'us-northwest-1',
                'ceres-12345',
                'The Lord of the Rings',
                'Star Wars',
                'one-last-build-kthx-bye',
            ],
            // users: [
            //     'Aragorn',
            //     'Frodo Baggins',
            //     'Emperor of The Galactic Empire',
            //     'Samwise Gamgee',
            //     'Peregrin Took',
            //     'Merriweather',
            //     'Boromir',
            //     'Minas Tirith',
            //     'Gondor',
            //     'Isengard',
            //     'Mordor',
            //     'Sauron',
            //     'Yoda',
            //     'Chewbacca',
            //     'Droids-C-3PO-R2-D2',
            //     'Han Solo',
            //     'Darth Vader',
            //     'Luke Skywalker',
            // ],
            workspaces: [
                'Tatooine',
                'Jedi Grand Master Luke Skywalker of the Jedi',
                'Yavin IV',
                'Coruscant',
                'Dagobah',
                'Hoth',
                'Korriban',
                'Alderran',
                'Mustaffar',
                'Endor',
                'Death Star',
                'Yoda',
                'Chewbacca',
                'Droids-C-3PO-R2-D2',
                'Aragorn',
                'Frodo Baggins',
                'Samwise Gamgee',
                'Peregrin Took',
                'Merriweather',
                'Boromir',
                'Minas Tirith',
                'Gondor',
                'Isengard',
                'Mordor',
                'Sauron',
            ],
            org: {
                builds: [
                    {
                        name: 'us-west-1',
                        status: 'complete',
                        progress: 100,
                        startDate: '2018-05-16T10:35:16.933374-07:00',
                        endDate: '2019-05-16T10:35:16.933374-07:00',
                    },
                    {
                        name: 'us-southwest-1',
                        status: 'active',
                        progress: 70,
                        startDate: '2018-08-16T10:35:16.933374-07:00',
                        endDate: '2019-05-16T10:35:16.933374-07:00',
                    },
                    {
                        name: 'us-east-1',
                        status: 'active',
                        progress: 50,
                        startDate: '2018-12-16T10:35:16.933374-07:00',
                        endDate: '2019-05-16T10:35:16.933374-07:00',
                    },
                    {
                        name: 'us-southeast-1',
                        status: 'active',
                        progress: 25,
                        startDate: '2018-05-16T10:35:16.933374-07:00',
                        endDate: '2019-05-16T10:35:16.933374-07:00',
                    },
                    {
                        name: 'us-northwest-1',
                        status: 'active',
                        progress: 10,
                        startDate: '2018-01-16T10:35:16.933374-07:00',
                        endDate: '2019-05-16T10:35:16.933374-07:00',
                    },
                ],
                name: 'Star Wars Build Team',
                description:
                    'Build team in charge of doing important things for the Empire and the Rebellion. May the force be with you.',
                members: [
                    {
                        name: 'Anakin Skywalker',
                        role: 'admin',
                        permissions: 'admin',
                    },
                    {
                        name: 'Darth Vader',
                        role: 'regular user',
                        permissions: 'rw',
                    },
                    {
                        name: 'The Senate',
                        role: 'admin',
                        permissions: 'admin',
                    },
                    {
                        name: 'Jar Jar Binks',
                        role: 'regular user',
                        permissions: 'ro',
                    },
                    {
                        name: 'C3P0',
                        role: 'regular user',
                        permissions: 'ro',
                    },
                    {
                        name: 'R2D2',
                        role: 'regular user',
                        permissions: 'rw',
                    },
                ],
                workspaces: [
                    'Tatooine',
                    'Yavin IV',
                    'Coruscant',
                    'Dagobah',
                    'Hoth',
                    'Korriban',
                    'Alderran',
                    'Mustaffar',
                    'Endor',
                    'Death Star',
                    'Yoda',
                    'Chewbacca',
                    'Droids-C-3PO-R2-D2',
                ],
            },
            showRemoveItemModal: false,
            showActionModal: false,
            showWorkspacesDropdown: false,
            showBuildsDropdown: false,
            showMembersDropdown: false,
            showUserActionsDropdown: false,
            unavailableData: [],
            modifiedMembers: [],
        };
    },
    methods: {
        ...mapActions(['setOrganizations', 'setUsers']),
        closeModal() {
            this.showActionModal = false;
            this.showRemoveItemModal = false;
        },
        getDate(date) {
            return moment(date).format('MM/DD/YYYY');
        },

        // MEMBERS TABLE FUNCTIONS
        modifyMember(memberName) {
            this.modifiedMembers.push(memberName);
        },
        removeMemberModification(item) {
            const index = this.modifiedMembers.indexOf(item);

            this.modifiedMembers.splice(index, 1);
        },
        isMemberModified(memberName) {
            return this.modifiedMembers.indexOf(memberName) === -1
                ? true
                : false;
        },

        openActionModal(action, item) {
            this.action = action;
            this.item = item;

            if (item === 'workspace') {
                this.showWorkspacesDropdown = false;
                this.availableData = this.workspaces;
                this.unavailableData = this.org.workspaces;
            } else if (item === 'build') {
                this.showBuildsDropdown = false;
                this.availableData = this.builds;
                this.unavailableData = this.org.builds.map(build => build.name);
            } else if (item === 'member') {
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

            getOrganizationUsers(currentOrganizationId).then(response => {
                this.organizationUsers = response.data;
            });
        },
    },
    computed: {
        ...mapState(['organizations', 'users']),
        buildsActive() {
            return this.org.builds.filter(build => build.status === 'active')
                .length;
        },
        buildsComplete() {
            return this.org.builds.filter(build => build.status === 'complete')
                .length;
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
