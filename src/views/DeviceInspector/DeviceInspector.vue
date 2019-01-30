<template>
    <div class="device-inspector">
        <section class="section" v-if="!hasActiveDevice">
            <Spinner/>
        </section>
        <div class="tabs-container" v-else>
            <div class="tabs is-centered is-boxed is-small">
                <ul>
                    <li v-for="(tab, index) in tabs" :key="index" :class="{ 'is-active': activeTab === tab.component }">
                        <a @click="setActiveTab(tab.component)">{{ tab.title }}</a>
                    </li>
                </ul>
            </div>
            <component :is="activeTab"></component>
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
import { mapActions, mapGetters, mapState } from 'vuex';
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
