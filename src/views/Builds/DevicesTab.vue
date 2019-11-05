<template>
    <div class="devices-tab">
        <div class="columns">
            <div class="column">
                <div class="devices-table is-paddingless">
                    <div class="datatable-header">
                        <span class="heading is-size-6 is-marginless">
                            Devices
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
                                        value="state"
                                    >
                                        {{ state }}
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
                            <th v-for="header in headers" :key="header">
                                <a
                                    class="table-header-filter is-capitalized"
                                    :class="{
                                        'has-text-white': sortBy === header,
                                    }"
                                    @click="sort()"
                                >
                                    {{ header }}
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="
                                            sortBy === header && !reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="
                                            sortBy === header && reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th></th>
                        </thead>
                        <tfoot>
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
                            >
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
                                    <span>dell-2u-compute-v1-256g-10-12tb</span>
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
                </div>
            </div>
        </div>
        <RemoveItemModal
            v-if="removeDevice"
            :item="removingDevice"
            item-type="device"
        />
    </div>
</template>

<script>
import orderBy from 'lodash/orderBy';
import search from 'fuzzysearch';
import RemoveItemModal from './RemoveItemModal.vue';
import { EventBus } from '@src/eventBus.js';
import * as Builds from '@api/builds.js';

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
            deviceFilter: 'all',
            devicePhaseFilter: 'all',
            deviceHealthFilter: 'all',
            headers: ['name', 'health', 'phase', 'hardware product'],
            healthStates: ['Pass', 'Fail', 'Error', 'Unknown'],
            phases: [
                'Installation',
                'Integration',
                'Production',
                'Diagnostics',
                'Decommissioned',
            ],
            previousSortBy: '',
            removeDevice: false,
            removingDevice: {},
            reversedSort: false,
            searchText: '',
            sortBy: '',
            sortedDevices: [],
        };
    },
    methods: {
        addDevice() {

        },
        closeModal() {
            this.removeDevice = false;
            this.removingDevice = {};
        },
        isSortedBy(field) {
            return this.sortBy === field || this.previousSortBy === field;
        },
        removeDeviceFromBuild() {
            const buildId = this.build.id;

            Builds.removeDeviceFromBuild(buildId, this.removingDevice.id).then(
                () => {
                    EventBus.$emit('item-removed');
                    this.$parent.getBuildData(buildId);
                }
            );
        },
        showRemoveDeviceModal(device) {
            this.removingDevice = device;
            this.removeDevice = true;
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
            if (this.devices && this.devices.length) {
                return this.devices.filter(device => device.graduated === true)
                    .length;
            }

            return 0;
        },
        devicesValidated() {
            if (this.devices && this.devices.length) {
                return this.devices.filter(device => device.validated === true)
                    .length;
            }

            return 0;
        },
        filteredDevices() {
            let devices = this.build.devices;

            if (devices && devices.length) {
                if (this.searchText) {
                    const searchText = this.searchText.toLowerCase();

                    return devices.reduce((acc, device) => {
                        const serialNumber = device.serial_number.toLowerCase();

                        if (search(searchText, serialNumber)) {
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
                }
            }

            return devices;
        },
    },
    created() {
        this.devices =
            this.build && this.build.devices ? this.build.devices : [];

        EventBus.$on('close-modal:remove-item', () => {
            this.closeModal();
        });

        EventBus.$on('remove-item:device', () => {
            this.removeDeviceFromBuild();
        });
    },
    mounted() {
        this.sortedDevices = this.build.devices;
    },
};
</script>
