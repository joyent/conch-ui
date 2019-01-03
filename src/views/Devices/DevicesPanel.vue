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
        <p class="panel-tabs">
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
import moment from 'moment';
import { mapGetters } from 'vuex';

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
        deviceFilter(device) {
            const deviceId = device ? device.id.toLowerCase() : '';
            const assetTag = device && device.asset_tag ? device.asset_tag.toLowerCase() : '';

            const progressFilter = this.selectedProgress === 'all' || this.selectedProgress === this.deviceToProgress(device);
            const productFilter = this.selectedProductId === 'all' || this.selectedProductId === device.hardware_product;
            const searchFilter = search(this.deviceSearchTextLowerCase, deviceId) || search(this.deviceSearchTextLowerCase, assetTag);

            return progressFilter && productFilter && searchFilter;
        },
        deviceToProgress(device) {
            if (device == null) {
                return "unassigned";
            } else if (device.graduated) {
                return "graduated";
            } else if (device.validated) {
                return "validated";
            } else if (device.health.toLowerCase() === "fail") {
                return "failing";
            } else if (moment().diff(moment(device.last_seen), "second") <= 300) {
                return "active";
            }

            return "in progress";
        },
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
        ]),
        availableDeviceProgress() {
            return Array.from(
                this.workspaceDevices.reduce((acc, device) => {
                    acc.add(this.deviceToProgress(device));
                    return acc;
                }, new Set(['all']))
            ).sort();
        },
        availableProducts() {
            const products = sortBy(
                Array.from(
                    this.workspaceDevices.reduce((acc, device) => {
                        acc.add(this.hardwareProductLookup[device.hardware_product]);
                        return acc;
                    }, new Set())
                ), 'name'
            );

            products.unshift({ id: 'all', name: 'all' })

            return products;
        },
        deviceSearchTextLowerCase() {
            return this.deviceSearchText.toLowerCase();
        },
        filteredDevices() {
            return this.workspaceDevices.filter(device => {
                return this.deviceFilter(device);
            })
        },
    },
};
</script>
