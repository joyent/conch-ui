<template>
    <div class="devices-tab">
        <!-- <div class="columns is-vcentered">
            <div class="column">
                <a class="filter-all" @click="deviceFilter = 'all'">
                    <div class="box">
                        <h2 class="is-6">All Devices</h2>
                        <span class="is-size-3 has-text-info">
                            {{ build.devices.length }}
                        </span>
                    </div>
                </a>
            </div>
            <div class="column">
                <a class="filter-graduated" @click="deviceFilter = 'graduated'">
                    <div class="box">
                        <h2 class="is-6">Graduated</h2>
                        <span class="is-size-3 has-text-info">
                            {{ devicesGraduated }}
                        </span>
                    </div>
                </a>
            </div>
            <div class="column">
                <a class="filter-validated" @click="deviceFilter = 'validated'">
                    <div class="box">
                        <h2 class="is-6">Validated</h2>
                        <span class="is-size-3 has-text-info">
                            {{ devicesValidated }}
                        </span>
                    </div>
                </a>
            </div>
        </div> -->
        <div class="columns">
            <div class="column">
                <div class="devices-table is-paddingless">
                    <div class="datatable-header">
                        <span class="heading is-size-6 is-marginless">
                            Devices
                        </span>
                        <div class="control has-icons-left has-icons-right">
                            <input
                                class="input search"
                                type="text"
                                placeholder="Search Devices"
                                v-model="searchText"
                            />
                            <span class="icon is-small is-left">
                                <i
                                    class="material-icons"
                                    style="font-size: 22px; margin-left: 5px;"
                                >
                                    search
                                </i>
                            </span>
                        </div>
                        <div class="select-with-label">
                            <label class="select-label">Phase</label>
                            <div class="select device-phase">
                                <select v-model="devicePhaseFilter">
                                    <option value="all">All</option>
                                    <option value="integration">
                                        Integration
                                    </option>
                                    <option value="installation">
                                        Installation
                                    </option>
                                    <option value="production">
                                        Production
                                    </option>
                                    <option value="diagnostics">
                                        Diagnostics
                                    </option>
                                    <option value="decommissioned">
                                        Decommissioned
                                    </option>
                                </select>
                            </div>
                        </div>
                        <i
                            class="material-icons has-text-success"
                            @click="addDevice()"
                        >
                            add_circle
                        </i>
                    </div>
                    <table class="table is-hoverable is-fullwidth">
                        <thead>
                            <th>
                                <a
                                    class="table-header-filter name"
                                    :class="{ 'has-text-white': sortBy === 'name' }"
                                    @click="sort('name')"
                                >
                                    Name
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="isSortedBy('name') && !reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="isSortedBy('name') && reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th>
                                <a
                                    class="table-header-filter health"
                                    :class="{ 'has-text-white': sortBy === 'health' }"
                                    @click="sort('health')"
                                >
                                    Health
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="isSortedBy('health') && !reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="isSortedBy('health') && reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th>
                                <a
                                    class="table-header-filter phase"
                                    :class="{ 'has-text-white': sortBy === 'phase' }"
                                    @click="sort('phase')"
                                >
                                    Phase
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="isSortedBy('phase') && !reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="isSortedBy('phase') && reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th>
                                <a
                                    class="table-header-filter hardware_product"
                                    :class="{ 'has-text-white': sortBy === 'hardware_product' }"
                                    @click="sort('hardware_product')"
                                >
                                    Hardware Product
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="isSortedBy('hardware_product') && !reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="isSortedBy('hardware_product') && reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th></th>
                        </thead>
                        <tfoot v-if="filteredDevices.length > 10">
                            <th>Name</th>
                            <th>Health</th>
                            <th>Phase</th>
                            <th>Hardware Product</th>
                            <th></th>
                        </tfoot>
                        <tbody>
                            <tr
                                class="row"
                                v-for="device in filteredDevices"
                                :key="device.name"
                            >
                                <td class="name">
                                    <span>{{ device.name }}</span>
                                </td>
                                <td class="graduated">
                                    <span>{{ device.health }}</span>
                                </td>
                                <td class="phase">
                                    <span>{{ device.phase }}</span>
                                </td>
                                <td class="hardare-produc">
                                    <span>dell-2u-compute-v1-256g-10-12tb</span>
                                </td>
                                <td class="remove-item has-text-right">
                                    <i
                                        class="fas fa-trash-alt"
                                        @click="removeDevice(device)"
                                    ></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <RemoveItemModal
            v-if="removingDevice"
            :item="device"
            item-type="device"
        />
    </div>
