<template>
    <nav class="panel">
        <p class="panel-heading">
            {{ filteredDevices.length }} of {{ workspaceDevices.length }} Devices
        </p>
        <div class="panel-block">
            <p class="control has-icons-left">
                <input type="text" class="input is-small" placeholder="Search Devices" v-model="deviceSearchText">
                <span class="icon is-small is-left">
                    <i class="fas fa-search"></i>
                </span>
            </p>
        </div>
        <p class="panel-tabs">
            <a
                v-for="(progress, index) in availableDeviceProgress"
                :key="index"
                :class="{ 'is-active': selectedProgress === progress }"
                @click="selectedProgress = progress"
            >
                {{ progress }}
            </a>
        </p>
        <p class="panel-tabs" v-if="availableProducts">
            <a
                v-for="(product, index) in availableProducts"
                :key="index"
                :class="{ 'is-active': selectedProductId === product.id }"
                @click="selectedProductId = product.id"
            >
                {{ product.name }}
            </a>
        </p>
        <a
            v-for="(device, index) in filteredDevices"
            :key="index"
            class="panel-block"
            :class="{ 'is-active': activeDeviceId === device.id }"
            @click="activateDevice(device)"
        >
            <div class="panel-icon">
                <ProgressIcon :progress="deviceToProgress(device)" />
            </div>
            <p>{{ device.id }}</p>
            <p class="has-text-grey-light" v-if="device.asset_tag" style="flex-grow: 1;">
                {{ device.asset_tag }}
            </p>
        </a>
    </nav>
</template>

<script>
import ProgressIcon from '../components/ProgressIcon.vue';
import search from 'fuzzysearch';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import { mapActions, mapGetters, mapState  } from 'vuex';
import { getDeviceDetails, getDeviceSettings, getDeviceValidations } from '../../api/device.js';
import { getRackById } from '../../api/workspaces';
import { deviceToProgress } from '../shared/utils.js';

export default {
    props: {
        hardwareProductLookup: {
            required: true,
        },
        workspaceDevices: {
            required: true,
        },
    },
    components: {
        ProgressIcon,
    },
    data() {
        return {
            deviceSearchText: '',
            selectedProgress: 'all',
            selectedProductId: 'all',
        };
    },
    methods: {
        ...mapActions([
            'setActiveDevice',
            'setActiveDeviceDetails',
            'setActiveDeviceSettings',
            'setActiveDeviceValidations',
            'setActiveRoom',
            'setRackLayout',
        ]),
        activateDevice(device) {
            this.setActiveDevice(device);
            this.setDeviceSettings(device.id);
            this.setDeviceDetails(device.id)
                .then(response => {
                    let { datacenter, rack } = this.activeDeviceDetails.location;
                    let activeRoom = this.getRoomByName(datacenter.name);

                    this.setActiveRoom(activeRoom);

                    getRackById(this.currentWorkspaceId, rack.id)
                        .then(response => {
                            this.setRackLayout(response);
                        });
                });
            this.setDeviceValidations(device.id);

            this.$router.push({ name: 'device', params: { deviceId: this.activeDeviceId } });
        },
        deviceFilter(device) {
            const deviceId = device && device.id ? device.id.toLowerCase() : '';
            const assetTag = device && device.asset_tag ? device.asset_tag.toLowerCase() : '';

            const progressFilter = this.selectedProgress === 'all' || this.selectedProgress === deviceToProgress(device);
            const productFilter = this.selectedProductId === 'all' || this.selectedProductId === device.hardware_product;
            const searchFilter = search(this.deviceSearchTextLowerCase, deviceId) || search(this.deviceSearchTextLowerCase, assetTag);

            return progressFilter && productFilter && searchFilter;
        },
        deviceToProgress,
        setDeviceDetails(activeDeviceId) {
            return getDeviceDetails(activeDeviceId)
                .then(response => {
                    let deviceDetails = response.data;
                    this.setActiveDeviceDetails(deviceDetails);

                    return response.data;
                });
        },
        setDeviceSettings(activeDeviceId) {
            getDeviceSettings(activeDeviceId)
                .then(response => {
                    this.setActiveDeviceSettings(response.data);
                });
        },
        setDeviceValidations(activeDeviceId) {
            getDeviceValidations(activeDeviceId)
                .then(response => {
                    this.setActiveDeviceValidations(response.data);
                });
        },
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
            'currentWorkspaceId',
            'getRoomByName',
        ]),
        ...mapState([
            'activeDeviceDetails',
        ]),
        availableDeviceProgress() {
            return Array.from(
                this.workspaceDevices.reduce((acc, device) => {
                    acc.add(deviceToProgress(device));
                    return acc;
                }, new Set(['all']))
            ).sort();
        },
        availableProducts() {
            if (!isEmpty(this.hardwareProductLookup) && this.workspaceDevices.length) {
                const products = sortBy(
                    Array.from(
                        this.workspaceDevices.reduce((acc, device) => {
                            acc.add(this.hardwareProductLookup[device.hardware_product]);
                            return acc;
                        }, new Set())
                    ), 'name'
                );

                if (products.length) {
                    products.unshift({ id: 'all', name: 'all' });
                }

                return products;
            }

            return null;
        },
        deviceSearchTextLowerCase() {
            return this.deviceSearchText.toLowerCase();
        },
        filteredDevices() {
            return this.workspaceDevices.filter(device => {
                return this.deviceFilter(device);
            });
        },
    },
};
</script>
