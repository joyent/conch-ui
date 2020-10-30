<template>
  <div class="create-build-modal">
    <div class="modal is-active" v-if="creatingBuild && !showSuccessModal">
      <div class="modal-background" @click="closeModal()"></div>
      <div class="modal-content notification">
        <div class="modal-heading">
          <p class="modal-title">
            <template v-if="activeStep === 1">
              Create Build
            </template>
            <template v-else-if="activeStep === 2">
              Add Users to Build
            </template>
            <template v-else-if="activeStep === 3">
              Add Organizations to Build
            </template>
            <template v-else-if="activeStep === 4">
              Add Racks to Build
            </template>
            <template v-else-if="activeStep === 5">
              Add Devices to Build
            </template>
            <template v-else-if="activeStep === 6">
              Review Build Details
            </template>
          </p>
          <i class="material-icons close" @click="closeModal()">
            close
          </i>
        </div>
        <article
          class="message"
          :class="{
            'is-danger': hasItemError || emptyBuildName || emptyAdminUsers,
            'is-success': itemValidated,
          }"
          v-if="
            emptyBuildName || emptyAdminUsers || hasItemError || itemValidated
          "
        >
          <div class="message-header">
            <p v-if="emptyBuildName">
              Build Name is a required field.
            </p>
            <p v-else-if="emptyAdminUsers">
              Builds must have at least one user with admin privileges.
            </p>
            <p v-else-if="itemUnknown">
              Unknown
              <span class="is-capitalized">
                {{ errorItemType }}
              </span>
            </p>
            <p v-else-if="itemDuplicated">
              This {{ errorItemType }} is already being added to the build.
            </p>
            <p v-else-if="itemValidated">
              {{ itemValidated }} will be added to the build.
            </p>
            <button
              class="delete"
              @click="resetErrors()"
              aria-label="delete"
            ></button>
          </div>
        </article>
        <div class="modal-body">
          <div class="step-body" v-if="activeStep === 1">
            <div class="field build-name">
              <label class="label">Name</label>
              <div class="control has-icons-right">
                <input
                  class="input name is-marginless"
                  :class="{ 'is-danger': emptyBuildName }"
                  v-model="name"
                  type="text"
                  placeholder="Build name"
                  @input="resetErrors()"
                />
                <span
                  class="icon is-small is-right has-text-danger"
                  v-if="emptyBuildName"
                >
                  <i class="material-icons">error</i>
                </span>
              </div>
            </div>
            <div class="field build-description">
              <label class="label">Description</label>
              <textarea
                class="textarea has-fixed-size"
                name="description"
                maxlength="165"
                v-model="description"
                placeholder="Build description"
              ></textarea>
            </div>
            <div class="start-date">
              <label class="label">Start Date</label>
              <div class="field has-addons">
                <v-date-picker
                  is-dark
                  v-model="startDate"
                  :attributes="startDatePickerAttrs"
                  :input-props="{
                    class: 'input',
                    placeholder: 'Set start date later',
                    readonly: true,
                  }"
                  :locale="{
                    masks: {
                      dayPopover: 'WWWW, MMMM DD, YYYY',
                      L: 'YYYY/MM/DD',
                    },
                  }"
                  :popover="{
                    placement: 'top-start',
                    visibility: 'click',
                  }"
                />
                <a class="button is-info clear" @click="startDate = null">
                  Clear
                </a>
              </div>
            </div>
          </div>
          <div class="step-body" v-else-if="activeStep === 2">
            <p class="control has-icons-left search">
              <input
                class="input is-marginless"
                v-model="searchText"
                placeholder="Search..."
                type="text"
              />
              <span class="icon is-left">
                <i class="material-icons">search</i>
              </span>
            </p>
            <div class="item-table">
              <table class="table is-fullwidth">
                <tbody>
                  <template v-if="filteredItems('member').length > 0">
                    <tr
                      class="row item"
                      :class="{
                        'is-selected': isItemSelected(user.id, 'member'),
                      }"
                      v-for="user in filteredItems('member')"
                      :key="user.id"
                    >
                      <template v-if="isItemSelected(user.id, 'member')">
                        <td class="item-name">
                          <span class="name has-text-grey-light">
                            {{ user.name }}
                          </span>
                        </td>
                        <td class="role-select">
                          <div class="select role">
                            <select
                              @change="updateRole('member', user.id, $event)"
                            >
                              <option
                                value="admin"
                                :selected="user.role === 'admin'"
                              >
                                Admin
                              </option>
                              <option value="rw" :selected="user.role === 'rw'">
                                Read / Write
                              </option>
                              <option value="ro" :selected="user.role === 'ro'">
                                Read Only
                              </option>
                            </select>
                          </div>
                        </td>
                        <td class="action">
                          <i
                            class="material-icons has-text-success add-item"
                            v-if="showRemoveIcon !== user.id"
                            @mouseover="showRemoveIcon = user.id"
                          >
                            check
                          </i>
                          <i
                            class="material-icons has-text-danger remove-item"
                            v-if="showRemoveIcon === user.id"
                            @click="removeItem(user.id, 'member')"
                            @mouseleave="showRemoveIcon = ''"
                          >
                            close
                          </i>
                        </td>
                      </template>
                      <template v-else>
                        <td class="item-name">
                          <span>{{ user.name }}</span>
                        </td>
                        <td class="action">
                          <i
                            class="material-icons has-text-success add-item"
                            @click="addItem(user, 'member')"
                          >
                            add
                          </i>
                        </td>
                      </template>
                    </tr>
                  </template>
                  <tr
                    class="row item no-results"
                    v-else-if="
                      filteredItems('member').length === 0 && searchText
                    "
                  >
                    <td class="has-text-centered">
                      No search results
                    </td>
                  </tr>
                  <Spinner v-else />
                </tbody>
              </table>
            </div>
          </div>
          <div class="step-body" v-if="activeStep === 3">
            <p class="control has-icons-left search">
              <input
                class="input is-marginless"
                v-model="searchText"
                placeholder="Search..."
                type="text"
              />
              <span class="icon is-left">
                <i class="material-icons">search</i>
              </span>
            </p>
            <div class="item-table">
              <table class="table is-fullwidth">
                <tbody>
                  <template v-if="filteredItems('organization').length > 0">
                    <tr
                      class="row item"
                      :class="{
                        'is-selected': isItemSelected(
                          organization.id,
                          'organization'
                        ),
                      }"
                      v-for="organization in filteredItems('organization')"
                      :key="organization.id"
                    >
                      <template
                        v-if="isItemSelected(organization.id, 'organization')"
                      >
                        <td class="item-name">
                          <span class="name has-text-grey-light">
                            {{ organization.name }}
                          </span>
                        </td>
                        <td class="role-select">
                          <div class="select role">
                            <select
                              @change="
                                updateRole(
                                  'organization',
                                  organization.id,
                                  $event
                                )
                              "
                            >
                              <option
                                value="admin"
                                :selected="organization.role === 'admin'"
                              >
                                Admin
                              </option>
                              <option
                                value="rw"
                                :selected="organization.role === 'rw'"
                              >
                                Read &#47; Write
                              </option>
                              <option
                                value="ro"
                                :selected="organization.role === 'ro'"
                              >
                                Read Only
                              </option>
                            </select>
                          </div>
                        </td>
                        <td class="action">
                          <i
                            class="material-icons has-text-success add-item"
                            v-if="showRemoveIcon !== organization.id"
                            @mouseover="showRemoveIcon = organization.id"
                          >
                            check
                          </i>
                          <i
                            class="material-icons has-text-danger remove-item"
                            v-if="showRemoveIcon === organization.id"
                            @click="removeItem(organization.id, 'organization')"
                            @mouseleave="showRemoveIcon = ''"
                          >
                            close
                          </i>
                        </td>
                      </template>
                      <template v-else>
                        <td class="item-name">
                          <span>
                            {{ organization.name }}
                          </span>
                        </td>
                        <td class="action">
                          <i
                            class="material-icons has-text-success add-item"
                            @click="addItem(organization, 'organization')"
                          >
                            add
                          </i>
                        </td>
                      </template>
                    </tr>
                  </template>
                  <tr
                    class="row item no-results"
                    v-else-if="
                      filteredItems('organization').length === 0 && searchText
                    "
                  >
                    <td class="has-text-centered">
                      No search results
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="step-body" v-if="activeStep === 4">
            <div class="rack-data">
              <div class="rack-name-input">
                <label class="label">Rack Name</label>
                <div
                  class="control"
                  :class="{
                    'has-icons-right': hasItemError,
                  }"
                >
                  <input
                    type="text"
                    class="input rack-name"
                    :class="{ 'is-danger': hasItemError }"
                    placeholder="Enter Rack Name"
                    v-model.trim="rackName"
                    :readonly="setInputReadOnly ? true : false"
                    @blur="inputBlurred()"
                    @input="!rackName ? resetErrors() : null"
                  />
                  <span class="icon is-small is-right" v-if="hasItemError">
                    <i class="material-icons error has-text-danger">
                      error
                    </i>
                  </span>
                </div>
              </div>
              <div class="datacenter-room-input">
                <label class="label">Datacenter Room</label>
                <div class="select">
                  <select v-model="datacenterRoom">
                    <option disabled selected :value="''">
                      Select a Datacenter Room
                    </option>
                    <option
                      v-for="room in sortedDatacenterRooms"
                      :key="room.id"
                      :value="room.az"
                    >
                      {{ room.az }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <a
              class="button is-success validate-rack"
              :class="{ 'is-loading': isLoading }"
              @click="validateRack()"
            >
              Validate Rack
            </a>
            <div class="review-item racks">
              <div class="review-item-title">
                <i class="material-icons details">storage</i>
                <p class="item-title">Validated Racks</p>
              </div>
              <div class="review-item-content">
                <template v-if="selectedRacks.length">
                  <div
                    class="item-content-row"
                    v-for="rack in selectedRacks"
                    :key="rack.id"
                  >
                    <p class="rack-name">
                      {{ rack.name }}
                    </p>
                    <p class="datacenter-room has-text-grey">
                      {{ getDatacenterRoomById(rack.datacenter_room_id) }}
                    </p>
                  </div>
                </template>
                <div class="item-content-row empty-selection" v-else>
                  <p>
                    Validated Racks will be displayed here.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="step-body" v-if="activeStep === 5">
            <div class="device-data">
              <label class="label">
                Device Serial Number
              </label>
              <div
                class="control"
                :class="{
                  'has-icons-right': hasItemError,
                }"
              >
                <input
                  type="text"
                  class="input device-serial-number"
                  :class="{ 'is-danger': hasItemError }"
                  placeholder="Enter Device Serial Number"
                  v-model.trim="serialNumber"
                  :readonly="setInputReadOnly ? true : false"
                  @blur="inputBlurred()"
                  @input="!serialNumber ? resetErrors() : null"
                />
                <span class="icon is-small is-right" v-if="hasItemError">
                  <i class="material-icons error has-text-danger">
                    error
                  </i>
                </span>
              </div>
            </div>
            <a
              class="button is-success validate-device"
              :class="{ 'is-loading': isLoading }"
              @click="validateDevice()"
            >
              Validate Device
            </a>
            <div class="review-item devices">
              <div class="review-item-title">
                <i class="material-icons details">dns</i>
                <p class="item-title">Validated Devices</p>
              </div>
              <div class="review-item-content">
                <template v-if="selectedDevices.length">
                  <div
                    class="item-content-row"
                    v-for="device in selectedDevices"
                    :key="device.id"
                  >
                    <p class="rack-name">
                      {{ device.serial_number }}
                    </p>
                  </div>
                </template>
                <div class="item-content-row empty-selection" v-else>
                  <p>
                    Validated Devices will be displayed here.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="step-body review" v-else-if="activeStep === 6">
            <div class="review-item details">
              <div
                class="review-item-title"
                :class="{ 'is-expanded': isExpandedDetails }"
                @click="isExpandedDetails = !isExpandedDetails"
              >
                <i class="material-icons details">subject</i>
                <p class="item-title">Details</p>
                <i class="material-icons chevron">
                  chevron_right
                </i>
              </div>
              <div class="review-item-content" v-if="isExpandedDetails">
                <div class="item-content-row">
                  {{ name }}
                </div>
                <div class="item-content-row">
                  <span v-if="description">
                    {{ description }}
                  </span>
                  <span class="has-text-grey" v-else>
                    No description provided
                  </span>
                </div>
              </div>
            </div>
            <div class="review-item members">
              <div
                class="review-item-title"
                :class="{ 'is-expanded': isExpandedMembers }"
                @click="isExpandedMembers = !isExpandedMembers"
              >
                <i class="material-icons members">group</i>
                <p class="item-title">Members</p>
                <i class="material-icons chevron">
                  chevron_right
                </i>
              </div>
              <div
                class="review-item-content"
                v-if="isExpandedMembers && selectedMembers.length"
              >
                <div
                  class="item-content-row"
                  v-for="member in selectedMembers"
                  :key="member.id"
                >
                  {{ member.email }}
                </div>
              </div>
              <div
                class="review-item-content"
                v-else-if="isExpandedMembers && !selectedMembers.length"
              >
                <div class="item-content-row empty-review">
                  No members selected
                </div>
              </div>
            </div>
            <div class="review-item organizations">
              <div
                class="review-item-title"
                :class="{
                  'is-expanded': isExpandedOrganizations,
                }"
                @click="isExpandedOrganizations = !isExpandedOrganizations"
              >
                <i class="material-icons members">
                  recent_actors
                </i>
                <p class="item-title">Organizations</p>
                <i class="material-icons chevron">
                  chevron_right
                </i>
              </div>
              <div
                class="review-item-content"
                v-if="isExpandedOrganizations && selectedOrganizations.length"
              >
                <div
                  class="item-content-row"
                  v-for="organization in selectedOrganizations"
                  :key="organization.id"
                >
                  {{ organization.name }}
                </div>
              </div>
              <div
                class="review-item-content"
                v-else-if="
                  isExpandedOrganizations && !isExpandedOrganizations.length
                "
              >
                <div class="item-content-row empty-review">
                  No organizations selected
                </div>
              </div>
            </div>
            <div class="review-item racks">
              <div
                class="review-item-title"
                :class="{ 'is-expanded': isExpandedRacks }"
                @click="isExpandedRacks = !isExpandedRacks"
              >
                <i class="material-icons members">storage</i>
                <p class="item-title">Racks</p>
                <i class="material-icons chevron">
                  chevron_right
                </i>
              </div>
              <div
                class="review-item-content"
                v-if="isExpandedRacks && selectedRacks.length"
              >
                <div
                  class="item-content-row"
                  v-for="rack in selectedRacks"
                  :key="rack.id"
                >
                  <p class="rack-name">
                    {{ rack.name }}
                  </p>
                  <p class="datacenter-room has-text-grey">
                    {{ getDatacenterRoomById(rack.datacenter_room_id) }}
                  </p>
                </div>
              </div>
              <div
                class="review-item-content"
                v-else-if="isExpandedRacks && !selectedRacks.length"
              >
                <div class="item-content-row empty-review">
                  No racks selected
                </div>
              </div>
            </div>
            <div class="review-item devices">
              <div
                class="review-item-title"
                :class="{ 'is-expanded': isExpandedDevices }"
                @click="isExpandedDevices = !isExpandedDevices"
              >
                <i class="material-icons members">dns</i>
                <p class="item-title">Devices</p>
                <i class="material-icons chevron">
                  chevron_right
                </i>
              </div>
              <div
                class="review-item-content"
                v-if="isExpandedDevices && selectedDevices.length"
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
                v-else-if="isExpandedDevices && !isExpandedDevices.length"
              >
                <div class="item-content-row empty-review">
                  No devices selected
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer" v-if="hasStepDataLoaded">
          <div
            class="buttons"
            :class="{ 'first-step': activeStep === 1 }"
            v-if="activeStep < 6"
          >
            <a
              class="button previous is-link is-marginless"
              @click="previousStep()"
              v-if="activeStep !== 1"
            >
              <i class="material-icons">arrow_back</i>
              Previous
            </a>
            <a class="button next is-info is-marginless" @click="nextStep()">
              Next
              <i class="material-icons">arrow_forward</i>
            </a>
          </div>
          <a
            class="button is-fullwidth is-success create-build"
            :class="{ 'is-loading': isLoading }"
            @click="createBuild()"
            :disabled="getAdminUserCount() === 0"
            v-else
          >
            Create Build
          </a>
        </div>
      </div>
    </div>
    <transition name="fade">
      <SuccessModal v-if="showSuccessModal" :item="name" action="create" />
    </transition>
  </div>
