<template>
    <div class="add-organization-modal">
        <div
            class="modal"
            :class="{ 'is-active': isActive }"
            v-if="!isSuccessful"
        >
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content">
                <div class="notification">
                    <div class="columns">
                        <div class="column is-4 step-details">
                            <div class="step-content">
                                <p class="title is-marginless">
                                    {{ currentStepTitle }}
                                </p>
                                <hr />
                                <template v-if="activeStep === 1">
                                    <p>Let’s get started!</p>
                                    <br />
                                    <p>
                                        Give the new organization a name and
                                        description.
                                    </p>
                                </template>
                                <template v-else-if="activeStep === 2">
                                    <p>Add some members to the</p>
                                    <p>organization.</p>
                                    <br />
                                    <p
                                        :class="{
                                            'has-text-danger has-text-weight-bold':
                                                errors.adminUserCount,
                                        }"
                                    >
                                        Every organization must have at least
                                        one user with admin privileges.
                                    </p>
                                    <br />
                                </template>
                                <template v-else-if="activeStep === 3">
                                    <p>Give the organization access</p>
                                    <p>to a build.</p>
                                </template>
                                <template v-else>
                                    <p>Last step!</p>
                                    <br />
                                    <p>
                                        Review the details of the new
                                        organization and make any changes
                                        necessary.
                                    </p>
                                    <br />
                                </template>
                            </div>
                            <div class="steps">
                                <p class="step-text">Step {{ activeStep }}</p>
                                <div class="dots">
                                    <span
                                        class="dot"
                                        :class="{
                                            'is-active': activeStep === 1,
                                        }"
                                        @click="activateStep(1)"
                                    ></span>
                                    <span
                                        class="dot"
                                        :class="{
                                            'is-active': activeStep === 2,
                                        }"
                                        @click="activateStep(2)"
                                    ></span>
                                    <span
                                        class="dot"
                                        :class="{
                                            'is-active': activeStep === 3,
                                        }"
                                        @click="activateStep(3)"
                                    ></span>
                                    <span
                                        class="dot"
                                        :class="{
                                            'is-active': activeStep === 4,
                                        }"
                                        @click="activateStep(4)"
                                    ></span>
                                </div>
                            </div>
                        </div>
                        <div class="column organization-details">
                            <div class="modal-heading">
                                <p class="modal-title">
                                    Create Organization
                                </p>
                                <i
                                    class="material-icons close"
                                    @click="closeModal()"
                                >
                                    close
                                </i>
                            </div>
                            <div class="modal-body">
                                <transition name="fade">
                                    <div
                                        class="step-body"
                                        v-if="activeStep === 1"
                                    >
                                        <div class="field">
                                            <label class="label">Name</label>
                                            <div
                                                class="control has-icons-right"
                                            >
                                                <input
                                                    class="input name"
                                                    :class="{
                                                        'is-danger':
                                                            errors.name,
                                                    }"
                                                    v-model="name"
                                                    type="text"
                                                    placeholder="Give your organization a name"
                                                />
                                                <span
                                                    class="icon is-small is-right has-text-danger"
                                                    v-if="errors.name"
                                                >
                                                    <i class="material-icons">
                                                        error
                                                    </i>
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
                                        <div class="field">
                                            <label class="label">
                                                Description
                                            </label>
                                            <textarea
                                                class="textarea has-fixed-size"
                                                name="description"
                                                v-model="description"
                                                maxlength="165"
                                                placeholder="Add a helpful description of your organization"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div
                                        class="step-body"
                                        v-else-if="activeStep === 2"
                                    >
                                        <div class="item-table">
                                            <table class="table is-fullwidth">
                                                <tbody>
                                                    <tr class="row search">
                                                        <td colspan="3">
                                                            <p
                                                                class="control has-icons-left"
                                                            >
                                                                <input
                                                                    class="input search"
                                                                    v-model="
                                                                        searchText
                                                                    "
                                                                    placeholder="Search users"
                                                                    type="text"
                                                                />
                                                                <span
                                                                    class="icon is-left"
                                                                >
                                                                    <i
                                                                        class="material-icons"
                                                                    >
                                                                        search
                                                                    </i>
                                                                </span>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <template
                                                        v-if="
                                                            filteredItems(
                                                                'members'
                                                            ).length > 0
                                                        "
                                                    >
                                                        <tr
                                                            class="row item"
                                                            :class="{
                                                                'is-selected': isItemSelected(
                                                                    user.name,
                                                                    'members'
                                                                ),
                                                            }"
                                                            v-for="user in filteredItems(
                                                                'members'
                                                            )"
                                                            :key="user.id"
                                                        >
                                                            <template
                                                                v-if="
                                                                    isItemSelected(
                                                                        user.name,
                                                                        'members'
                                                                    )
                                                                "
                                                            >
                                                                <td
                                                                    class="item-name"
                                                                >
                                                                    <span
                                                                        class="name has-text-grey-light"
                                                                    >
                                                                        {{
                                                                            user.name
                                                                        }}
                                                                    </span>
                                                                </td>
                                                                <td
                                                                    class="role-select"
                                                                >
                                                                    <div
                                                                        class="select role"
                                                                    >
                                                                        <select
                                                                            @change="
                                                                                updateRole(
                                                                                    user.name,
                                                                                    $event
                                                                                )
                                                                            "
                                                                        >
                                                                            <option
                                                                                value="admin"
                                                                            >
                                                                                Admin
                                                                            </option>
                                                                            <option
                                                                                value="rw"
                                                                            >
                                                                                Read / Write
                                                                            </option>
                                                                            <option
                                                                                value="ro"
                                                                                selected
                                                                            >
                                                                                Read Only
                                                                            </option>
                                                                        </select>
                                                                    </div>
                                                                </td>
                                                                <td
                                                                    class="action"
                                                                >
                                                                    <i
                                                                        class="material-icons has-text-success add-item"
                                                                        v-if="
                                                                            showRemoveIcon !==
                                                                                user.name
                                                                        "
                                                                        @mouseover="
                                                                            showRemoveIcon =
                                                                                user.name
                                                                        "
                                                                    >
                                                                        check
                                                                    </i>
                                                                    <i
                                                                        class="material-icons has-text-danger remove-item"
                                                                        v-if="
                                                                            showRemoveIcon ===
                                                                                user.name
                                                                        "
                                                                        @click="
                                                                            removeItem(
                                                                                user.name,
                                                                                'members'
                                                                            )
                                                                        "
                                                                        @mouseleave="
                                                                            showRemoveIcon =
                                                                                ''
                                                                        "
                                                                    >
                                                                        close
                                                                    </i>
                                                                </td>
                                                            </template>
                                                            <template v-else>
                                                                <td
                                                                    class="item-name"
                                                                >
                                                                    <span>
                                                                        {{
                                                                            user.name
                                                                        }}
                                                                    </span>
                                                                </td>
                                                                <td
                                                                    class="action"
                                                                >
                                                                    <i
                                                                        class="material-icons has-text-success add-item"
                                                                        @click="
                                                                            addItem(
                                                                                user,
                                                                                'members'
                                                                            )
                                                                        "
                                                                    >
                                                                        add
                                                                    </i>
                                                                </td>
                                                            </template>
                                                        </tr>
                                                    </template>
                                                    <tr
                                                        class="row item"
                                                        v-else-if="
                                                            filteredItems(
                                                                'members'
                                                            ).length === 0 &&
                                                                searchText
                                                        "
                                                    >
                                                        <td
                                                            class="has-text-centered no-results"
                                                        >
                                                            No search results
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div
                                        class="step-body"
                                        v-else-if="activeStep === 3"
                                    >
                                        <div class="item-table">
                                            <table class="table is-fullwidth">
                                                <tbody>
                                                    <tr class="row search">
                                                        <td colspan="3">
                                                            <p
                                                                class="control has-icons-left"
                                                            >
                                                                <input
                                                                    class="input search"
                                                                    v-model="
                                                                        searchText
                                                                    "
                                                                    placeholder="Search builds"
                                                                    type="text"
                                                                />
                                                                <span
                                                                    class="icon is-left"
                                                                >
                                                                    <i
                                                                        class="material-icons"
                                                                    >
                                                                        search
                                                                    </i>
                                                                </span>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <template
                                                        v-if="
                                                            filteredItems(
                                                                'builds'
                                                            ).length > 0
                                                        "
                                                    >
                                                        <tr
                                                            class="row item"
                                                            :class="{
                                                                'is-selected': isItemSelected(
                                                                    build.name,
                                                                    'builds'
                                                                ),
                                                            }"
                                                            v-for="build in filteredItems(
                                                                'builds'
                                                            )"
                                                            :key="build.id"
                                                        >
                                                            <template
                                                                v-if="
                                                                    isItemSelected(
                                                                        build.name,
                                                                        'builds'
                                                                    )
                                                                "
                                                            >
                                                                <td
                                                                    class="item-name"
                                                                >
                                                                    <span
                                                                        class="name has-text-grey-light"
                                                                    >
                                                                        {{
                                                                            build.name
                                                                        }}
                                                                    </span>
                                                                </td>
                                                                <td
                                                                    class="action"
                                                                >
                                                                    <i
                                                                        class="material-icons has-text-success add-item"
                                                                        v-if="
                                                                            showRemoveIcon !==
                                                                                build.name
                                                                        "
                                                                        @mouseover="
                                                                            showRemoveIcon =
                                                                                build.name
                                                                        "
                                                                    >
                                                                        check
                                                                    </i>
                                                                    <i
                                                                        class="material-icons has-text-danger remove-item"
                                                                        v-if="
                                                                            showRemoveIcon ===
                                                                                build.name
                                                                        "
                                                                        @click="
                                                                            removeItem(
                                                                                build.name,
                                                                                'builds'
                                                                            )
                                                                        "
                                                                        @mouseleave="
                                                                            showRemoveIcon =
                                                                                ''
                                                                        "
                                                                    >
                                                                        close
                                                                    </i>
                                                                </td>
                                                            </template>
                                                            <template v-else>
                                                                <td
                                                                    class="item-name"
                                                                >
                                                                    <span>
                                                                        {{
                                                                            build.name
                                                                        }}
                                                                    </span>
                                                                </td>
                                                                <td
                                                                    class="action"
                                                                >
                                                                    <i
                                                                        class="material-icons has-text-success add-item"
                                                                        @click="
                                                                            addItem(
                                                                                build,
                                                                                'builds'
                                                                            )
                                                                        "
                                                                    >
                                                                        add
                                                                    </i>
                                                                </td>
                                                            </template>
                                                        </tr>
                                                    </template>
                                                    <tr
                                                        class="row item"
                                                        v-else-if="
                                                            filteredItems(
                                                                'builds'
                                                            ).length === 0 &&
                                                                searchText
                                                        "
                                                    >
                                                        <td
                                                            class="has-text-centered no-results"
                                                        >
                                                            No search results
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div
                                        class="step-body review"
                                        v-else-if="activeStep === 4"
                                    >
                                        <div class="review-item details">
                                            <div
                                                class="review-item-title"
                                                :class="{
                                                    'is-expanded': isExpandedDetails,
                                                }"
                                                @click="
                                                    isExpandedDetails = !isExpandedDetails
                                                "
                                            >
                                                <i
                                                    class="material-icons details"
                                                >
                                                    notes
                                                </i>
                                                <p class="item-title">
                                                    Details
                                                </p>
                                                <i
                                                    class="material-icons chevron"
                                                >
                                                    chevron_right
                                                </i>
                                            </div>
                                            <div
                                                class="review-item-content"
                                                v-if="isExpandedDetails"
                                            >
                                                <div class="item-content-row">
                                                    {{ name }}
                                                </div>
                                                <div
                                                    class="item-content-row"
                                                    v-if="description"
                                                >
                                                    {{ description }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="review-item members">
                                            <div
                                                class="review-item-title"
                                                :class="{
                                                    'is-expanded': isExpandedMembers,
                                                }"
                                                @click="
                                                    isExpandedMembers = !isExpandedMembers
                                                "
                                            >
                                                <i
                                                    class="material-icons members"
                                                >
                                                    people_alt
                                                </i>
                                                <p class="item-title">
                                                    Members
                                                </p>
                                                <i
                                                    class="material-icons chevron"
                                                >
                                                    chevron_right
                                                </i>
                                            </div>
                                            <div
                                                class="review-item-content"
                                                v-if="
                                                    isExpandedMembers &&
                                                        selectedMembers.length
                                                "
                                            >
                                                <div
                                                    class="item-content-row"
                                                    v-for="user in selectedMembers"
                                                    :key="user.id"
                                                >
                                                    {{ user.email }}
                                                </div>
                                            </div>
                                            <div
                                                class="review-item-content"
                                                v-else-if="
                                                    isExpandedMembers &&
                                                        !selectedMembers.length
                                                "
                                            >
                                                <div
                                                    class="item-content-row empty"
                                                >
                                                    No members selected
                                                </div>
                                            </div>
                                        </div>
                                        <div class="review-item builds">
                                            <div
                                                class="review-item-title"
                                                :class="{
                                                    'is-expanded': isExpandedBuilds,
                                                }"
                                                @click="
                                                    isExpandedBuilds = !isExpandedBuilds
                                                "
                                            >
                                                <i
                                                    class="material-icons builds"
                                                >
                                                    layers
                                                </i>
                                                <p class="item-title">
                                                    Builds
                                                </p>
                                                <i
                                                    class="material-icons chevron"
                                                >
                                                    chevron_right
                                                </i>
                                            </div>
                                            <div
                                                class="review-item-content"
                                                v-if="
                                                    isExpandedBuilds &&
                                                        selectedBuilds.length
                                                "
                                            >
                                                <div
                                                    class="item-content-row"
                                                    v-for="build in selectedBuilds"
                                                    :key="build.id"
                                                >
                                                    {{ build.name }}
                                                </div>
                                            </div>
                                            <div
                                                class="review-item-content"
                                                v-else-if="
                                                    isExpandedBuilds &&
                                                        !selectedBuilds.length
                                                "
                                            >
                                                <div
                                                    class="item-content-row empty"
                                                >
                                                    No builds selected
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                            <div class="modal-footer">
                                <div
                                    class="buttons"
                                    :class="{ 'first-step': activeStep === 1 }"
                                    v-if="activeStep < 4"
                                >
                                    <a
                                        class="button previous is-link"
                                        @click="activeStep--"
                                        v-if="activeStep !== 1"
                                    >
                                        Previous
                                    </a>
                                    <a
                                        class="button next is-info"
                                        @click="nextStep()"
                                    >
                                        Next
                                    </a>
                                </div>
                                <a
                                    class="button is-fullwidth is-success"
                                    :class="{ 'is-loading': isLoading }"
                                    @click="createOrganization()"
                                    style="border-radius: 3px; font-weight: bold;"
                                    :disabled="getAdminUserCount() === 0"
                                    v-else
                                >
                                    Create Organization
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <SuccessModal :organization-name="name" v-if="isSuccessful" />
    </div>
