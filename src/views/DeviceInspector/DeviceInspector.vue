<template>
    <div class="device-inspector">
        <section class="section" v-if="!hasActiveDevice">
            <Spinner/>
        </section>
        <div class="tabs-container">
            <div class="tabs is-centered is-boxed is-small">
                <ul>
                    <li v-for="(tab, index) in tabTitles" :key="index" :class="{ 'is-active': activeTab === tab }">
                        <a @click="setActiveTab(tab)">{{ tab }}</a>
                    </li>
                </ul>
            </div>
            <OverviewTab v-if="activeTabOverview" />
            <ValidationTab v-else-if="activeTabValidation" />
            <SettingsTab v-else-if="activeTabSettings" />
            <StorageTab v-else-if="activeTabStorage" />
            <NetworkingTab v-else-if="activeTabNetworking" />
            <ReportTab v-else-if="activeTabLatestReport" />
        </div>
    </div>
</template>

<script>
import NetworkingTab from './NetworkingTab.vue';
import OverviewTab from './OverviewTab.vue';
import ReportTab from './ReportTab.vue';
import SettingsTab from './SettingsTab.vue';
import Spinner from '../components/Spinner.vue';
import StorageTab from './StorageTab.vue';
import ValidationTab from './ValidationTab.vue';
import isEmpty from 'lodash/isEmpty';
import { mapState, mapGetters, mapActions } from 'vuex';
import { getDeviceDetails, getDeviceSettings, getDeviceValidations } from '../../api/device.js';
import { getValidations } from '../../api/validations.js';

export default {
    components: {
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
            activeTab: 'Overview',
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
        ...mapActions([
            'setActiveDeviceDetails',
            'setActiveDeviceSettings',
            'setActiveDeviceValidations',
            'setValidations',
        ]),
        setActiveTab(tab) {
            this.activeTab = tab;
        },
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
        ]),
        ...mapState([
            'activeDevice',
        ]),
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
        hasActiveDevice() {
            return !isEmpty(this.activeDevice);
        },
    },
    created() {
        getDeviceSettings(this.activeDeviceId)
            .then(response => {
                this.setActiveDeviceSettings(response.data);
            });
        getDeviceDetails(this.activeDeviceId)
            .then(response => {
                this.setActiveDeviceDetails(response.data);
            });
        getDeviceValidations(this.activeDeviceId)
            .then(response => {
                this.setActiveDeviceValidations(response.data);
            });
        getValidations()
            .then(response => {
                this.setValidations(response.data);
            });
    },
};
</script>