</template>

<script>
import Vue from 'vue';
import moment from 'moment';
import search from 'fuzzysearch';
import sortBy from 'lodash/sortBy';
import SuccessModal from '@src/views/components/SuccessModal.vue';
import Spinner from '@src/views/components/Spinner.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import * as Builds from '@api/builds.js';
import {
  getDatacenterRoomRack,
  getDatacenterRooms,
} from '@api/datacenterRooms.js';
import { getOrganizations } from '@api/organizations.js';
import { getUsers } from '@api/users.js';
import { getDeviceDetails } from '@api/devices.js';

import { setupCalendar, DatePicker } from 'v-calendar';
setupCalendar(Vue);

export default {
  components: {
    Spinner,
    SuccessModal,
    'v-date-picker': DatePicker,
  },
  data() {
    return {
      activeStep: 1,
      buildId: '',
      creatingBuild: true,
      datacenterRoom: '',
      description: '',
      emptyAdminUsers: false,
      emptyBuildName: false,
      errorItemType: '',
      isExpandedDetails: true,
      isExpandedDevices: true,
      isExpandedMembers: true,
      isExpandedOrganizations: true,
      isExpandedRacks: true,
      isItemValidated: false,
      isLoading: false,
      itemDuplicated: false,
      itemUnknown: false,
      itemValidated: '',
      name: '',
      rackName: '',
      searchText: '',
      selectedDevices: [],
      selectedMembers: [],
      selectedOrganizations: [],
      selectedRacks: [],
      serialNumber: '',
      setInputReadOnly: false,
      showRemoveIcon: '',
      showSuccessModal: false,
      startDate: new Date(),
      startDatePickerAttrs: [
        {
          key: 'today',
          highlight: true,
          dates: new Date(),
          popover: {
            label: `Today's date`,
            dot: true,
            hideIndicator: false,
          },
        },
      ],
    };
  },
  methods: {
    ...mapActions(['setDatacenterRooms', 'setOrganizations', 'setUsers']),
    activateStep(step) {
      this.searchText = '';
      this.resetErrors();
      const activeStep = this.activeStep;

      if (activeStep === 1) {
        if (this.name) {
          this.activeStep = step;
        } else {
          this.emptyBuildName = true;
        }
      } else if (activeStep === 2) {
        if (this.getAdminUserCount() === 0) {
          this.emptyAdminUsers = true;
        } else {
          this.activeStep = step;
        }
      } else {
        this.activeStep = step;
      }
    },
    addBuildData() {
      const buildId = this.buildId;

      this.selectedMembers.forEach(member => {
        Builds.addUserToBuild(buildId, member.id, member.role);
      });

      this.selectedOrganizations.forEach(organization => {
        Builds.addOrganizationToBuild(
          buildId,
          organization.id,
          organization.role
        );
      });

      this.selectedRacks.forEach(rack => {
        Builds.addRackToBuild(buildId, rack.id);
      });

      this.selectedDevices.forEach(device => {
        Builds.addDeviceToBuild(buildId, device.id);
      });
    },
    addItem(item, itemType) {
      const itemWithPermissions = Object.assign(item, { role: 'ro' });

      if (itemType === 'member') {
        this.selectedMembers.push(itemWithPermissions);
      } else if (itemType === 'organization') {
        this.selectedOrganizations.push(itemWithPermissions);
      }
    },
    closeModal() {
      this.creatingBuild = false;

      EventBus.$emit('close-modal:create-build');
    },
    async createBuild() {
      this.isLoading = true;

      const admins = this.selectedMembers
        .filter(member => member.role === 'admin')
        .map(user => ({ user_id: user.id }));

      await Builds.createBuild(
        this.name,
        this.description,
        admins,
        this.startDate
      ).then(response => {
        this.buildId = response.data.id;
      });

      this.addBuildData();

      EventBus.$emit('build-created');

      this.isLoading = false;
      this.showSuccessModal = true;
    },
    filteredItems(itemType) {
      const searchText = this.searchText.toLowerCase();
      let items;

      if (itemType === 'member') {
        items = this.users;
      } else if (itemType === 'organization') {
        items = this.organizations;
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
      return this.selectedMembers.filter(member => member.role === 'admin')
        .length;
    },
    getDatacenterRoomById(datacenterRoomId) {
      return this.datacenterRooms.find(datacenterRoom => {
        return datacenterRoom.id === datacenterRoomId;
      }).az;
    },
    getDatacenterRoomByAz(datacenterRoomAz) {
      return this.datacenterRooms.find(datacenterRoom => {
        return datacenterRoom.az === datacenterRoomAz;
      }).id;
    },
    getDate(date) {
      return moment(date).format('YYYY/MM/DD');
    },
    initializeData() {
      if (!this.organizations.length) {
        getOrganizations().then(response => {
          this.setOrganizations(response.data);
        });
      }

      if (!this.users.length) {
        getUsers().then(response => {
          this.setUsers(response.data);
        });
      }

      if (!this.datacenterRooms.length) {
        getDatacenterRooms().then(response => {
          this.setDatacenterRooms(response.data);
        });
      }
    },
    inputBlurred() {
      if (!this.rackName) {
        this.resetErrors();
      }
    },
    isItemSelected(itemId, itemType) {
      if (itemType === 'organization') {
        const selectedOrganizations = this.selectedOrganizations;

        if (selectedOrganizations.length) {
          return selectedOrganizations
            .map(organization => organization.id)
            .indexOf(itemId) !== -1
            ? true
            : false;
        }
      } else if (itemType === 'member') {
        const selectedMembers = this.selectedMembers;

        if (selectedMembers.length) {
          return selectedMembers.map(member => member.id).indexOf(itemId) !== -1
            ? true
            : false;
        }
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
          this.emptyBuildName = true;
        }
      } else if (activeStep === 2) {
        if (this.getAdminUserCount() === 0) {
          this.emptyAdminUsers = true;
        } else {
          this.activeStep++;
        }
      } else {
        this.activeStep++;
      }
    },
    previousStep() {
      this.resetErrors();
      this.activeStep--;
    },
    removeItem(itemId, itemType) {
      let index;

      if (itemType === 'organization') {
        index = this.selectedOrganizations
          .map(organization => organization.id)
          .indexOf(itemId);

        this.selectedOrganizations.splice(index, 1);
      } else if (itemType === 'member') {
        index = this.selectedMembers.map(member => member.id).indexOf(itemId);

        this.selectedMembers.splice(index, 1);
      }
    },
    resetErrors() {
      this.emptyAdminUsers = false;
      this.emptyBuildName = false;
      this.errorItemType = '';
      this.itemDuplicated = false;
      this.itemUnknown = false;
    },
    updateRole(itemType, itemId, event) {
      if (event && event.target && event.target.value) {
        if (itemType === 'organization') {
          const selectedOrganizations = this.selectedOrganizations;

          for (let i = 0; i < selectedOrganizations.length; i++) {
            const modifiedOrganization = selectedOrganizations[i];

            if (modifiedOrganization.id === itemId) {
              this.selectedOrganizations[i].role = event.target.value;

              break;
            }
          }
        } else if (itemType === 'member') {
          const selectedMembers = this.selectedMembers;

          for (let i = 0; i < selectedMembers.length; i++) {
            const modifiedUser = selectedMembers[i];

            if (modifiedUser.id === itemId) {
              this.selectedMembers[i].role = event.target.value;

              break;
            }
          }
        }
      }
    },
    validateDevice() {
      const serialNumber = this.serialNumber;

      if (serialNumber) {
        this.isLoading = true;

        this.resetErrors();

        const duplicateDevice =
          this.selectedDevices
            .map(device => device.serial_number)
            .indexOf(serialNumber) !== -1;

        if (duplicateDevice) {
          this.isLoading = false;
          this.errorItemType = 'device';
          this.itemDuplicated = true;

          return;
        }

        getDeviceDetails(serialNumber)
          .then(response => {
            this.selectedDevices.push(response.data);
            this.isLoading = false;
            this.itemValidated = this.serialNumber;
            this.serialNumber = '';
            this.isItemValidated = true;

            setTimeout(() => {
              this.isItemValidated = false;
              this.itemValidated = '';
            }, 2500);
          })
          .catch(error => {
            if (error.status === 404) {
              this.isLoading = false;
              this.errorItemType = 'device';
              this.itemUnknown = true;
            }
          });
      }
    },
    validateRack() {
      const rackName = this.rackName;

      if (rackName) {
        this.isLoading = true;

        this.resetErrors();

        const duplicateDevice =
          this.selectedRacks.map(rack => rack.id).indexOf(rackName) !== -1;

        if (duplicateDevice) {
          this.isLoading = false;
          this.errorItemType = 'rack';
          this.itemDuplicated = true;

          return;
        }

        const datacenterRoomId = this.getDatacenterRoomById(
          this.datacenterRoom
        );

        getDatacenterRoomRack(datacenterRoomId, rackName)
          .then(response => {
            this.selectedRacks.push(response.data);
            this.isLoading = false;
            this.itemValidated = response.data.name;
            this.rackName = '';
            this.isItemValidated = true;

            setTimeout(() => {
              this.isItemValidated = false;
              this.itemValidated = '';
            }, 2500);
          })
          .catch(error => {
            if (error.status === 404) {
              this.isLoading = false;
              this.errorItemType = 'rack';
              this.itemUnknown = true;
            }
          });
      }
    },
  },
  computed: {
    ...mapState(['datacenterRooms', 'organizations', 'users']),
    hasItemError() {
      return this.itemDuplicated || this.itemUnknown;
    },
    hasStepDataLoaded() {
      const activeStep = this.activeStep;

      if (activeStep === 2 && this.users) {
        return this.users.length > 0;
      }

      return true;
    },
    sortedDatacenterRooms() {
      if (this.datacenterRooms && this.datacenterRooms.length) {
        const rooms = this.datacenterRooms;

        return sortBy(rooms, room => room.az);
      }

      return [];
    },
  },
  created() {
    this.initializeData();
  },
};
</script>
