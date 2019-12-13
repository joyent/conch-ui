<template>
    <div class="create-user-modal">
        <BaseModal v-if="step === 1">
            <template v-slot:icon>
                <i class="fas fa-4x fa-address-card"></i>
            </template>
            <template v-slot:title>
                <h1 class="title is-3">
                    Create User
                </h1>
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
                    <div class="field password">
                        <label class="label">Password</label>
                        <div class="control has-icons-right">
                            <input
                                class="input"
                                :class="{ 'is-danger': errors.password }"
                                type="text"
                                placeholder="Password"
                                v-model="password"
                            />
                            <span
                                class="icon is-small is-right has-text-danger"
                                v-if="errors.password"
                            >
                                <i class="fas fa-exclamation-triangle"></i>
                            </span>
                        </div>
                        <p
                            class="error has-text-danger is-size-6"
                            v-if="errors.password"
                            style="padding-top: 5px;"
                        >
                            This field is required.
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
                    class="button is-success is-fullwidth add-workspaces"
                    @click="addUserToWorkspaces()"
                >
                    Add User to Workspaces
                    <i class="material-icons">arrow_forward</i>
                </a>
            </template>
        </BaseModal>
        <BaseModal v-if="step === 2">
            <template v-slot:icon>
                <i class="material-icons workspace-icon">widgets</i>
            </template>
            <template v-slot:title>
                <span>
                    <h1 class="title">Add User to Workspaces</h1>
                </span>
            </template>
            <template v-slot:body>
                <div class="workspaces-table">
                    <table class="table is-fullwidth">
                        <tr>
                            <td class="search-input" colspan="3">
                                <p class="control has-icons-left">
                                    <input
                                        class="input search"
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
                                class="workspace"
                                :class="{
                                    'is-selected': isSelected(workspace.name),
                                }"
                                v-for="workspace in filteredWorkspaces"
                                :key="workspace.id"
                            >
                                <td>{{ workspace.name }}</td>
                                <td class="workspace-permissions-select">
                                    <div
                                        class="select permissions"
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
                                            <option value="admin">Admin</option>
                                            <option value="rw">
                                                Read &#47; Write
                                            </option>
                                            <option value="ro" selected>
                                                Read Only
                                            </option>
                                        </select>
                                    </div>
                                </td>
                                <td class="workspace-checkbox">
                                    <div
                                        class="checkbox-round"
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
                    class="button is-success is-fullwidth create"
                    @click="createUser()"
                    :class="{ 'is-loading': isLoading }"
                >
                    Create User
                    <i class="material-icons">arrow_forward</i>
                </a>
            </template>
        </BaseModal>
        <BaseModal v-if="step === 3">
            <template v-slot:icon>
                <i class="far fa-4x fa-check-circle has-text-success"></i>
            </template>
            <template v-slot:title>
                <h1 class="title is-3">Success!</h1>
            </template>
            <template v-slot:body>
                <p class="subtitle">
                    <strong class="has-text-white">{{ name }}</strong> has been
                    successfully created.
                </p>
            </template>
            <template v-slot:footer>
                <a
                    class="button confirm is-success is-fullwidth"
                    @click="closeModal()"
                >
                    Close
                    <i class="material-icons">arrow_forward</i>
                </a>
            </template>
        </BaseModal>
    </div>
</template>

<script>
import search from 'fuzzysearch';
import orderBy from 'lodash/orderBy';
import BaseModal from '@src/views/components/BaseModal.vue';
import * as Users from '@api/users.js';
import { mapState } from 'vuex';
import { EventBus } from '@src/eventBus.js';
import { addUserToWorkspace } from '@api/workspaces.js';

export default {
    components: {
        BaseModal,
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
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
            workspacePermissions: [],
        };
    },
    methods: {
        addUserToWorkspaces() {
            if (this.validateForm()) {
                this.step = 2;
            }
        },
        async addWorkspaces(userId) {
            await this.workspacePermissions.forEach(workspace => {
                addUserToWorkspace(workspace.workspaceId, {
                    user: this.email,
                    role: workspace.permissions,
                });
            });

            EventBus.$emit('action-success', {
                userId,
                action: 'create',
            });

            this.step = 3;
            this.isLoading = false;
        },
        closeModal() {
            this.isActive = false;
            this.resetErrors();

            if (this.success) {
                this.success = false;

                EventBus.$emit('close-modal:success');
            } else {
                EventBus.$emit('close-modal');
            }
        },
        createUser() {
            this.isLoading = true;
            this.resetErrors();

            if (this.validateForm()) {
                const user = {
                    email: this.email,
                    is_admin: this.isAdmin,
                    name: this.name,
                    password: this.password,
                };

                Users.createUser(user)
                    .then(response => {
                        const userId = response.data.id;

                        this.addWorkspaces(userId);
                    })
                    .catch(error => {
                        if (error.status === 409) {
                            this.errors.duplicateEmail = true;
                            this.isLoading = false;
                        }
                    });
            } else {
                this.isLoading = false;
            }
        },
        isSelected(workspace) {
            return this.selectedWorkspaces.indexOf(workspace) !== -1;
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
            const index = this.selectedWorkspaces.indexOf(workspaceName);

            if (index === -1) {
                this.selectedWorkspaces.push(workspaceName);
                this.workspacePermissions.push({
                    workspaceId: workspace.id,
                    permissions: 'ro',
                });
            } else {
                this.selectedWorkspaces.splice(index, 1);
                this.workspacePermissions.splice(index, 1);
            }
        },
        updatePermissions(workspace, event) {
            const index = this.selectedWorkspaces.indexOf(workspace);

            if (event && event.target && event.target.value) {
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

            if (!this.password) {
                this.errors.password = true;
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
        EventBus.$on('closeModal:baseModal', () => {
            this.closeModal();
        });
    },
};
</script>
