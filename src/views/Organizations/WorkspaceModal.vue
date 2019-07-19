<template>
    <div class="workspace-modal">
        <div class="modal modal-base" :class="{ 'is-active': isActive }">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content" style="min-width: 460px; width: auto;">
                <div class="notification is-marginless">
                    <button
                        class="delete is-medium"
                        @click="closeModal()"
                    ></button>
                    <div class="modal-title title has-text-centered">
                        <span class="is-capitalized">{{ action }}</span>
                        Workspaces
                    </div>
                    <div class="columns">
                        <div class="column">
                            <div class="datatable-simple" style="overflow-x: visible;">
                                <table class="table is-fullwidth is-marginless">
                                    <tbody>
                                        <tr class="row-simple header" v-if="action === 'add'">
                                            <td class="table-data" style="justify-content: left;">
                                                <span class="is-uppercase is-size-6">
                                                    Workspaces
                                                </span>
                                            </td>

                                            <div class="dropdown is-right" :class="{ 'is-active': showDropdown }">
                                                <a
                                                    class="dropdown-trigger"
                                                    @click="showDropdown = !showDropdown"
                                                >
                                                    <td class="row-action-button">
                                                        <span class="icon">
                                                            <i class="fas fa-ellipsis-v"></i>
                                                        </span>
                                                    </td>
                                                </a>
                                                <div class="dropdown-menu" style="z-index: 100;">
                                                    <div class="dropdown-content">
                                                        <div
                                                            class="dropdown-item"
                                                            style="display: flex; padding: 0 10px;"
                                                        >
                                                            <input
                                                                class="is-checkradio is-success"
                                                                id="showAllWorkspaces"
                                                                type="checkbox"
                                                                name="showAllWorkspaces"
                                                                :checked="showAllWorkspaces"
                                                                v-model="showAllWorkspaces"
                                                            >
                                                            <label
                                                                for="showAllWorkspaces"
                                                                style="white-space: nowrap;"
                                                                class="heading is-size-7"
                                                            >
                                                                Show All Workspaces
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </tr>
                                        <tr class="row-simple header" v-else>
                                            <td class="table-data">
                                                <span class="is-uppercase is-size-6">
                                                    Workspaces
                                                </span>
                                            </td>
                                        </tr>
                                        <template v-if="action === 'add'">
                                            <tr
                                                class="row-simple"
                                                :class="{
                                                    'disabled': workspace.membership || isMembershipChanging(workspace.name),
                                                }"
                                                v-for="workspace in workspaceList"
                                                :key="workspace.name"
                                            >
                                                <template
                                                    v-if="workspace.membership"
                                                >
                                                    <td class="table-data">
                                                        <span class="is-italic has-text-grey">
                                                            {{ workspace.name }}
                                                        </span>
                                                    <td class="row-action-button" style="cursor: default;">
                                                        <i class="material-icons has-text-grey">
                                                            check
                                                        </i>
                                                    </td>
                                                </template>
                                                <template v-else>
                                                    <td class="table-data">
                                                        {{ workspace.name }}
                                                    </td>
                                                    <td class="row-action-button add">
                                                        <span
                                                            class="is-italic has-text-info"
                                                            v-if="isMembershipChanging(workspace.name) === true"
                                                        >
                                                            adding
                                                        </span>
                                                        <i
                                                            class="material-icons has-text-success"
                                                            @click="changeWorkspaceMembership(workspace.name)"
                                                            style="cursor: pointer"
                                                            v-else
                                                        >
                                                            add
                                                        </i>
                                                    </td>
                                                </template>
                                            </tr>
                                        </template>
                                        <tr
                                            class="row-simple"
                                            :class="{ 'disabled': isMembershipChanging(workspace) }"
                                            v-for="workspace in workspaceList"
                                            :key="workspace"
                                            v-else
                                        >
                                            <td class="table-data">
                                                <span>
                                                    {{ workspace }}
                                                </span>
                                            <td class="row-action-button remove">
                                                <span
                                                    class="is-italic has-text-info"
                                                    v-if="isMembershipChanging(workspace) === true"
                                                >
                                                    removing
                                                </span>
                                                <i
                                                    class="material-icons has-text-danger"
                                                    @click="changeWorkspaceMembership(workspace)"
                                                    v-else
                                                >
                                                    close
                                                </i>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="column">
                            <div class="datatable-simple">
                                <table class="table is-fullwidth is-margin">
                                    <tbody>
                                        <tr class="row-simple header">
                                            <td class="table-data">
                                                <span class="is-uppercase is-size-6">
                                                    Pending Changes
                                                </span>
                                            </td>
                                        </tr>
                                        <template v-if="changingWorkspaces.length">
                                            <tr
                                                class="row-simple"
                                                v-for="workspace in changingWorkspaces"
                                                :key="`add-${workspace}`"
                                            >
                                                <td class="table-data">
                                                    {{ workspace }}
                                                </td>
                                                <td class="row-action-button remove">
                                                    <i
                                                        class="material-icons has-text-danger"
                                                        @click="removeChange(workspace)"
                                                    >
                                                        close
                                                    </i>
                                                </td>
                                            </tr>
                                        </template>
                                        <tr class="row-simple empty" v-else>
                                            <td class="table-data">
                                                <span class="has-text-grey">
                                                    No Changes Pending
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <footer>
                    <a class="button is-fullwidth is-success" v-if="changesExist">
                        <span class="icon" style="margin-right: 10px;">
                            <i class="material-icons">check</i>
                        </span>
                        <span>Confirm Changes</span>
                    </a>
                    <a class="button is-fullwidth is-info is-disabled" v-else>
                        <span class="icon" style="margin-right: 10px;">
                            <i class="material-icons">create</i>
                        </span>
                        <span>Add A Workspace</span>
                    </a>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from '@src/eventBus.js';

export default {
    props: {
        action: {
            type: String,
            required: true,
        },
        workspaceMemberships: {
            type: Array,
            required: true,
        },
        workspaces: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            changesExist: false,
            changingWorkspaces: [],
            isActive: true,
            isLoading: false,
            showAllWorkspaces: true,
            showDropdown: false,
        };
    },
    methods: {
        isMembershipChanging(workspace) {
            return this.changingWorkspaces.indexOf(workspace) !== -1 ? true : false;
        },
        changeWorkspaceMembership(workspace) {
            this.changesExist = true;
            this.changingWorkspaces.push(workspace);
        },
        closeModal() {
            EventBus.$emit('close-modal:action-modal');
        },
        removeChange(workspace) {
            const index = this.changingWorkspaces.indexOf(workspace);

            this.changingWorkspaces.splice(index, 1);

            if (!this.changingWorkspaces.length) {
                this.changesExist = false;
            }
        },
    },
    computed: {
        workspaceList() {
            if (this.action === 'add') {
                const workspaces = this.workspaces.sort();

                return workspaces.reduce((acc, workspace) => {
                    const workspaceItem = {
                        name: workspace,
                        membership: false,
                    };

                    if (this.workspaceMemberships.indexOf(workspace) !== -1) {
                        if (this.showAllWorkspaces) {
                            workspaceItem.membership = true;

                            acc.push(workspaceItem)
                        }
                    } else {
                        acc.push(workspaceItem)
                    }

                    return acc;
                }, []);
            } else {
                return this.workspaceMemberships.sort();
            }
        }
    },
    mounted() {
        EventBus.$on('closeModal:baseModal', () => {
            this.closeModal();
        });
    },
};
</script>