</template>

<script>
import search from 'fuzzysearch';
import SuccessModal from './SuccessModal.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import { getUsers } from '@api/users.js';
import * as Organizations from '@api/organizations.js';
import { addOrganizationToBuild } from '@api/builds.js';

export default {
    components: {
        SuccessModal,
    },
    data() {
        return {
            activeStep: 1,
            builds: [
                {
                    name: 'Builds-1',
                    id: 'abcd-1',
                },
                {
                    name: 'Builds-2',
                    id: 'abcd-2',
                },
                {
                    name: 'Builds-3',
                    id: 'abcd-3',
                },
                {
                    name: 'Builds-4',
                    id: 'abcd-4',
                },
                {
                    name: 'Builds-5',
                    id: 'abcd-5',
                },
                {
                    name: 'Builds-6',
                    id: 'abcd-6',
                },
                {
                    name: 'Builds-7',
                    id: 'abcd-7',
                },
                {
                    name: 'Builds-8',
                    id: 'abcd-8',
                },
            ],
            description: '',
            errors: {
                adminUserCount: false,
                name: false,
            },
            isActive: true,
            isExpandedBuilds: true,
            isExpandedDetails: true,
            isExpandedMembers: true,
            isLoading: false,
            isSuccessful: false,
            name: '',
            organizationId: '',
            searchText: '',
            selectedBuilds: [],
            selectedMembers: [],
            showRemoveIcon: false,
        };
    },
    methods: {
        ...mapActions(['setUsers']),
        activateStep(step) {
            this.searchText = '';
            const activeStep = this.activeStep;

            if (activeStep === 1) {
                if (this.name) {
                    this.resetErrors();
                    this.activeStep = step;
                } else {
                    this.errors.name = true;
                }
            } else if (activeStep === 2) {
                if (this.getAdminUserCount() === 0) {
                    this.errors.adminUserCount = true;
                }
            } else {
                this.resetErrors();
                this.activeStep = step;
            }
        },
        addItem(item, itemType) {
            const role = { role: 'ro' };

            if (itemType === 'members') {
                const member = Object.assign(item, role);
                this.selectedMembers.push(member);
            } else if (itemType === 'builds') {
                const build = Object.assign(item, role);
                this.selectedBuilds.push(build);
            }
        },
        closeModal() {
            this.isActive = false;

            EventBus.$emit('close-modal:add-organization');
        },
        addOrganizationToBuilds() {
            const organizationId = this.organizationId;

            this.selectedBuilds.forEach(build => {
                addOrganizationToBuild(build.id, organizationId, build.role);
            });
        },
        async createOrganization() {
            this.isLoading = true;

            const admins = this.selectedMembers
                .filter(member => member.role === 'admin')
                .map(user => {
                    return { user_id: user.id };
                });

            await Organizations.createOrganization(
                this.name,
                this.description,
                admins
            ).then(response => {
                this.organizationId = response.data.id;
            });

            EventBus.$emit('organization-created');

            await this.addOrganizationToBuilds();

            this.isLoading = false;
            this.isSuccessful = true;
        },
        filteredItems(itemType) {
            const searchText = this.searchText.toLowerCase();
            let items;

            if (itemType === 'members') {
                items = this.users;
            } else if (itemType === 'builds') {
                items = this.builds;
            }

            if (searchText) {
                return items.reduce((acc, item) => {
                    const name = item.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(item);
                    }

                    return acc;
                }, []);
            }

            return items;
        },
        getAdminUserCount() {
            return this.selectedMembers.filter(
                member => member.role === 'admin'
            ).length;
        },
        isItemSelected(itemName, itemType) {
            const selectedBuilds = this.selectedBuilds;
            const selectedMembers = this.selectedMembers;

            if (itemType === 'members' && selectedMembers.length) {
                return selectedMembers
                    .map(user => user.name)
                    .indexOf(itemName) !== -1
                    ? true
                    : false;
            } else if (itemType === 'builds' && selectedBuilds.length) {
                return selectedBuilds
                    .map(build => build.name)
                    .indexOf(itemName) !== -1
                    ? true
                    : false;
            }

            return false;
        },
        nextStep() {
            this.searchText = '';
            const activeStep = this.activeStep;

            if (activeStep === 1) {
                if (this.name) {
                    this.resetErrors();
                    this.activeStep++;
                } else {
                    this.errors.name = true;
                }
            } else if (activeStep === 2) {
                if (this.getAdminUserCount() === 0) {
                    this.errors.adminUserCount = true;
                } else {
                    this.resetErrors();
                    this.activeStep++;
                }
            } else {
                this.resetErrors();
                this.activeStep++;
            }
        },
        removeItem(itemName, itemType) {
            let index;

            if (itemType === 'members') {
                index = this.selectedMembers
                    .map(member => member.name)
                    .indexOf(itemName);

                this.selectedMembers.splice(index, 1);
            } else if (itemType === 'builds') {
                index = this.selectedBuilds
                    .map(build => build.name)
                    .indexOf(itemName);

                this.selectedBuilds.splice(index, 1);
            }
        },
        resetErrors() {
            this.errors = {
                adminUserCount: false,
                name: false,
            };
        },
        updateRole(itemName, event) {
            if (event && event.target && event.target.value) {
                const selectedMembers = this.selectedMembers;

                for (let i = 0; i < selectedMembers.length; i++) {
                    const modifiedUser = selectedMembers[i];

                    if (modifiedUser.name === itemName) {
                        this.selectedMembers[i].role = event.target.value;

                        break;
                    }
                }
            }
        },
    },
    computed: {
        ...mapState(['users']),
        currentStepTitle() {
            const activeStep = this.activeStep;

            if (activeStep === 1) {
                return 'Add Details';
            } else if (activeStep === 2) {
                return 'Add Members';
            } else if (activeStep === 3) {
                return 'Add Builds';
            }

            return 'Final Review';
        },
    },
    created() {
        if (!this.users.length) {
            getUsers().then(response => {
                this.setUsers(response.data);
            });
        }
    },
};
</script>
