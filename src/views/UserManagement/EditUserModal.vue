<template>
    <div class="edit-user-modal">
        <BaseModal v-if="step === 1">
            <template v-slot:icon>
                <i class="fas fa-4x fa-address-card has-text-info"></i>
            </template>
            <template v-slot:title>
                <h1 class="title is-3">Edit User</h1>
            </template>
            <template v-slot:body>
                <form>
                    <div class="field name">
                        <label class="label">Name</label>
                        <div class="control has-icons-right">
                            <input
                                class="input"
                                :class="{ 'is-danger': errors.name }"
                                type="text"
                                placeholder="Name"
                                v-model="name"
                            />
                            <span
                                class="icon is-small is-right has-text-danger"
                                v-if="errors.name"
                            >
                                <i class="fas fa-exclamation-triangle"></i>
                            </span>
                        </div>
                        <p
                            class="error has-text-danger is-size-6"
                            v-if="errors.name"
                            style="padding-top: 5px;"
                        >
                            This field is required.
                        </p>
                    </div>
                    <div class="field email">
                        <label class="label">Email</label>
                        <div class="control has-icons-right">
                            <input
                                class="input"
                                :class="{
                                    'is-danger': errors.invalidEmail,
                                }"
                                type="email"
                                placeholder="Email"
                                v-model="email"
                            />
                            <span
                                class="icon is-small is-right has-text-danger"
                                v-if="errors.invalidEmail"
                            >
                                <i class="fas fa-exclamation-triangle"></i>
                            </span>
                        </div>
                        <p
                            class="error has-text-danger is-size-6"
                            v-if="errors.invalidEmail || errors.duplicateEmail"
                            style="padding-top: 5px;"
                        >
                            <span v-if="errors.invalidEmail">
                                Please enter a valid email.
                            </span>
                            <span v-if="errors.duplicateEmail">
                                This email is already in use.
                            </span>
                        </p>
                    </div>
                    <div class="field" style="margin-top: 15px;">
                        <label class="label">Is Admin?</label>
                        <label class="switch">
                            <input
                                type="checkbox"
                                :checked="isAdmin"
                                v-model="isAdmin"
                                :true-value="true"
                                :false-value="false"
                            />
                            <span class="slider round is-success"></span>
                        </label>
                        <span style="margin-left: 8px;">
                            <strong v-if="isAdmin">Yes</strong>
                            <strong v-else>No</strong>
                        </span>
                    </div>
                </form>
            </template>
            <template v-slot:footer>
                <a
                    class="button is-success edit is-fullwidth"
                    :class="{ 'is-loading': isLoading }"
                    @click="editWorkspaces()"
                >
                    Edit Workspaces
                    <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                </a>
            </template>
        </BaseModal>
        <BaseModal v-if="step === 2">
            <template v-slot:icon>
                <i class="material-icons workspace-icon">widgets</i>
            </template>
            <template v-slot:title>
                <span>
                    <h1 class="title">Edit User Workspaces</h1>
                </span>
            </template>
            <template v-slot:body>
                <div class="workspaces-table">
                    <table class="table is-fullwidth">
                        <tr>
                            <td class="search-input" colspan="3">
                                <p class="control has-icons-left">
                                    <input
                                        class="input"
                                        type="text"
                                        placeholder="Search workspaces"
                                        v-model="searchText"
                                    />
                                    <span class="icon is-left">
                                        <i class="material-icons">search</i>
                                    </span>
                                </p>
                            </td>
                        </tr>
                        <template v-if="filteredWorkspaces.length">
                            <tr
                                v-for="workspace in filteredWorkspaces"
                                :key="workspace.id"
                                :class="{
                                    'is-selected': isSelected(workspace.name),
                                }"
                            >
                                <td>{{ workspace.name }}</td>
                                <td class="workspace-permissions-select">
                                    <div
                                        class="select"
                                        v-if="isSelected(workspace.name)"
                                    >
                                        <select
                                            @change="
                                                updatePermissions(
                                                    workspace.name,
                                                    $event
                                                )
                                            "
                                        >
                                            <option
                                                value="admin"
                                                :selected="
                                                    getWorkspaceRole(
                                                        workspace.name
                                                    ) === 'admin'
                                                "
                                            >
                                                Admin
                                            </option>
                                            <option
                                                value="rw"
                                                :selected="
                                                    getWorkspaceRole(
                                                        workspace.name
                                                    ) === 'rw'
                                                "
                                            >
                                                Read / Write
                                            </option>
                                            <option
                                                value="ro"
                                                :selected="
                                                    getWorkspaceRole(
                                                        workspace.name
                                                    ) === 'ro'
                                                "
                                            >
                                                Read Only
                                            </option>
                                        </select>
                                    </div>
                                </td>
                                <td class="workspace-checkbox">
                                    <div
                                        class="checkbox-circle"
                                        :class="{
                                            'is-selected': isSelected(
                                                workspace.name
                                            ),
                                        }"
                                        @click="selectWorkspace(workspace)"
                                    >
                                        <i
                                            class="material-icons"
                                            v-if="isSelected(workspace.name)"
                                        >
                                            check
                                        </i>
                                    </div>
                                </td>
                            </tr>
                        </template>
                        <tr v-else>
                            <td colspan="3" class="has-text-centered">
                                No workspaces named
                                <span
                                    class="has-text-weight-bold has-text-white"
                                >
                                    {{ searchText }}
                                </span>
                                found.
                            </td>
                        </tr>
                    </table>
                </div>
            </template>
            <template v-slot:footer>
                <a
                    class="button confirm is-success is-fullwidth"
                    @click="saveChanges()"
                    :class="{ 'is-loading': isLoading }"
                >
                    Save Changes
                    <i class="material-icons">arrow_forward</i>
                </a>
            </template>
        </BaseModal>
        <BaseModal v-if="step === 3">
            <template v-slot:icon>
                <i
                    class="far fa-3x fa-check-circle has-text-success"
                    v-if="success"
                ></i>
                <i v-else class="fas fa-3x fa-id-badge has-text-warning"></i>
            </template>
            <template v-slot:title>
                <span v-if="success">
                    <h1 class="title">Success!</h1>
                </span>
            </template>
            <template v-slot:body>
                <p class="subtitle" v-if="success">
                    <strong class="has-text-white">{{ name }}</strong> has been
                    successfully updated.
                </p>
                <p class="subtitle" v-else>
                    No information was changed.
                </p>
            </template>
            <template v-slot:footer>
                <a
                    class="button confirm is-success is-fullwidth"
                    @click="closeModal()"
                >
                    <span v-if="success">Great!</span>
                    <span v-else>Close</span>
                    <i class="fas fa-lg fa-long-arrow-alt-right"></i>
                </a>
            </template>
        </BaseModal>
    </div>
