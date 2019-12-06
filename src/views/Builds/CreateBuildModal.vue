<template>
    <div class="create-build-modal">
        <div class="modal is-active" v-if="creatingBuild && !showSuccessModal">
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
                                    <p>Let's get started!</p>
                                    <br />
                                    <p>
                                        Give the new build a name and description.
                                    </p>
                                </template>
                                <template v-if="activeStep === 2">
                                    <p>Add some members to the build.</p>
                                    <br />
                                    <p
                                        :class="{
                                            'has-text-danger has-text-weight-bold':
                                                errors.adminUserCount,
                                        }"
                                    >
                                        Every build must have at least one user with
                                        admin privileges.
                                    </p>
                                </template>
                                <template v-if="activeStep === 3">
                                    <p>Add some racks to the build.</p>
                                    <br />
                                    <p>
                                        When a rack is associated with a build, it's
                                        devices are also made a part of the build.
                                    </p>
                                </template>
                                <template v-if="activeStep === 4">
                                    <p>Add some devices to the build.</p>
                                </template>
                                <template v-if="activeStep === 5">
                                    <p>Last step!</p>
                                    <br />
                                    <p>
                                        Review the details of the new build and make any
                                        changes necessary.
                                    </p>
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
                                    <span
                                        class="dot"
                                        :class="{
                                            'is-active': activeStep === 5,
                                        }"
                                        @click="activateStep(5)"
                                    ></span>
                                </div>
                            </div>
                        </div>
                        <div class="column build-details">
                            <div class="modal-heading">
                                <p class="modal-title">Create Build</p>
                                <i class="material-icons close" @click="closeModal()">
                                    close
                                </i>
                            </div>
                            <div class="modal-body">
                                <transition name="fade">
                                    <div class="step-body" v-if="activeStep === 1">
                                        <div class="field">
                                            <label class="label">Name</label>
                                            <div
                                                class="control has-icons-right"
                                            >
                                                <input
                                                    class="input name is-marginless"
                                                    :class="{
                                                        'is-danger': errors.name,
                                                    }"
                                                    v-model="name"
                                                    type="text"
                                                    placeholder="Give your build a name"
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
                                                maxlength="165"
                                                v-model="description"
                                                placeholder="Add a helpful description of your build"
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
                                                                    class="input search is-marginless"
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
                                                        v-if="filteredItems('members').length > 0"
                                                    >
                                                        <tr
                                                            class="row item"
                                                            :class="{
                                                                'is-selected': isItemSelected(
                                                                    user.id,
                                                                    'members'
                                                                ),
                                                            }"
                                                            v-for="user in filteredItems(
                                                                'members'
                                                            )"
                                                            :key="user.id"
                                                        >
                                                            <template
                                                                v-if="isItemSelected(user.id, 'members')"
                                                            >
                                                                <td class="item-name">
                                                                    <span
                                                                        class="name has-text-grey-light"
                                                                    >
                                                                        {{ user.name }}
                                                                    </span>
                                                                </td>
                                                                <td class="role-select">
                                                                    <div
                                                                        class="select role"
                                                                    >
                                                                        <select
                                                                            @change="
                                                                                updateRole(
                                                                                    user.id,
                                                                                    $event
                                                                                )
                                                                            "
                                                                        >
                                                                            <option
                                                                                value="admin"
                                                                                :selected="user.role === 'admin'"
                                                                            >
                                                                                Admin
                                                                            </option>
                                                                            <option
                                                                                value="rw"
                                                                                :selected="user.role === 'rw'"
                                                                            >
                                                                                Read / Write
                                                                            </option>
                                                                            <option
                                                                                value="ro"
                                                                                :selected="user.role === 'ro'"
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
                                                                                user.id
                                                                        "
                                                                        @mouseover="
                                                                            showRemoveIcon =
                                                                                user.id
                                                                        "
                                                                    >
                                                                        check
                                                                    </i>
                                                                    <i
                                                                        class="material-icons has-text-danger remove-item"
                                                                        v-if="
                                                                            showRemoveIcon ===
                                                                                user.id
                                                                        "
                                                                        @click="removeItem(user.id, 'members')"
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
                                                                <td class="item-name">
                                                                    <span>
                                                                        {{ user.name }}
                                                                    </span>
                                                                </td>
                                                                <td class="action">
                                                                    <i
                                                                        class="material-icons has-text-success add-item"
                                                                        @click="addItem(user, 'members')"
                                                                    >
                                                                        add
                                                                    </i>
                                                                </td>
                                                            </template>
                                                        </tr>
                                                    </template>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div
                                        class="step-body"
                                        v-else-if="activeStep === 3"
                                    >
                                        <div class="item-table racks">
                                            <table class="table is-fullwidth">
                                                <tbody>
                                                    <tr class="row search">
                                                        <td colspan="3">
                                                            <p
                                                                class="control has-icons-left"
                                                            >
                                                                <input
                                                                    class="input search is-marginless"
                                                                    v-model="searchText"
                                                                    placeholder="Search..."
                                                                    type="text"
                                                                />
                                                                <span class="icon is-left">
                                                                    <i class="material-icons">
                                                                        search
                                                                    </i>
                                                                </span>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <template
                                                        v-if="filteredItems('racks').length > 0"
                                                    >
                                                        <tr
                                                            class="row item"
                                                            :class="{
                                                                'is-selected': isItemSelected(
                                                                    rack.id,
                                                                    'racks'
                                                                ),
                                                            }"
                                                            v-for="rack in filteredItems(
                                                                'racks'
                                                            )"
                                                            :key="rack.id"
                                                        >
                                                            <template
                                                                v-if="isItemSelected(rack.id, 'racks')"
                                                            >
                                                                <td class="item-name">
                                                                    <span class="name has-text-grey-light">
                                                                        {{ rack.name }}
                                                                    </span>
                                                                </td>
                                                                <td class="datacenter-room has-text-grey-light">
                                                                    <span>
                                                                        {{ getDatacenterRoom(rack.datacenter_room_id) }}
                                                                    </span>
                                                                </td>
                                                                <td class="action">
                                                                    <i
                                                                        class="material-icons has-text-success add-item"
                                                                        v-if="showRemoveIcon !== rack.id"
                                                                        @mouseover="showRemoveIcon = rack.id"
                                                                    >
                                                                        check
                                                                    </i>
                                                                    <i
                                                                        class="material-icons has-text-danger remove-item"
                                                                        v-if="showRemoveIcon === rack.id"
                                                                        @click="removeItem(rack.id, 'racks')"
                                                                        @mouseleave="showRemoveIcon = ''"
                                                                    >
                                                                        close
                                                                    </i>
                                                                </td>
                                                            </template>
                                                            <template v-else>
                                                                <td class="item-name">
                                                                    <span>
                                                                        {{ rack.name }}
                                                                    </span>
                                                                </td>
                                                                <td class="datacenter-room has-text-grey-light">
                                                                    <span>
                                                                        {{ getDatacenterRoom(rack.datacenter_room_id) }}
                                                                    </span>
                                                                </td>
                                                                <td class="action">
                                                                    <i
                                                                        class="material-icons has-text-success add-item"
                                                                        @click="addItem(rack, 'racks')"
                                                                    >
                                                                        add
                                                                    </i>
                                                                </td>
                                                            </template>
                                                        </tr>
                                                    </template>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div
                                        class="step-body"
                                        v-else-if="activeStep === 4"
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
                                                                    class="input search is-marginless"
                                                                    v-model="searchText"
                                                                    placeholder="Search..."
                                                                    type="text"
                                                                />
                                                                <span class="icon is-left">
                                                                    <i class="material-icons">
                                                                        search
                                                                    </i>
                                                                </span>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <template
                                                        v-if="filteredItems('devices').length > 0"
                                                    >
                                                        <tr
                                                            class="row item"
                                                            :class="{
                                                                'is-selected': isItemSelected(
                                                                    device.id,
                                                                    'devices'
                                                                ),
                                                            }"
                                                            v-for="device in filteredItems(
                                                                'devices'
                                                            )"
                                                            :key="device.id"
                                                        >
                                                            <template v-if="isItemSelected(device.id, 'devices')">
                                                                <td class="item-name">
                                                                    <span class="name has-text-grey-light">
                                                                        {{ device.serial_number }}
                                                                    </span>
                                                                </td>
                                                                <td class="action">
                                                                    <i
                                                                        class="material-icons has-text-success add-item"
                                                                        v-if="showRemoveIcon !== device.id"
                                                                        @mouseover="showRemoveIcon = device.id"
                                                                    >
                                                                        check
                                                                    </i>
                                                                    <i
                                                                        class="material-icons has-text-danger remove-item"
                                                                        v-if="showRemoveIcon === device.id"
                                                                        @click="removeItem(device.id, 'devices')"
                                                                        @mouseleave="showRemoveIcon = ''"
                                                                    >
                                                                        close
                                                                    </i>
                                                                </td>
                                                            </template>
                                                            <template v-else>
                                                                <td class="item-name">
                                                                    <span>
                                                                        {{ device.serial_number }}
                                                                    </span>
                                                                </td>
                                                                <td class="action">
                                                                    <i
                                                                        class="material-icons has-text-success add-item"
                                                                        @click="addItem(device, 'devices')"
                                                                    >
                                                                        add
                                                                    </i>
                                                                </td>
                                                            </template>
                                                        </tr>
                                                    </template>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div
                                        class="step-body review"
                                        v-else-if="activeStep === 5"
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
                                                    subject
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
                                                    group
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
                                        <div class="review-item racks">
                                            <div
                                                class="review-item-title"
                                                :class="{
                                                    'is-expanded': isExpandedRacks,
                                                }"
                                                @click="
                                                    isExpandedRacks = !isExpandedRacks
                                                "
                                            >
                                                <i
                                                    class="material-icons racks"
                                                >
                                                    storage
                                                </i>
                                                <p class="item-title">
                                                    Racks
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
                                                    isExpandedRacks &&
                                                        selectedRacks.length
                                                "
                                            >
                                                <div
                                                    class="item-content-row"
                                                    v-for="rack in selectedRacks"
                                                    :key="rack.id"
                                                >
                                                    {{ rack.name }}
                                                </div>
                                            </div>
                                            <div
                                                class="review-item-content"
                                                v-else-if="
                                                    isExpandedRacks &&
                                                        !selectedRacks.length
                                                "
                                            >
                                                <div
                                                    class="item-content-row empty"
                                                >
                                                    No racks selected
                                                </div>
                                            </div>
                                        </div>
                                        <div class="review-item devices">
                                            <div
                                                class="review-item-title"
                                                :class="{
                                                    'is-expanded': isExpandedDevices,
                                                }"
                                                @click="
                                                    isExpandedDevices = !isExpandedDevices
                                                "
                                            >
                                                <i
                                                    class="material-icons devices"
                                                >
                                                    dns
                                                </i>
                                                <p class="item-title">
                                                    Devices
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
                                                    isExpandedDevices &&
                                                        selectedDevices.length
                                                "
                                            >
                                                <div
                                                    class="item-content-row"
                                                    v-for="device in selectedDevices"
                                                    :key="device.id"
                                                >
                                                    {{ device.serial_number }}
                                                </div>
                                            </div>
                                            <div
                                                class="review-item-content"
                                                v-else-if="
                                                    isExpandedDevices &&
                                                        !selectedDevices.length
                                                "
                                            >
                                                <div
                                                    class="item-content-row empty"
                                                >
                                                    No devices selected
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                            <div class="modal-footer" v-if="hasStepDataLoaded">
                                <div
                                    class="buttons"
                                    :class="{ 'first-step': activeStep === 1 }"
                                    v-if="activeStep < 5"
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
                                    class="button is-fullwidth is-success has-text-weight-bold create-build"
                                    :class="{ 'is-loading': isLoading }"
                                    @click="createBuild()"
                                    style="border-radius: 3px; font-weight: bold;"
                                    :disabled="getAdminUserCount() === 0"
                                    v-else
                                >
                                    Create Build
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade">
            <SuccessModal
                v-if="showSuccessModal"
                :item="name"
                action="create"
            />
        </transition>
    </div>
