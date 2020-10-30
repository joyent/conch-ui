<template>
  <div
    class="add-rack-modal modal"
    :class="{ 'is-active': isActive }"
    v-if="!isSuccess"
  >
    <div class="modal-background" @click="closeModal()"></div>
    <div class="modal-content notification">
      <div class="content-header">
        <p class="title has-text-weight-bold is-5">
          <span>Add Rack to Build</span>
        </p>
        <i class="material-icons close" @click="closeModal()">close</i>
      </div>
      <article class="message is-danger" v-if="rackUnknown && showError">
        <div class="message-header">
          <p>
            <span class="has-text-white has-text-weight-bold">
              {{ datacenterRoom.az }}
            </span>
            does not have rack
            <span class="has-text-white has-text-weight-bold">
              {{ submittedName }}
            </span>
          </p>
          <button class="delete" @click="showError = false"></button>
        </div>
      </article>
      <div class="content-body">
        <label class="label">Rack Name</label>
        <div class="control has-icons-right">
          <input
            type="text"
            class="input"
            :class="{
              'is-danger': rackUnknown,
              'is-loading': isLoading,
              'is-warning': rackDuplicated,
            }"
            placeholder="Enter Rack Name"
            v-model="name"
            @input="!name && hasError ? resetErrors() : null"
          />
          <span class="icon is-small is-right">
            <i
              class="material-icons error"
              :class="{
                'has-text-danger': rackUnknown,
                'has-text-warning': rackDuplicated,
              }"
              v-if="hasError"
            >
              error
            </i>
          </span>
        </div>
        <label class="label">Datacenter Room</label>
        <div class="select is-fullwidth datacenter-room">
          <select v-model="datacenterRoom">
            <option disabled selected :value="{}">
              Select Datacenter Room
            </option>
            <option
              v-for="(room, i) in sortedDatacenterRooms"
              :key="room.id"
              :value="room"
              :selected="i === 0 ? 'selected' : ''"
            >
              {{ room.az }}
            </option>
          </select>
        </div>
      </div>
      <div class="content-footer">
        <div class="buttons">
          <a class="button is-link" @click="closeModal()">
            <span v-if="isSuccess">Close</span>
            <span v-else>Cancel</span>
          </a>
          <a
            class="button is-success"
            :class="{ 'is-loading': isLoading }"
            @click="addRack()"
            :disabled="hasRequiredInput ? false : true"
          >
            Add Rack
          </a>
        </div>
      </div>
    </div>
  </div>
  <SuccessModal v-else :item="name" action="add" />
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import SuccessModal from '@src/views/components/SuccessModal.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import { addRackToBuild } from '@api/builds.js';
import {
  getDatacenterRoomRack,
  getDatacenterRooms,
} from '@api/datacenterRooms.js';

export default {
  components: {
    SuccessModal,
  },
  data() {
    return {
      datacenterRoom: {},
      isActive: true,
      isLoading: false,
      isSuccess: false,
      name: '',
      rackDuplicated: false,
      rackUnknown: false,
      showError: false,
      submittedName: '',
    };
  },
  methods: {
    ...mapActions(['setDatacenterRooms']),
    addRack() {
      if (this.hasRequiredInput) {
        this.isLoading = true;

        getDatacenterRoomRack(this.datacenterRoom.id, name)
          .then(response => {
            const rackId = response.data.id;

            addRackToBuild(this.currentBuild.id, rackId).then(() => {
              this.isSuccess = true;
              this.isLoading = false;

              EventBus.$emit('rack-added');
            });
          })
          .catch(() => {
            this.showError = true;
            this.rackUnknown = true;
            this.isLoading = false;
          });
      }
    },
    closeModal() {
      this.isActive = false;
      this.isSuccess = false;

      EventBus.$emit('close-modal:add-item');
    },
    resetErrors() {
      this.rackDuplicated = false;
      this.rackUnknown = false;
    },
  },
  computed: {
    ...mapState(['currentBuild', 'datacenterRooms']),
    hasRequiredInput() {
      return this.name && !isEmpty(this.datacenterRoom);
    },
    hasError() {
      return this.rackDuplicated || this.rackUnknown;
    },
    sortedDatacenterRooms() {
      const rooms = this.datacenterRooms;

      if (rooms.length) {
        return sortBy(rooms, room => room.az);
      }

      return [];
    },
  },
  created() {
    if (!this.datacenterRooms.length) {
      getDatacenterRooms().then(response => {
        this.setDatacenterRooms(response.data);
      });
    }
  },
};
</script>
