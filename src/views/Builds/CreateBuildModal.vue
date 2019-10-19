<template>
    <div class="create-build-modal">
        <div class="modal" :class="{ 'is-active': isActive }">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-content notification columns">
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
                                    <div class="control has-icons-right">
                                        <input
                                            type="text"
                                            class="input name is-marginless"
                                            :class="{
                                                'is-danger': errors.name,
                                            }"
                                            v-model="name"
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
                            <div class="step-body" v-else-if="activeStep === 2">
                                <template
                                    v-if="filteredItems('members').length > 0"
                                >
                                    <div class="search">
                                        <div class="control has-icons-left">
                                            <input
                                                type="text"
                                                class="input is-marginless"
                                                placeholder="Search..."
                                                v-model="searchText"
                                            />
                                            <span class="icon is-left">
                                                <i class="material-icons">
                                                    search
                                                </i>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="item-table">
                                        <table class="table is-fullwidth">
                                            <tbody>
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
                                                        v-if="isItemSelected(user.name, 'members')"
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
                                                        <td class="action">
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
                                                                @click="removeItem(user.name, 'members')"
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
                                            </tbody>
                                        </table>
                                    </div>
                                </template>
                                <Spinner v-else />
                            </div>
                            <div class="step-body" v-else-if="activeStep === 3">
                                <template
                                    v-if="filteredItems('racks').length > 0"
                                >
                                    <div class="search">
                                        <div class="control has-icons-left">
                                            <input
                                                type="text"
                                                class="input is-marginless"
                                                placeholder="Search..."
                                                v-model="searchText"
                                            />
                                            <span class="icon is-left">
                                                <i class="material-icons">
                                                    search
                                                </i>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="item-table">
                                        <div class="table is-fullwidth">
                                            <tbody>
                                                <tr
                                                    class="row item"
                                                    :class="{
                                                        'is-selected': isItemSelected(
                                                            rack.name,
                                                            'racks'
                                                        ),
                                                    }"
                                                    v-for="rack in filteredItems(
                                                        'racks'
                                                    )"
                                                    :key="rack.id"
                                                >
                                                    <template
                                                        v-if="isItemSelected(rack.name, 'racks')"
                                                    >
                                                        <td class="item-name">
                                                            <span class="name has-text-grey-light">
                                                                {{ rack.name }}
                                                            </span>
                                                        </td>
                                                        <td class="action">
                                                            <i
                                                                class="material-icons has-text-success add-item"
                                                                v-if="showRemoveIcon !== rack.name"
                                                                @mouseover="showRemoveIcon = rack.name"
                                                            >
                                                                check
                                                            </i>
                                                            <i
                                                                class="material-icons has-text-danger remove-item"
                                                                v-if="showRemoveIcon === rack.name"
                                                                @click="removeItem(rack.name, 'racks')"
                                                                @mouseleave="showRemoveIcon == ''"
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
                                            </tbody>
                                        </div>
                                    </div>
                                </template>
                                <Spinner v-else />
                            </div>
                            <div class="step-body" v-else-if="activeStep === 4">
                                <template
                                    v-if="filteredItems('devices').length > 0"
                                >
                                    <div class="search">
                                        <div class="control has-icons-left">
                                            <input
                                                type="text"
                                                class="input is-marginless"
                                                placeholder="Search..."
                                                v-model="searchText"
                                            />
                                            <span class="icon is-left">
                                                <i class="material-icons">
                                                    search
                                                </i>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="item-table">
                                        <div class="table is-fullwidth">
                                            <tbody>
                                                <tr
                                                    class="row item"
                                                    :class="{
                                                        'is-selected': isItemSelected(
                                                            device.serial_number,
                                                            'devices'
                                                        ),
                                                    }"
                                                    v-for="device in filteredItems(
                                                        'devices'
                                                    )"
                                                    :key="device.id"
                                                >
                                                    <template v-if="isItemSelected(device.serial_number, 'devices')">
                                                        <td class="item-name">
                                                            <span class="name has-text-grey-light">
                                                                {{ device.serial_number }}
                                                            </span>
                                                        </td>
                                                        <td class="action">
                                                            <i
                                                                class="material-icons has-text-success add-item"
                                                                v-if="showRemoveIcon !== device.serial_number"
                                                                @mouseover="showRemoveIcon = device.serial_number"
                                                            >
                                                                check
                                                            </i>
                                                            <i
                                                                class="material-icons has-text-danger remove-item"
                                                                v-if="showRemoveIcon === device.serial_number"
                                                                @click="removeItem(device.serial_number, 'devices')"
                                                                @mouseleave="showRemoveIcon == ''"
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
                                            </tbody>
                                        </div>
                                    </div>
                                </template>
                                <Spinner v-else />
                            </div>
                            <!-- <div
                                class="step-body"
                                v-else-if="activeStep === 5"
                            >

                            </div> -->
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
                            <a class="button next is-info" @click="nextStep()">
                                Next
                            </a>
                        </div>
                        <a
                            class="button is-fullwidth is-success has-text-weight-bold"
                            :class="{ 'is-loading': isLoading }"
                            @click="createBuild()"
                            style="border-radius: 3px;"
                            v-else
                        >
                            Create Build
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import search from 'fuzzysearch';
import Spinner from '@src/views/components/Spinner.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import { getUsers } from '@api/users.js';
import { getDevices } from '@api/workspaces.js';
import * as Builds from '@api/builds.js';

