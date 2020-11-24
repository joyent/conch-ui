<template>
  <div class="devices-tab">
    <div
      class="custom-tags"
      v-if="rack && rack.name"
      style="margin-bottom: 15px; margin-top: -10px;"
    >
      <label class="tag-label">Rack</label>
      <div class="tag-value">
        {{ rack.name }}
      </div>
      <a class="button is-text" style="margin-left: 5px" @click="clearRack()"
        >Clear Rack</a
      >
    </div>
    <spinner v-if="fetchingData"></spinner>
    <div v-else class="columns">
      <div class="column">
        <div class="devices-table is-paddingless">
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
            <div class="select-with-label health">
              <label class="select-label">Health</label>
              <div class="select device-health">
                <select
                  v-model="deviceHealthFilter"
                  class="is-capitalized"
                  @change="changeFilter($event, 'health')"
                >
                  <option value="all">All</option>
                  <option
                    v-for="state in healthStates"
                    :key="state"
                    :value="state"
                  >
                    {{ state }}
                  </option>
                </select>
              </div>
            </div>
            <div class="select-with-label phase">
              <label class="select-label">Phase</label>
              <div class="select device-phase">
                <select
                  v-model="devicePhaseFilter"
                  class="is-capitalized"
                  @change="changeFilter($event, 'phase')"
                >
                  <option value="all">All</option>
                  <option v-for="phase in phases" :key="phase" :value="phase">
                    {{ phase }}
                  </option>
                </select>
              </div>
            </div>
            <i
              v-if="userIsAdmin"
              class="material-icons has-text-success"
              @click="showAddDeviceModal()"
            >
              add_circle
            </i>
          </div>
          <table
            class="table is-hoverable is-fullwidth"
            v-if="filteredDevices.length"
          >
            <thead>
              <th v-for="header in headers" :key="header">
                <span class="table-header-filter is-capitalized">
                  {{ header }}
                </span>
              </th>
              <th></th>
            </thead>
            <tfoot v-if="filteredDevices.length > 10">
              <th
                class="is-capitalized"
                v-for="header in headers"
                :key="header"
              >
                {{ header }}
              </th>
              <th></th>
            </tfoot>
            <tbody>
              <tr
                class="row"
                v-for="(device, index) in filteredDevices"
                :key="device.name"
                @click="navigateToDevice(device)"
                style="cursor: pointer; font-weight: bold; border-top: 1px solid #1f2d3b"
                :style="{
                  backgroundColor:
                    hoveredRow === index
                      ? getHoveredBackgroundColor(device.health)
                      : getBackgroundColor(device.health),
                }"
                @mouseover="hoveredRow = index"
                @mouseleave="hoveredRow = null"
              >
                <td class="rack-unit" style="border: none;">
                  <span>{{ `${device.rack_unit_start || 'N/A'}` }}</span>
                </td>
                <td class="rack-name" style="border: none;">
                  <span>{{ `${device.rack_name || 'N/A'}` }}</span>
                </td>
                <td class="name" style="border: none;">
                  <span>{{ device.serial_number }}</span>
                </td>
                <td class="graduated" style="border: none;">
                  <span>{{ device.health }}</span>
                </td>
                <td class="phase" style="border: none;">
                  <span>{{ device.phase }}</span>
                </td>
                <td class="hardare-product" style="border: none;">
                  <span>{{ device.hardware_product_name }}</span>
                </td>
                <td class="last-reported" style="border: none;">
                  <span>{{ getDate(device.last_seen) }}</span>
                </td>
                <td class="remove-item has-text-right" style="border: none;">
                  <i
                    class="fas fa-trash-alt"
                    @click="showRemoveDeviceModal(device)"
                  ></i>
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
    <RemoveItemModal
      v-if="removeDevice"
      :item="removingDevice"
      item-type="device"
    />
    <AddDeviceModal v-if="addDevice" />
  </div>
</template>

<script>
import moment from 'moment';
import orderBy from 'lodash/orderBy';
import isEmpty from 'lodash/isEmpty';
import search from 'fuzzysearch';
import AddDeviceModal from './AddDeviceModal.vue';
import RemoveItemModal from './RemoveItemModal.vue';
import Spinner from '../components/Spinner.vue';
import { EventBus } from '@src/eventBus.js';
import { getBuildDevices, removeDeviceFromBuild } from '@api/builds.js';
import { mapState, mapActions } from 'vuex';
import { getRack, getRackAssignment } from '@api/racks.js';
import { getHardwareProducts } from '@api/hardwareProduct.js';

