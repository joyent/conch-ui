<template>
    <div class="organization">
        <div class="columns">
            <div class="column is-6">
                <h1 class="title is-2 organization-name">{{ org.name }}</h1>
                <p class="is-size-6 organization-description">
                    {{ org.description }}
                </p>
            </div>
            <div class="column">
                <div class="box stats">
                    <h2 class="is-6">Members</h2>
                    <span class="is-size-3 has-text-info">
                        {{ org.members.length }}
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
                        <p class="datatable-header-title is-size-5 has-text-white">
                            Workspace Memberships
                        </p>
                        <div
                            class="dropdown dropdown-workspace is-right"
                            :class="{ 'is-active': showWorkspacesDropdown }"
                        >
                            <a
                                class="datatable-header-icon dropdown-trigger"
                                @click="showWorkspacesDropdown = !showWorkspacesDropdown"
                            >
                                <span class="icon">
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                            </a>
                            <div class="dropdown-menu">
                                <div class="dropdown-content">
                                    <a
                                        class="dropdown-item add"
                                        @click="openWorkspaceModal('add')"
                                        style="display: flex;"
                                    >
                                        <i class="material-icons" style="margin-right: 10px; min-width: 24px;">
                                            add_circle_outline
                                        </i>
                                        <p>Add Workspaces</p>
                                    </a>
                                    <a
                                        class="dropdown-item remove"
                                        @click="openWorkspaceModal('remove')"
                                        style="display: flex; align-items: center"
                                    >
                                        <i class="fas fa-trash-alt" style="margin-right: 10px; min-width: 24px; text-align: center;"></i>
                                        <p>Remove Workspaces</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table class="table is-fullwidth is-hoverable is-marginless">
                        <tbody>
                            <tr class="row-simple" v-for="i in 6" :key="i">
                                <td class="table-data">
                                    {{ org.workspaces[i] }}
                                </td>
                                <td class="row-action-button">
                                    <a class="button-delete">
                                        <span class="icon">
                                            <i class="fas fa-trash-alt"></i>
                                        </span>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="datatable-footer add">
                        <a class="datatable-footer-item">
                            <i class="material-icons">add</i>
                            <span>Add a Workspace</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="column is-8">
                <div class="datatable-simple">
                    <div class="datatable-header">
                        <p class="datatable-header-title is-size-5 has-text-white">
                            Builds
                        </p>
                        <div
                            class="dropdown dropdown-builds is-right"
                            :class="{ 'is-active': showBuildsDropdown }"
                        >
                            <a
                                class="datatable-header-icon dropdown-trigger"
                                @click="showBuildsDropdown = !showBuildsDropdown"
                            >
                                <span class="icon">
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                            </a>
                            <div class="dropdown-menu">
                                <div class="dropdown-content">
                                    <a class="dropdown-item add" style="display: flex;">
                                        <i class="material-icons" style="margin-right: 10px; min-width: 24px;">
                                            add_circle_outline
                                        </i>
                                        <p>Add Build</p>
                                    </a>
                                    <a class="dropdown-item remove" style="display: flex; align-items: center">
                                        <i class="fas fa-trash-alt" style="margin-right: 10px; min-width: 24px; text-align: center;"></i>
                                        <p>Remove Build</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table class="table is-fullwidth is-hoverable is-marginless">
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
                                    <div style="display: flex; align-items: center">
                                        <progress
                                            class="progress"
                                            :class="[
                                                { 'is-success': build.status === 'complete' },
                                                { 'is-info': build.status === 'active' },
                                                { 'is-warning': build.status === 'on-hold' },
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
                                    <a class="button-delete">
                                        <span class="icon">
                                            <i class="fas fa-trash-alt"></i>
                                        </span>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="datatable-footer add">
                        <a class="datatable-footer-item">
                            <i class="material-icons">add</i>
                            <span>Add a Build</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="columns">
            <div class="column">
                <div class="datatable-simple">
                    <div class="datatable-header">
                        <p class="datatable-header-title is-size-5 has-text-white">
                            Organization Members
                        </p>
                        <div
                            class="dropdown dropdown-members is-right"
                            :class="{ 'is-active': showMembersDropdown }"
                        >
                            <a
                                class="datatable-header-icon dropdown-trigger"
                                @click="showMembersDropdown = !showMembersDropdown"
                            >
                                <span class="icon">
                                    <i class="fas fa-ellipsis-v"></i>
                                </span>
                            </a>
                            <div class="dropdown-menu">
                                <div class="dropdown-content">
                                    <a class="dropdown-item add" style="display: flex;">
                                        <i class="material-icons" style="margin-right: 10px; min-width: 24px;">
                                            add_circle_outline
                                        </i>
                                        <p>Add Member</p>
                                    </a>
                                    <a class="dropdown-item remove" style="display: flex; align-items: center">
                                        <i class="fas fa-trash-alt" style="margin-right: 10px; min-width: 24px; text-align: center;"></i>
                                        <p>Remove Member</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table class="table is-fullwidth is-hoverable is-marginless">
                        <thead>
                            <th>Name</th>
                            <th>Role</th>
                            <th></th>
                        </thead>
                        <tbody>
                            <tr
                                class="row"
                                v-for="member in org.members"
                                :key="member.name"
                            >
                                <td>
                                    {{ member.name }}
                                </td>
                                <td>
                                    <span class="is-capitalized">
                                        {{ member.role }}
                                    </span>
                                </td>
                                <td class="row-action-button">
                                    <a>
                                        <span class="icon">
                                            <i class="fas fa-ellipsis-v"></i>
                                        </span>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="datatable-footer">
                        <a class="datatable-footer-item">
                            See All Members
                            <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade">
            <WorkspaceModal
                v-if="showWorkspaceModal"
                :action="action"
                :workspaces="workspaces"
                :workspace-memberships="org.workspaces"
            />
        </transition>
    </div>