</template>

<script>
import search from 'fuzzysearch';
import orderBy from 'lodash/orderBy';
import BaseModal from '@src/views/components/BaseModal.vue';
import { editUser } from '@api/users.js';
import { EventBus } from '@src/eventBus.js';
import { mapState } from 'vuex';

export default {
    components: {
        BaseModal,
    },
    props: {
        modalStep: {
            type: Number,
            required: false,
            default: 1,
        },
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            actionComplete: false,
            email: '',
            emailIsValid: false,
            errors: {
                duplicateEmail: false,
                invalidEmail: false,
                name: false,
                password: false,
            },
            isActive: true,
            isAdmin: false,
            isLoading: false,
            name: '',
            password: '',
            searchText: '',
            selectedWorkspaces: [],
            step: 1,
            success: false,
            workspacePermissions: [],
            updatedWorkspaces: [],
        };
    },
    methods: {
        editWorkspaces() {
            if (this.validateForm()) {
                this.step = 2;
            }
        },
        closeModal() {
            this.actionComplete = false;
            this.isActive = false;
            this.step = 1;
            this.resetErrors();

            if (this.success) {
                this.success = false;

                EventBus.$emit('close-modal:success');
            } else {
                EventBus.$emit('close-modal');
            }
        },
        getWorkspaceRole(workspaceName) {
            let ws = this.user.workspaces.find(workspace => {
                return workspace.name === workspaceName;
            });

            if (ws && ws.role) {
                return ws.role;
            } else {
                return 'ro';
            }
        },
        saveChanges() {
            this.resetErrors();
            this.isLoading = true;

            if (
                this.name === this.user.name &&
                this.email === this.user.email &&
                this.isAdmin === this.user.is_admin
            ) {
                this.actionComplete = true;
                this.isLoading = false;

                return;
            }

            if (this.validateForm()) {
                const editedUser = {
                    id: this.user.id,
                    email: this.email,
                    is_admin: this.isAdmin,
                    name: this.name,
                };

                editUser(editedUser)
                    .then(() => {
                        this.actionComplete = true;
                        this.success = true;
                        this.isLoading = false;
                        EventBus.$emit('action-success', editedUser.id);
                    })
                    .catch(error => {
                        if (error.status === 500) {
                            this.errors.duplicateEmail = true;
                            this.isLoading = false;
                        }
                    });
            } else {
                this.isLoading = false;
            }
        },
        isSelected(workspaceName) {
            const selected = this.selectedWorkspaces.some(userWorkspace => {
                return workspaceName === userWorkspace;
            });

            return selected;
        },
        resetErrors() {
            this.errors = {
                duplicateEmail: false,
                invalidEmail: false,
                name: false,
                password: false,
            };
        },
        selectWorkspace(workspace) {
            const workspaceName = workspace.name;
            const updatedWorkspaces = this.updatedWorkspaces;
            const selectedWorkspacesIndex = this.selectedWorkspaces.indexOf(
                workspaceName
            );
            let updatedWorkspaceIndex;

            for (let i = 0; i < updatedWorkspaces.length; i++) {
                if (updatedWorkspaces[i].name === workspace.name) {
                    updatedWorkspaceIndex = i;
                }
            }

            if (selectedWorkspacesIndex === -1) {
                this.selectedWorkspaces.push(workspaceName);
                this.workspacePermissions.push({
                    workspaceId: workspace.id,
                    permissions: 'ro',
                });
            } else {
                this.selectedWorkspaces.splice(selectedWorkspacesIndex, 1);
                this.workspacePermissions.splice(selectedWorkspacesIndex, 1);
            }

            if (updatedWorkspaceIndex === undefined) {
                this.updatedWorkspaces.push({
                    workspaceId: workspace.id,
                    permissions: 'ro',
                });
            } else {
                this.updatedWorkspaces.splice(updatedWorkspaceIndex, 1);
            }
        },
        updatePermissions(workspace, event) {
            const index = this.selectedWorkspaces.indexOf(workspace);
            const updatedWorkspaces = this.updatedWorkspaces;
            let updatedWorkspaceIndex;

            for (let i = 0; i < updatedWorkspaces.length; i++) {
                if (updatedWorkspaces[i].name === workspace.name) {
                    updatedWorkspaceIndex = i;
                }
            }

            if (event && event.target && event.target.value) {
                this.updatedWorkspaces[updatedWorkspaceIndex].permissions =
                    event.target.value;
                this.workspacePermissions[index].permissions =
                    event.target.value;
            }
        },
        validEmail() {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(this.email);
        },
        validateForm() {
            this.resetErrors();

            if (!this.name) {
                this.errors.name = true;
            }

            if (!this.email || !this.validEmail()) {
                this.errors.invalidEmail = true;
            }

            return Object.values(this.errors).some(error => error === true)
                ? false
                : true;
        },
    },
    computed: {
        ...mapState(['workspaces']),
        filteredWorkspaces() {
            let workspaces = this.workspaces;
            const searchText = this.searchText.toLowerCase();

            if (searchText) {
                return workspaces.reduce((acc, workspace) => {
                    const name = workspace.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(workspace);
                    }

                    return acc;
                }, []);
            }

            // Sort list alphabetically by workspace name
            workspaces = orderBy(
                workspaces,
                [workspace => workspace.name],
                ['asc']
            );

            return workspaces;
        },
    },
    mounted() {
        const user = this.user;

        if (this.modalStep) {
            this.step = this.modalStep;
        }

        if (user) {
            this.email = user.email;
            this.name = user.name;
            this.password = user.password;
            this.isAdmin = user.is_admin;

            if (user.workspaces) {
                user.workspaces.forEach(workspace => {
                    this.selectedWorkspaces.push(workspace.name);
                    this.workspacePermissions.push({
                        workspaceId: workspace.id,
                        permissions: workspace.role,
                    });
                });
            }
        }

        EventBus.$on('closeModal:baseModal', () => {
            this.closeModal();
        });
    },
};
</script>