export default {
    components: {
        Spinner,
    },
    data() {
        return {
            activeStep: 1,
            buildId: '',
            description: '',
            errors: {
                adminUsersCount: false,
                name: false,
            },
            isActive: true,
            isLoading: false,
            isSuccessful: false,
            name: '',
            racks: [
                {
                    id: '1a',
                    name: 'Racks Racks Racks!',
                }
            ],
            searchText: '',
            selectedDevices: [],
            selectedMembers: [],
            selectedRacks: [],
            showRemoveIcon: '',
        };
    },
    methods: {
        ...mapActions(['setDevices', 'setUsers']),
        activateStep(step) {
            this.searchText = '';
            const activeStep = this.activeStep;

            if (activeStep === 1) {
                if (this.name) {
                    this.resetErrors();
                    this.activeStep = step;
                }
            } else {
                this.resetErrors();
                this.activeStep = step;
            }
        },
        addItem(item, itemType) {
            if (itemType === 'members') {
                this.selectedMembers.push(item);
            } else if (itemType === 'racks') {
                this.selectedRacks.push(item);
            } else if (itemType === 'devices') {
                this.selectedDevices.push(item);
            }
        },
        closeModal() {
            this.isActive = false;

            EventBus.$emit('close-modal:add-organization');
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

            EventBus.$emit('build-created');

            this.isLoading = false;
            this.isSuccessful = true;
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
        isItemSelected(itemName, itemType) {
            const selectedMembers = this.selectedMembers;
            const selectedRacks = this.selectedRacks;
            const selectedDevices = this.selectedDevices;

            if (itemType === 'members' && selectedMembers.length) {
                return selectedMembers
                    .map(user => user.name)
                    .indexOf(itemName) !== -1
                    ? true
                    : false;
            } else if (itemType === 'racks' && selectedRacks.length) {
                return selectedRacks
                    .map(rack => rack.name)
                    .indexOf(itemName) !== -1
                    ? true
                    : false;
            } else if (itemType === 'devices' && selectedDevices.length) {
                return selectedDevices
                    .map(device => device.serial_number)
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
            } else if (itemType === 'racks') {
                index = this.selectedRacks
                    .map(rack => rack.name)
                    .indexOf(itemName);

                this.selectedRacks.splice(index, 1);
            } else if (itemType === 'devices') {
                index = this.selectedDevices
                    .map(device => device.serial_number)
                    .indexOf(itemName);

                this.selectedDevices.splice(index, 1);
            }
        },
        resetErrors() {
            this.errors = {
                adminUsersCount: false,
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
        ...mapState(['currentWorkspace', 'devices', 'users']),
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
        if (!this.users.length) {
            getUsers().then(response => {
                this.setUsers(response.data);
            });
        }

        if (!this.devices.length) {
            getDevices(this.currentWorkspace.id).then(response => {
                console.log(response)
                this.setDevices(response.data);
            });
        }
    },
};
</script>