</template>

<script>
import moment from 'moment';
import WorkspaceModal from './WorkspaceModal.vue';
import { EventBus } from '@src/eventBus.js';

export default {
    components: {
        WorkspaceModal,
    },
    data() {
        return {
            action: '',
            builds: [
                'us-west-1',
                'us-east-1',
                'us-southeast-1',
                'us-southwest-1',
                'us-northwest-1',
                'ceres-12345',
                'The Lord of the Rings',
                'Star Wars',
                'one-last-build-kthx-bye'
            ],
            users: [
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
                'Yoda',
                'Chewbacca',
                'Droids-C-3PO-R2-D2',
                'Han Solo',
                'Darth Vader',
                'Luke Skywalker',
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

            isActive: false,
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
                description: 'Build team in charge of doing important things for the Empire and the Rebellion. May the force be with you.',
                members: [
                    {
                        name: 'Anakin Skywalker',
                        role: 'admin',
                        permissions: 'admin',
                    },
                    {
                        name: 'Darth Vader',
                        role: 'admin',
                        permissions: 'admin',
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
            showWorkspaceModal: false,
            showWorkspacesDropdown: false,
            showBuildsDropdown: false,
            showMembersDropdown: false,
        };
    },
    methods: {
        closeModal() {
            this.showBuildsModal = false,
            this.showMembersModal = false,
            this.showWorkspaceModal = false;
        },
        getDate(date) {
            return moment(date).format('MM/DD/YYYY');
        },
        openWorkspaceModal(action) {
            this.showWorkspacesDropdown = false;
            this.action = action;
            this.showWorkspaceModal = true;
        },
    },
    computed: {
        admins() {
            return this.org.members.filter(member => member.role === 'admin').length;
        },
        buildsActive() {
            return this.org.builds.filter(build => build.status === 'active').length;
        },
        buildsComplete() {
            return this.org.builds.filter(build => build.status === 'complete').length;
        },
    },
    mounted() {
        EventBus.$on('close-modal:action-modal', () => {
            this.closeModal();
        });
    },
};
</script>