</template>

<script>
import orderBy from 'lodash/orderBy';
import search from "fuzzysearch";
import RemoveItemModal from './RemoveItemModal.vue';
import { EventBus } from '@src/eventBus.js';

export default {
    components: {
        RemoveItemModal,
    },
    props: {
        build: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            device: {},
            deviceFilter: 'all',
            devicePhaseFilter: 'all',
            previousSortBy: '',
            removingDevice: false,
            reversedSort: false,
            searchText: '',
            sortBy: '',
            sortedDevices: [],
        };
    },
    methods: {
        addDevice() {

        },
        isSortedBy(field) {
            return this.sortBy === field || this.previousSortBy === field;
        },
        removeDevice(device) {
            this.device = device;
            this.removingDevice = true;
        },
        sort(field) {
            if (this.sortBy === field) {
                this.previousSortBy = field;
                this.sortBy = 'reverse';
                this.reversedSort = true;
            } else {
                this.sortBy = field;
                this.reversedSort = false;
            }
        },
    },
    computed: {
        devicesGraduated() {
            return this.devices.filter(
                device => device.graduated === true
            ).length;
        },
        devicesValidated() {
            return this.devices.filter(
                device => device.validated === true
            ).length;
        },
        filteredDevices() {
            let devices = this.build.devices;

            if (this.searchText) {
                const searchText = this.searchText.toLowerCase();

                return devices.reduce((acc, device) => {
                    const name = device.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(device);
                    }

                    return acc;
                }, []);
            }

            if (this.deviceFilter) {
                const deviceFilter = this.deviceFilter;

                if (deviceFilter === 'graduated') {
                    devices = devices.filter(
                        device => device.graduated === true
                    );
                } else if (deviceFilter === 'validated') {
                    devices = devices.filter(
                        device => device.validated === true
                    );
                }
            }

            if (this.devicePhaseFilter) {
                const devicePhaseFilter = this.devicePhaseFilter;

                if (devicePhaseFilter === 'integration') {
                    devices = devices.filter(
                        device => device.phase === 'integration'
                    );
                } else if (devicePhaseFilter === 'installation') {
                    devices = devices.filter(
                        device => device.phase === 'installation'
                    );
                } else if (devicePhaseFilter === 'production') {
                    devices = devices.filter(
                        device => device.phase === 'production'
                    );
                } else if (devicePhaseFilter === 'diagnostics') {
                    devices = devices.filter(
                        device => device.phase === 'diagnostics'
                    );
                } else if (devicePhaseFilter === 'decommissioned') {
                    devices = devices.filter(
                        device => device.phase === 'decommissioned'
                    );
                }
            }

            if (this.sortBy) {
                const sortBy = this.sortBy;
                devices = this.sortedDevices;

                if (sortBy !== 'reverse') {
                    if (sortBy === 'name') {
                        devices = orderBy(
                            devices,
                            [device => device.name],
                            ['asc']
                        );
                    } else if (sortBy === 'graduated') {
                        devices = orderBy(
                            devices,
                            [device => device.graduated],
                            ['asc']
                        );
                    } else if (sortBy === 'validated') {
                        devices = orderBy(
                            devices,
                            [device => device.validated],
                            ['asc']
                        );
                    } else if (sortBy === 'phase') {
                        devices = orderBy(
                            devices,
                            [device => device.phase],
                            ['asc']
                        );
                    }
                } else {
                    devices.reverse();
                }

                this.sortedDevices = devices;
            }

            return devices;
        },
    },
    created() {
        this.devices = this.build.devices;
    },
    mounted() {
        this.sortedDevices = this.build.devices;

        EventBus.$on('close-modal:remove-item', () => {
            this.removingDevice = false;
        });
    },
};
</script>
