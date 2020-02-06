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
import orderBy from 'lodash/orderBy';
import search from 'fuzzysearch';
import AddDeviceModal from './AddDeviceModal.vue';
import RemoveItemModal from './RemoveItemModal.vue';
import { EventBus } from '@src/eventBus.js';
import * as Builds from '@api/builds.js';
import { mapState, mapActions } from 'vuex';

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
    },
    data() {
        return {
            addDevice: false,
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
        ...mapActions(['setCurrentBuildDevices']),
        closeModal() {
            this.addDevice = false;
            this.removeDevice = false;
            this.removingDevice = {};
        },
        isSortedBy(field) {
            return this.sortBy === field || this.previousSortBy === field;
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
        ...mapState(['currentBuildDevices']),
        filteredDevices() {
            let devices = this.currentBuildDevices;

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
    },
};
</script>
