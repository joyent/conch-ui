<template>
  <div class="device-inspector">
    <section class="section" v-if="!hasActiveDevice">
      <Spinner />
    </section>
    <div class="tabs-container" v-else>
      <div class="tabs is-toggle is-centered">
        <ul>
          <li
            v-for="(tab, index) in tabs"
            :key="index"
            :class="{ 'is-active': activeTab === tab.component }"
          >
            <a @click="setActiveTab(tab.component)">
              {{ tab.title }}
            </a>
          </li>
        </ul>
      </div>
      <component :is="activeTab"></component>
    </div>
  </div>
</template>

<script>
import DeviceLinksTab from './DeviceLinksTab.vue';
import NetworkingTab from './NetworkingTab.vue';
import OverviewTab from './OverviewTab.vue';
import ReportTab from './ReportTab.vue';
import SettingsTab from './SettingsTab.vue';
import Spinner from '@views/components/Spinner.vue';
import StorageTab from './StorageTab.vue';
import ValidationTab from './ValidationTab.vue';
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapGetters, mapState } from 'vuex';
import {
  getDeviceDetails,
  getDeviceSettings,
  getDeviceValidations,
} from '@api/devices.js';

export default {
  components: {
    DeviceLinksTab,
    NetworkingTab,
    OverviewTab,
    ReportTab,
    SettingsTab,
    Spinner,
    StorageTab,
    ValidationTab,
  },
  data() {
    return {
      activeTab: 'OverviewTab',
      tabs: [
        {
          component: 'OverviewTab',
          title: 'Overview',
        },
        {
          component: 'ValidationTab',
          title: 'Validation',
        },
        {
          component: 'SettingsTab',
          title: 'Settings',
        },
        {
          component: 'StorageTab',
          title: 'Storage',
        },
        {
          component: 'NetworkingTab',
          title: 'Networking',
        },
        {
          component: 'ReportTab',
          title: 'Latest Report',
        },
        {
          component: 'DeviceLinksTab',
          title: 'Links',
        },
      ],
    };
  },
  methods: {
    ...mapActions([
      'clearShowDeviceInRack',
      'setActiveDeviceDetails',
      'setActiveDeviceSettings',
      'setActiveDeviceValidations',
      'setActiveRoomName',
      'setRackLayout',
    ]),
    setActiveDeviceData() {
      getDeviceSettings(this.activeDeviceId).then(response => {
        this.setActiveDeviceSettings(response.data);
      });

      getDeviceDetails(this.activeDeviceId).then(response => {
        const deviceDetails = response.data;
        this.setActiveDeviceDetails(deviceDetails);

        if (deviceDetails.location) {
          const { datacenter_room } = deviceDetails.location;

          if (datacenter_room && datacenter_room.az) {
            this.setActiveRoomName(datacenter_room.az);
          }
        }
      });

      getDeviceValidations(this.activeDeviceId).then(response => {
        this.setActiveDeviceValidations(response.data);
      });
    },
    setActiveTab(tab) {
      this.activeTab = tab;
    },
  },
  computed: {
    ...mapGetters(['activeDeviceId']),
    ...mapState(['activeDevice', 'showDeviceInRack']),
    hasActiveDevice() {
      return !isEmpty(this.activeDevice);
    },
  },
  mounted() {
    if (!this.showDeviceInRack && this.activeDeviceId) {
      this.setActiveDeviceData();
    } else if (this.showDeviceInRack) {
      this.clearShowDeviceInRack();
    }
  },
  updated() {
    this.setActiveDeviceData();
  },
};
</script>
