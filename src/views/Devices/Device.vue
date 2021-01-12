<template>
  <div class="device">
    <div class="tabs-container">
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
import { mapActions, mapState } from 'vuex';

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
    ...mapActions(['clearShowDeviceInRack', 'setActiveDeviceDetails']),
    setActiveTab(tab) {
      this.activeTab = tab;
    },
  },
  computed: {
    ...mapState(['showDeviceInRack']),
  },
  mounted() {
    if (this.showDeviceInRack) {
      this.clearShowDeviceInRack();
    }
  },
  destroyed() {
    this.setActiveDeviceDetails({});
  },
};
</script>
