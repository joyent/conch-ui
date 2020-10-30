<template>
  <div class="data-center-devices-tab">
    <spinner v-if="fetchingData"></spinner>
    <div v-else class="columns">
      <div class="column">
        <div class="is-paddingless">
          <div class="datatable-header">
            <span class="heading is-size-6 is-marginless">
              {{ `Devices (${filteredDevices.length})` }}
            </span>
            <div class="control has-icons-left has-icons-right">
              <input
                type="text"
                class="input search"
                v-model="searchText"
                placeholder="Search..."
              />
              <span class="icon is-small is-left">
                <i class="material-icons search">search</i>
              </span>
            </div>
            <a class="button is-info" @click="showUpdatePhaseModal = true"
              >Update Rack Phase</a
            >
            <a class="button is-info" @click="showEditLayoutModal = true"
              >Edit Assignments</a
            >
          </div>
          <table
            class="table is-hoverable is-fullwidth"
            v-if="filteredDevices && filteredDevices.length > 0"
          >
            <thead>
              <th v-for="header in headers" :key="header">
                <a class="table-header-filter is-capitalized" @click="sort()">
                  {{ header }}
                </a>
              </th>
            </thead>
            <tfoot v-if="filteredDevices.length > 10">
              <th
                class="is-capitalized"
                v-for="header in headers"
                :key="header"
              >
                {{ header }}
              </th>
            </tfoot>
            <tbody>
              <tr
                class="row"
                v-for="device in filteredDevices"
                :key="device.id"
                @click="navigateToDevice(device)"
                style="cursor: pointer;"
              >
                <td class="rack-unit">
                  <span>{{ `${device.rack_unit_start || 'N/A'}` }}</span>
                </td>
                <td class="asset-tag">
                  <span>{{ `${device.device_asset_tag || 'N/A'}` }}</span>
                </td>
                <td class="serial-number">
                  {{ device.device_serial_number }}
                </td>
                <td class="sku">
                  {{ device.sku }}
                </td>
                <td class="hardware-product">
                  {{ device.hardware_product_name }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="no-results" v-else>
            <p class="subtitle has-text-centered">
              No Results to Display
            </p>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      // What does normalizedSlots look like?
      <edit-layout-modal
        v-if="showEditLayoutModal"
        :layout-devices="editLayoutModalDevices"
        @close-modal="showEditLayoutModal = false"
      ></edit-layout-modal>
    </transition>
    <transition name="fade">
      // What does rackLayout look like?
      <phase-update-modal
        v-if="showUpdatePhaseModal"
        :item="'rack'"
        :item-data="currentDataCenterRack"
        @close-modal="showUpdatePhaseModal = false"
      ></phase-update-modal>
    </transition>
  </div>
</template>

<script>
import { EventBus } from '@src/eventBus.js';
import search from 'fuzzysearch';
import orderBy from 'lodash/orderBy';
import PhaseUpdateModal from '../components/PhaseUpdateModal.vue';
import EditLayoutModal from './EditLayoutModal.vue';
import Spinner from '../components/Spinner.vue';
import { mapActions, mapState } from 'vuex';
import { getRackAssignment } from '@api/racks.js';

export default {
  components: {
    EditLayoutModal,
    PhaseUpdateModal,
    Spinner,
  },
  data() {
    return {
      devices: [],
      editLayoutModalDevices: [],
      fetchingData: true,
      headers: [
        'slot',
        'asset tag',
        'serial number',
        'SKU',
        'hardware product',
      ],
      searchText: '',
      showEditLayoutModal: false,
      showUpdatePhaseModal: false,
    };
  },
  methods: {
    ...mapActions(['setActiveDeviceDetails']),
    async fetchData() {
      if (!this.devices || this.devices.length === 0) {
        const dataCenterRackLayoutResponse = await getRackAssignment(
          this.$route.query.rack
        );
        const devices = dataCenterRackLayoutResponse.data;
        this.devices = devices;

        this.editLayoutModalDevices = devices.map(device => ({
          asset_tag: device.device_asset_tag,
          hardware_product_name: device.hardware_product_name,
          original_asset_tag: device.device_asset_tag,
          original_serial_number: device.device_serial_number,
          rack_unit_start: device.rack_unit_start,
          serial_number: device.device_serial_number || '',
          slot: device.rack_unit_start,
        }));
      }

      this.fetchingData = false;
    },
    navigateToDevice(device) {
      this.setActiveDeviceDetails(device);
      this.$router.push({
        name: 'device',
        params: { deviceId: device.device_id },
      });
    },
  },
  computed: {
    ...mapState(['currentDataCenter', 'currentDataCenterRack']),
    filteredDevices() {
      let devices = this.devices;

      if (this.searchText) {
        const searchText = this.searchText.toLowerCase();

        devices = devices.reduce((acc, device) => {
          if (
            device.device_asset_tag &&
            search(searchText, device.device_asset_tag.toLowerCase())
          ) {
            acc.push(device);
          } else if (
            device.hardware_product_name &&
            search(searchText, device.hardware_product_name.toLowerCase())
          ) {
            acc.push(device);
          } else if (
            device.device_serial_number &&
            search(searchText, device.device_serial_number.toLowerCase())
          ) {
            acc.push(device);
          } else if (
            device.sku &&
            search(searchText, device.sku.toLowerCase())
          ) {
            acc.push(device);
          }

          return acc;
        }, []);
      }

      devices = orderBy(devices, ['rack_unit_start'], ['desc']);

      return devices;
    },
  },
  created() {
    this.fetchData();

    EventBus.$on('closeModal:baseModal', () => {
      this.showUpdatePhaseModal = false;
    });
  },
};
</script>
