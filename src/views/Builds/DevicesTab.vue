<template>
    <div class="devices-tab">
        <div class="columns">
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
                        <div class="select-with-label phase">
                            <label class="select-label">Phase</label>
                            <div class="select device-phase">
                                <select v-model="devicePhaseFilter">
                                    <option value="all">All</option>
                                    <option
                                        v-for="phase in phases"
                                        :key="phase"
                                        :value="phase"
                                    >
                                        {{ phase }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="select-with-label health">
                            <label class="select-label">Health</label>
                            <div class="select device-health">
                                <select v-model="deviceHealthFilter">
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
                        <i
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
                                <span
                                    class="table-header-filter is-capitalized"
                                >
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
                                v-for="device in filteredDevices"
                                :key="device.name"
                                @click="navigateToDevice(device)"
                                style="cursor: pointer;"
                            >
                                <td class="rack-unit">
                                    <span>{{
                                        `${device.rack_unit_start || 'N/A'}`
                                    }}</span>
                                </td>
                                <td class="rack-name">
                                    <span>{{
                                        `${device.rack_name || 'N/A'}`
                                    }}</span>
                                </td>
                                <td class="name">
                                    <span>{{ device.serial_number }}</span>
                                </td>
                                <td class="graduated">
                                    <span>{{ device.health }}</span>
                                </td>
                                <td class="phase">
                                    <span>{{ device.phase }}</span>
                                </td>
                                <td class="hardare-product">
                                    <span>{{
                                        device.hardware_product_name
                                    }}</span>
                                </td>
                                <td class="last-reported">
                                    <span>{{ getDate(device.last_seen) }}</span>
                                </td>
                                <td class="remove-item has-text-right">
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
import search from 'fuzzysearch';
import AddDeviceModal from './AddDeviceModal.vue';
import RemoveItemModal from './RemoveItemModal.vue';
import { EventBus } from '@src/eventBus.js';
import * as Builds from '@api/builds.js';
import { mapState, mapActions } from 'vuex';
import { getRackAssignment } from '@api/racks.js';
import { getHardwareProducts } from '@api/hardwareProduct.js';

export default {
    components: {
        AddDeviceModal,
        RemoveItemModal,
    },
    props: {
        buildId: {
            type: String,
            required: true,
        },
        rack: {
            type: Object,
            required: false,
            default: () => null,
        },
    },
    data() {
        return {
            addDevice: false,
            deviceFilter: 'all',
            devicePhaseFilter: 'all',
            deviceHealthFilter: 'all',
            devices: [],
            headers: [
                'rack unit',
                'rack name',
                'name',
                'health',
                'phase',
                'hardware product',
                'last reported',
            ],
            healthStates: ['Pass', 'Fail', 'Error', 'Unknown'],
            phases: [
                'Installation',
                'Integration',
                'Production',
                'Diagnostics',
                'Decommissioned',
            ],
            removeDevice: false,
            removingDevice: {},
            searchText: '',
            showActionsDropdown: false,
            showRackDevices: false,
        };
    },
    methods: {
        ...mapActions([
            'setActiveDeviceDetails',
            'setCurrentBuildDevices',
            'setHardwareProducts',
        ]),
        closeModal() {
            this.addDevice = false;
            this.removeDevice = false;
            this.removingDevice = {};
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
            Builds.getBuildDevices(this.buildId).then(response => {
                this.setCurrentBuildDevices(response.data);
            });
        },
        removeDeviceFromBuild() {
            Builds.removeDeviceFromBuild(
                this.buildId,
                this.removingDevice.id
            ).then(() => {
                EventBus.$emit('item-removed');

                this.refetchCurrentBuildDevices();
            });
        },
        showAddDeviceModal() {
            this.addDevice = true;
        },
        showAllDevices() {
            this.devices = this.currentBuildDevices;
            this.showRackDevices = false;
        },
        showRemoveDeviceModal(device) {
            this.removingDevice = device;
            this.removeDevice = true;
        },
    },
    computed: {
        ...mapState(['currentBuildDevices', 'hardwareProducts']),
        filteredDevices() {
            let devices = this.devices;

            if (devices && devices.length) {
                if (this.searchText) {
                    const searchText = this.searchText.toLowerCase();

                    return devices.reduce((acc, device) => {
                        const serialNumber = device.serial_number.toLowerCase();
                        const rackUnit = device.rack_unit_start;
                        const health = device.health.toLowerCase();
                        const phase = device.phase.toLowerCase();
                        const hardwareProduct = device.hardware_product_name.toLowerCase();
                        const lastSeen = device.last_seen;

                        if (
                            (serialNumber &&
                                search(searchText, serialNumber)) ||
                            (rackUnit && search(searchText, rackUnit)) ||
                            (health && search(searchText, health)) ||
                            (phase && search(searchText, phase)) ||
                            (hardwareProduct &&
                                search(searchText, hardwareProduct)) ||
                            (lastSeen && search(searchText, lastSeen))
                        ) {
                            acc.push(device);
                        }

                        return acc;
                    }, []);
                }

                if (this.deviceHealthFilter !== 'all') {
                    devices = devices.filter(
                        device =>
                            device.health ===
                            this.deviceHealthFilter.toLowerCase()
                    );
                }

                if (this.devicePhaseFilter !== 'all') {
                    devices = devices.filter(
                        device =>
                            device.phase ===
                            this.devicePhaseFilter.toLowerCase()
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
    },
    async created() {
        if (this.rack.id) {
            const response = await getRackAssignment(this.rack.id);
            const rackDevices = response.data;

            this.showRackDevices = true;

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
                    this.devices[i].hardware_product_name =
                        hardwareProduct.name;
                }
            }
        }

        EventBus.$on(
            ['close-modal:remove-item', 'close-modal:add-item'],
            () => {
                this.closeModal();
            }
        );

        EventBus.$on('remove-item:device', () => {
            this.removeDeviceFromBuild();
        });

        EventBus.$on('device-added-to-build', () => {
            this.refetchCurrentBuildDevices();
        });

        EventBus.$on('device-tab-clicked', () => {
            this.showAllDevices();
        });
    },
};
</script>
