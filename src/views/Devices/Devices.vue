<template>
  <div class="device-browser">
    <div
      class="page-heading"
      style="display: flex; align-items: center; margin-bottom: 20px"
    >
      <span class="icon material-icons">dns</span>
      <h1 class="title is-4 has-text-weight-bold" style="margin-left: 8px;">
        {{
          `${
            this.activeDeviceDetails && this.activeDeviceDetails.id
              ? this.activeDeviceDetails.serial_number ||
                this.activeDeviceDetails.id
              : 'Devices'
          }`
        }}
      </h1>
    </div>
    <template v-if="!$route.params.deviceId">
      <div class="field has-addons">
        <div class="control has-icons-left device-search">
          <input
            type="text"
            class="input search is-medium"
            placeholder="Search by serial number or ID..."
            v-model.trim="serialNumber"
            @keyup.enter="isLoading ? null : searchDevice()"
          />
          <span class="icon is-small is-left">
            <i class="material-icons">search</i>
          </span>
        </div>
        <div class="control">
          <a
            class="button is-info is-medium search"
            :class="{ 'is-loading': isLoading }"
            @click="isLoading ? null : searchDevice()"
          >
            Search
          </a>
        </div>
      </div>
      <div class="columns" style="justify-content: center; margin-top: 80px;">
        <div
          class="column is-one-third-widescreen is-half-desktop is-full-mobile"
        >
          <router-link
            :to="{ name: 'builds' }"
            class="card is-rounded-2 is-parent"
            tag="div"
          >
            <div class="card-content">
              <p class="is-size-5 has-text-centered" style="margin-bottom: 6px;"
                >Device part of a build?</p
              >
              <p
                class="has-text-centered"
                style="margin-bottom: 25px; display: flex; align-items: center; justify-content: center"
              >
                <span class="is-size-6">Visit the builds page</span>
                <span class="material-icons" style="margin-left: 8px;"
                  >arrow_forward</span
                >
              </p>
              <div class="content">
                <div class="card is-rounded-1">
                  <div class="build-info">
                    <p class="is-size-5 is-title">stardust-v1</p>
                    <p class="is-family-monospace is-size-7"
                      >ab719a4f-1b70-4726-9b8d-35ae177483ef</p
                    >
                  </div>
                  <span
                    class="material-icons has-text-success"
                    style="font-size: 32px;"
                  >
                    check_circle
                  </span>
                </div>
                <div class="card is-rounded-1">
                  <div class="build-info">
                    <p class="is-size-5 is-title">stardust-spare-servers</p>
                    <p class="is-family-monospace is-size-7"
                      >cd0deabe-12a2-4ae9-a4cb-c6e1c861c40e</p
                    >
                  </div>
                  <span
                    class="material-icons has-text-danger"
                    style="font-size: 32px;"
                  >
                    cancel
                  </span>
                </div>
                <div class="card is-rounded-1">
                  <div class="build-info">
                    <p class="is-size-5 is-title">stardust-demo-lab</p>
                    <p class="is-family-monospace is-size-7"
                      >efa250a6-799e-49cd-88d8-2218ab5d4bbd</p
                    >
                  </div>
                  <span class="material-icons" style="font-size: 32px;">
                    autorenew
                  </span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <div
          class="column is-one-third-widescreen is-half-desktop is-full-mobile"
        >
          <router-link
            :to="{ name: 'datacenters' }"
            class="card is-rounded-2 is-parent"
            tag="div"
          >
            <div class="card-content">
              <p class="is-size-5 has-text-centered" style="margin-bottom: 6px;"
                >Looking for devices in a data center?</p
              >
              <p
                class="has-text-centered"
                style="margin-bottom: 25px; display: flex; align-items: center; justify-content: center"
              >
                <span class="is-size-6">Check out the data centers</span>
                <span class="material-icons" style="margin-left: 8px;"
                  >arrow_forward</span
                >
              </p>
              <div class="content">
                <div class="card is-rounded-1">
                  <div class="build-info">
                    <p class="is-size-5 is-title is-uppercase"
                      >fulcrum-lab--secret</p
                    >
                    <p class="is-family-monospace is-size-7"
                      >ca719a4f-1b70-4726-9b8d-35ae177483ef</p
                    >
                  </div>
                  <span class="material-icons" style="font-size: 32px;">
                    business
                  </span>
                </div>
                <div class="card is-rounded-1">
                  <div class="build-info">
                    <p class="is-size-5 is-title">isd-interdictor-servers</p>
                    <p class="is-family-monospace is-size-7"
                      >360deabe-12a2-4ae9-a4cb-c6e1c861c40e</p
                    >
                  </div>
                  <span class="material-icons" style="font-size: 32px;">
                    dns
                  </span>
                </div>
                <div class="card is-rounded-1">
                  <div class="build-info">
                    <p class="is-size-5 is-title">wayfinder-demo-device</p>
                    <p class="is-family-monospace is-size-7"
                      >1ea250a6-799e-49cd-88d8-2218ab5d4bbd</p
                    >
                  </div>
                  <span class="material-icons" style="font-size: 32px;">
                    developer_board
                  </span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </template>
    <router-view></router-view>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import { getDeviceDetails } from '@api/devices.js';