</template>

<script>
import search from 'fuzzysearch';
import Spinner from '@src/views/components/Spinner.vue';
import SuccessModal from '../components/SuccessModal.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import * as Builds from '@api/builds.js';
import * as DatacenterRooms from '@api/datacenterRooms.js';
import * as Workspaces from '@api/workspaces.js';
import * as Organizations from '@api/organizations.js';
import * as Racks from '@api/racks.js';
import * as Users from '@api/users.js';

export default {
    components: {
        Spinner,
        SuccessModal,
    },
    data() {
        return {
            activeStep: 1,
            buildId: '',
            creatingBuild: true,
            description: '',
            errors: {
                adminUserCount: false,
                name: false,
            },
            isExpandedDetails: true,
            isExpandedDevices: true,
            isExpandedRacks: true,
            isExpandedMembers: true,
            isLoading: false,
            name: '',
            searchText: '',
            selectedDevices: [],
            selectedMembers: [],
            selectedOrganizations: [],
            selectedRacks: [],
            showRemoveIcon: '',
            showSuccessModal: false,
        };
    },
    methods: {
        ...mapActions([
            'setDatacenterRooms',
            'setDevices',
            'setOrganizations',
            'setRacks',
            'setUsers',
        ]),
        activateStep(step) {
            this.searchText = '';
            this.resetErrors();
            const activeStep = this.activeStep;

            if (activeStep === 1) {
                if (this.name) {
                    this.activeStep = step;
                } else {
                    this.errors.name = true;
                }
            } else if (activeStep === 2) {
                if (this.getAdminUserCount() === 0) {
                    this.errors.adminUserCount = true;
                } else {
                    this.activeStep = step;
                }
            } else {
                this.activeStep = step;
            }
        },
        addItem(item, itemType) {
            if (itemType === 'members') {
                const role = { role: 'ro' };
                const member = Object.assign(item, role);

                this.selectedMembers.push(member);
            } else if (itemType === 'racks') {
                this.selectedRacks.push(item);
            } else if (itemType === 'devices') {
                this.selectedDevices.push(item);
            }
        },
        closeModal() {
            this.creatingBuild = false;

            EventBus.$emit('close-modal:create-build');
        },
        addBuildData() {
            const buildId = this.buildId;

            this.selectedOrganizations.forEach(organization => {
                Builds.addOrganizationToBuild(
                    buildId,
                    organization.id,
                    organization.role,
                );
            });

            this.selectedMembers.forEach(member => {
                Builds.addUserToBuild(buildId, member.id, member.role);
            });

            this.selectedRacks.forEach(rack => {
                Builds.addRackToBuild(buildId, rack.id);
            });

            this.selectedDevices.forEach(device => {
                Builds.addDeviceToBuild(buildId, device.id);
            });
        },
        async createBuild() {
            this.isLoading = true;

            const admins = this.selectedMembers
                .filter(member => member.role === 'admin')
                .map(user => ({ user_id: user.id }));

            await Builds.createBuild(this.name, this.description, admins).then(
                response => {
                    this.buildId = response.data.id;
                }
            );

            await this.addBuildData();

            EventBus.$emit('build-created');

            this.isLoading = false;
            this.showSuccessModal = true;
        },
        filteredItems(itemType) {
            const searchText = this.searchText.toLowerCase();
            let items;

            if (itemType === 'members') {
                items = this.users;
            } else if (itemType === 'racks') {
                items = this.racks;
            } else if (itemType === 'devices') {
                items = this.devices;
            }

            if (searchText) {
                return items.reduce((acc, item) => {
                    let name;

                    if (itemType === 'devices') {
                        name = item.serial_number.toLowerCase();
                    } else {
                        name = item.name.toLowerCase();
                    }

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
        getDatacenterRoom(datacenterRoomId) {
            return this.datacenterRooms.find(datacenterRoom => {
                return datacenterRoom.id === datacenterRoomId;
            }).az;
        },
        getDatacenterRooms() {
            if (this.datacenterRooms && !this.datacenterRooms.length) {
                return new Promise((resolve, reject) => {
                    resolve(
                        DatacenterRooms.getDatacenterRooms().then(response => {
                            this.setDatacenterRooms(response.data);
                        })
                    );
                });
            }
        },
        getDevices() {
            if (this.devices && !this.devices.length) {
                return new Promise((resolve, reject) => {
                    resolve(
                        Workspaces.getDevices(this.currentWorkspace.id).then(
                            response => {
                                this.setDevices(response.data);
                            }
                        )
                    );
                });
            }
        },
        getOrganizations() {
            if (this.organizations && !this.organizations.length) {
                return new Promise((resolve, reject) => {
                    resolve(
                        Organizations.getOrganizations().then(response => {
                            this.setOrganizations(response.data);
                        })
                    );
                });
            }
        },
        getRacks() {
            if (this.racks && !this.racks.length) {
                // Should reject promise errors?
                return new Promise((resolve, reject) => {
                    resolve(
                        Racks.getRacks().then(response => {
                            this.setRacks(response.data);
                        })
                    );
                });
            }
        },
        getUsers() {
            if (this.users && !this.users.length) {
                return new Promise((resolve, reject) => {
                    resolve(
                        Users.getUsers().then(response => {
                            this.setUsers(response.data);
                        })
                    );
                });
            }
        },
        async initializeData() {
            await Promise.all([
                this.getUsers(),
                this.getDevices(),
                this.getRacks(),
                this.getDatacenterRooms(),
            ]);
        },
        isItemSelected(itemId, itemType) {
            const selectedMembers = this.selectedMembers;
            const selectedRacks = this.selectedRacks;
            const selectedDevices = this.selectedDevices;

            if (itemType === 'members' && selectedMembers.length) {
                return selectedMembers.map(user => user.id).indexOf(itemId) !==
                    -1
                    ? true
                    : false;
            } else if (itemType === 'racks' && selectedRacks.length) {
                return selectedRacks.map(rack => rack.id).indexOf(itemId) !== -1
                    ? true
                    : false;
            } else if (itemType === 'devices' && selectedDevices.length) {
                return selectedDevices
                    .map(device => device.id)
                    .indexOf(itemId) !== -1
                    ? true
                    : false;
            }

            return false;
        },
        nextStep() {
            this.searchText = '';
            this.resetErrors();
            const activeStep = this.activeStep;

            if (activeStep === 1) {
                if (this.name) {
                    this.activeStep++;
                } else {
                    this.errors.name = true;
                }
            } else if (activeStep === 2) {
                if (this.getAdminUserCount() === 0) {
                    this.errors.adminUserCount = true;
                } else {
                    this.activeStep++;
                }
            } else {
                this.activeStep++;
            }
        },
        removeItem(itemId, itemType) {
            let index;

            if (itemType === 'members') {
                index = this.selectedMembers
                    .map(member => member.id)
                    .indexOf(itemId);

                this.selectedMembers.splice(index, 1);
            } else if (itemType === 'racks') {
                index = this.selectedRacks.map(rack => rack.id).indexOf(itemId);

                this.selectedRacks.splice(index, 1);
            } else if (itemType === 'devices') {
                index = this.selectedDevices
                    .map(device => device.id)
                    .indexOf(itemId);

                this.selectedDevices.splice(index, 1);
            }
        },
        resetErrors() {
            this.errors = {
                adminUserCount: false,
                name: false,
            };
        },
        updateRole(itemId, event) {
            if (event && event.target && event.target.value) {
                const selectedMembers = this.selectedMembers;

                for (let i = 0; i < selectedMembers.length; i++) {
                    const modifiedUser = selectedMembers[i];

                    if (modifiedUser.id === itemId) {
                        this.selectedMembers[i].role = event.target.value;

                        break;
                    }
                }
            }
        },
    },
    computed: {
        ...mapState([
            'currentWorkspace',
            'datacenterRooms',
            'devices',
            'organizations',
            'racks',
            'users',
        ]),
        currentStepTitle() {
            const activeStep = this.activeStep;

            if (activeStep === 1) {
                return 'Add Details';
            } else if (activeStep === 2) {
                return 'Add Members';
            } else if (activeStep === 3) {
                return 'Add Racks';
            } else if (activeStep === 4) {
                return 'Add Devices';
            }

            return 'Final Review';
        },
        hasStepDataLoaded() {
            const activeStep = this.activeStep;

            if (activeStep === 2 && this.users) {
                return this.users.length > 0;
            } else if (activeStep === 3 && this.racks) {
                return this.racks.length > 0;
            } else if (activeStep === 4 && this.devices) {
                return this.devices.length > 0;
            }

            return true;
        },
    },
    created() {
        this.initializeData();
    },
};
</script>