export default {
  components: {
    AddDeviceModal,
    RemoveItemModal,
    Spinner,
  },
  data() {
    return {
      addDevice: false,
      deviceFilter: 'all',
      devicePhaseFilter: 'all',
      deviceHealthFilter: 'all',
      devices: [],
      fetchingData: false,
      headers: [
        'rack unit',
        'rack name',
        'name',
        'health',
        'phase',
        'hardware product',
        'last reported',
      ],
      healthStates: ['pass', 'fail', 'error', 'unknown'],
      hoveredRow: '',
      phases: [
        'installation',
        'integration',
        'production',
        'diagnostics',
        'decommissioned',
      ],
      rack: {},
      removeDevice: false,
      removingDevice: {},
      searchText: '',
      showActionsDropdown: false,
    };
  },
  methods: {
    ...mapActions([
      'setActiveDeviceDetails',
      'setCurrentBuild',
      'setCurrentBuildDevices',
      'setHardwareProducts',
    ]),
    changeFilter(event, filter) {
      let healthFilter, phaseFilter;
      const eventValue = event && event.target && event.target.value;

      if (filter === 'health') {
        healthFilter = eventValue;
        phaseFilter = this.$route.query.phase;
      } else {
        healthFilter = this.$route.query.health;
        phaseFilter = eventValue;
      }

      this.$router.push({
        name: 'build-devices',
        params: { id: this.currentBuild.id },
        query: {
          health: healthFilter || 'all',
          phase: phaseFilter || 'all',
        },
      });
    },
    clearRack() {
      this.rack = {};
      this.devices = this.currentBuildDevices;

      const query = Object.assign({}, this.$route.query);
      delete query.rackId;
      this.$router.replace({ query });
    },
    closeModal() {
      this.addDevice = false;
      this.removeDevice = false;
      this.removingDevice = {};
    },
    async fetchData() {
      this.fetchingData = true;

      const buildId = this.$route.params.id;
      const currentBuild = this.currentBuild;
      const currentBuildDevices = this.currentBuildDevices;

      if (
        !currentBuild ||
        isEmpty(currentBuild) ||
        currentBuild.id !== buildId
      ) {
        const devicesResponse = await getBuildDevices(buildId);
        this.setCurrentBuildDevices(devicesResponse.data);
      } else if (!currentBuildDevices || currentBuildDevices.length === 0) {
        const devicesResponse = await getBuildDevices(buildId);
        this.setCurrentBuildDevices(devicesResponse.data);
      }

      // Process route queries
      if (this.$route.query) {
        const routeQuery = this.$route.query;

        if (routeQuery.rackId) {
          const rackId = routeQuery.rackId;

          const [rackResponse, rackAssignmentResponse] = await Promise.all([
            getRack(rackId),
            getRackAssignment(rackId),
          ]);

          this.rack = rackResponse.data;
          const rackDevices = rackAssignmentResponse.data;

          for (let i = 0; i < rackDevices.length; i++) {
            const device = rackDevices[i];
            const buildDevice = this.currentBuildDevices.find(
              buildDevice => buildDevice.id === device.device_id
            );

            if (buildDevice.id) {
              this.devices.push(buildDevice);
            }
          }
        } else {
          this.devices = this.currentBuildDevices;
        }

        if (routeQuery.phase) {
          this.devicePhaseFilter = routeQuery.phase;
        }

        if (routeQuery.health) {
          this.deviceHealthFilter = routeQuery.health;
        }
      }

      // Set device hardware products
      let hardwareProducts = this.hardwareProducts;

      if (!hardwareProducts || !hardwareProducts.length) {
        const response = await getHardwareProducts();
        hardwareProducts = response.data;
        this.setHardwareProducts(hardwareProducts);
      }

      for (let i = 0; i < this.devices.length; i++) {
        const device = this.devices[i];

        for (let j = 0; j < hardwareProducts.length; j++) {
          const hardwareProduct = hardwareProducts[j];

          if (hardwareProduct.id === device.hardware_product_id) {
            this.devices[i].hardware_product_name = hardwareProduct.name;
          }
        }
      }

      this.fetchingData = false;
    },
    getBackgroundColor(deviceHealth) {
      if (deviceHealth === 'pass') {
        return 'rgb(76, 175, 80, 0.8)';
      } else if (deviceHealth === 'error' || deviceHealth === 'fail') {
        return 'rgb(234, 70, 37, 0.7)';
      } else if (deviceHealth === 'unknown') {
        return 'rgb(250, 180, 7, 0.7)';
      }
    },
    getHoveredBackgroundColor(deviceHealth) {
      if (deviceHealth === 'pass') {
        return 'rgb(76, 175, 80, 1)';
      } else if (deviceHealth === 'error' || deviceHealth === 'fail') {
        return 'rgb(234, 70, 37, 0.9)';
      } else if (deviceHealth === 'unknown') {
        return 'rgb(250, 180, 7, 0.9)';
      }
    },
    getDate(date) {
      if (date) {
        return moment(date).fromNow();
      }

      return 'N/A';
    },
    navigateToDevice(device) {
      this.setActiveDeviceDetails(device);
      this.$router.push({
        name: 'device',
        params: { deviceId: device.id },
      });
    },
    refetchCurrentBuildDevices() {
      getBuildDevices(this.currentBuild.id).then(response => {
        this.setCurrentBuildDevices(response.data);
      });
    },
    removeDeviceFromBuild() {
      removeDeviceFromBuild(this.currentBuild.id, this.removingDevice.id).then(
        () => {
          EventBus.$emit('item-removed');

          this.refetchCurrentBuildDevices();
        }
      );
    },
    showAddDeviceModal() {
      this.addDevice = true;
    },
    showRemoveDeviceModal(device) {
      this.removingDevice = device;
      this.removeDevice = true;
    },
  },
  computed: {
    ...mapState([
      'currentBuild',
      'currentBuildDevices',
      'currentUser',
      'hardwareProducts',
    ]),
    filteredDevices() {
      let devices = this.devices;

      if (devices && devices.length) {
        if (this.searchText) {
          const searchText = this.searchText.toLowerCase();

          devices = devices.reduce((acc, device) => {
            const serialNumber = device.serial_number.toLowerCase();
            const rackUnit = device.rack_unit_start;
            const health = device.health.toLowerCase();
            const phase = device.phase.toLowerCase();
            const hardwareProduct = device.hardware_product_name.toLowerCase();
            const lastSeen = device.last_seen;

            if (
              (serialNumber && search(searchText, serialNumber)) ||
              (rackUnit && search(searchText, rackUnit)) ||
              (health && search(searchText, health)) ||
              (phase && search(searchText, phase)) ||
              (hardwareProduct && search(searchText, hardwareProduct)) ||
              (lastSeen && search(searchText, lastSeen))
            ) {
              acc.push(device);
            }

            return acc;
          }, []);
        }

        if (this.deviceHealthFilter !== 'all') {
          devices = devices.filter(
            device => device.health === this.deviceHealthFilter.toLowerCase()
          );
        }

        if (this.devicePhaseFilter !== 'all') {
          devices = devices.filter(
            device => device.phase === this.devicePhaseFilter.toLowerCase()
          );
        }

        devices = orderBy(
          devices,
          ['rack_name', 'rack_unit_start'],
          ['asc', 'desc']
        );
      }

      return devices;
    },
    userIsAdmin() {
      const build = this.currentBuild;
      const user = this.currentUser;

      if (
        (user && user.is_admin) ||
        (build &&
          build.admins &&
          build.admins.length &&
          build.admins.map(admin => admin.id).includes(user.id))
      ) {
        return true;
      }

      return false;
    },
  },
  async created() {
    this.fetchData();

    EventBus.$on(['close-modal:remove-item', 'close-modal:add-item'], () => {
      this.closeModal();
    });

    EventBus.$on('remove-item:device', () => {
      this.removeDeviceFromBuild();
    });

    EventBus.$on('device-added-to-build', () => {
      this.refetchCurrentBuildDevices();
    });
  },
  destroyed() {
    this.rack = {};
  },
};
</script>
