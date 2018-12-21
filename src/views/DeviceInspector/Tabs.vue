<template>
    <div class="tabs-container">
        <div class="tabs is-centered is-boxed is-small">
            <ul>
                <li v-for="(tab, index) in tabTitles" :key="index">
                    <a @click="setActiveTab(tab)" :class="{ 'is-active': activeTab === tab }">{{ tab }}</a>
                </li>
            </ul>
        </div>
        <OverviewTab
            v-if="activeTab === 'Overview'"
            :active-device="activeDevice"
            :active-device-id="activeDeviceId"
            :device-settings="deviceSettings"
        />
        <ValidationTab
            v-else-if="activeTab === 'Validation'"
            :active-device="activeDevice"
            :active-device-id="activeDeviceId"
            :device-settings="deviceSettings"
        />
        <SettingsTab
            v-else-if="activeTab === 'Settings'"
            :active-device="activeDevice"
            :active-device-id="activeDeviceId"
            :device-settings="deviceSettings"
        />
        <StorageTab
            v-else-if="activeTab === 'Storage'"
            :active-device="activeDevice"
            :active-device-id="activeDeviceId"
            :device-settings="deviceSettings"
        />
        <NetworkingTab
            v-else-if="activeTab === 'Networking'"
            :active-device="activeDevice"
            :active-device-id="activeDeviceId"
            :device-settings="deviceSettings"
        />
        <ReportTab
            v-else-if="activeTab === 'Latest Report'"
            :active-device="activeDevice"
            :active-device-id="activeDeviceId"
            :device-settings="deviceSettings"
        />
    </div>
</template>

<script>
import OverviewTab from './OverviewTab.vue';
import ValidationTab from './ValidationTab.vue';
import SettingsTab from './SettingsTab.vue';
import StorageTab from './StorageTab.vue';
import NetworkingTab from './NetworkingTab.vue';
import ReportTab from './ReportTab.vue';

export default {
    props: {
        activeDevice: {
            required: true,
        },
        activeDeviceId: {
            required: true,
        },
        deviceSettings: {
            required: true,
        },
    },
    components: {
        OverviewTab,
        NetworkingTab,
        ReportTab,
        SettingsTab,
        StorageTab,
        ValidationTab,
    },
    data() {
        return {
            activeTab: '',
            tabTitles: [
                'Overview',
                'Validation',
                'Settings',
                'Storage',
                'Networking',
                'Latest Report',
            ],
        };
    },
    methods: {
        setActiveTab(title) {
            this.activeTab = title;
        },
    },
};
</script>
