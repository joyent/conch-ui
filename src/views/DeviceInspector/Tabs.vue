<template>
    <div class="tabs-container">
        <div class="tabs is-centered is-boxed is-small">
            <ul>
                <li v-for="(tab, index) in tabTitles" :key="index" :class="{ 'is-active': activeTab === tab }">
                    <a @click="setActiveTab(tab)">{{ tab }}</a>
                </li>
            </ul>
        </div>
        <OverviewTab v-if="activeTabOverview" :device-settings="deviceSettings"/>
        <ValidationTab v-else-if="activeTabValidation" :device-settings="deviceSettings" />
        <SettingsTab v-else-if="activeTabSettings" :device-settings="deviceSettings" />
        <StorageTab v-else-if="activeTabStorage" :device-settings="deviceSettings" />
        <NetworkingTab v-else-if="activeTabNetworking" :device-settings="deviceSettings" />
        <ReportTab v-else-if="activeTabLatestReport" :device-settings="deviceSettings" />
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
            activeTab: 'Storage',
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
        setActiveTab(tab) {
            this.activeTab = tab;
        },
    },
    computed: {
        activeTabOverview() {
            return this.activeTab === 'Overview';
        },
        activeTabNetworking() {
            return this.activeTab === 'Networking';
        },
        activeTabValidation() {
            return this.activeTab === 'Validation';
        },
        activeTabSettings() {
            return this.activeTab === 'Settings';
        },
        activeTabStorage() {
            return this.activeTab === 'Storage';
        },
        activeTabLatestReport() {
            return this.activeTab === 'Latest Report';
        },
    },
};
</script>