export default {
  data() {
    return {
      isLoading: false,
      serialNumber: '',
      showDeviceInRack: false,
    };
  },
  methods: {
    ...mapActions([
      'clearActiveDevice',
      'clearActiveRoomName',
      'clearRackLayout',
      'setActiveDeviceDetails',
    ]),
    clearActiveData() {
      this.clearActiveDevice();
      this.clearActiveRoomName();
      this.clearRackLayout();
    },
    isEmpty,
    async getDevice(identifier) {
      try {
        await getDeviceDetails(identifier)
          .then(response => {
            const device = response.data;
            this.setActiveDeviceDetails(device);

            if (device.location) {
              const { datacenter_room } = device.location;

              if (datacenter_room && datacenter_room.az) {
                this.setActiveRoomName(datacenter_room.az);
              }
            }

            this.$router.push({
              name: 'device',
              params: { deviceId: device.id },
            });
          })
          .catch(error => {
            this.isLoading = false;

            if (error.status === 404) {
              this.setError(error);
            }
          });
      } catch (error) {
        this.setError(error);
      }
    },
    setError(error) {
      let errorMessage;

      if (error && error.data && error.data.error) {
        errorMessage = `Error: ${error.data.error}`;
      } else {
        errorMessage = 'Error: Invalid serial number';
      }

      this.$toasted.error(errorMessage, {
        action: [
          {
            icon: 'close',
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
            },
          },
        ],
        duration: 3000,
        icon: 'error',
      });

      this.isLoading = false;
    },
    searchDevice() {
      const serialNumber = this.serialNumber;

      if (serialNumber) {
        this.isLoading = true;

        getDeviceDetails(serialNumber)
          .then(response => {
            const device = response.data;
            this.setActiveDeviceDetails(device);

            this.$router.push({
              name: 'device',
              params: {
                deviceId: device.id,
              },
            });
          })
          .catch(error => {
            this.isLoading = false;

            if (error.status === 404) {
              this.setError(error);
            }
          });
      } else {
        this.setError();
      }
    },
  },
  computed: {
    ...mapState(['activeDeviceDetails']),
  },
  mounted() {
    if (this.$route.params && this.$route.params.deviceId) {
      if (!this.activeDeviceDetails || !this.activeDeviceDetails.id) {
        this.getDevice(this.$route.params.deviceId);
      }
    }

    EventBus.$on('showDeviceInRack', () => {
      this.showDeviceInRack = true;
    });
  },
  destroyed() {
    if (!this.showDeviceInRack) {
      this.clearActiveData();
    }
  },
};
</script>
