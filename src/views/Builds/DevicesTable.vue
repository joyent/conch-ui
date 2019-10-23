<template>
    <div class="devices-table-2">
        <div class="columns">
            <div class="column is-10 is-offset-1 box" style="margin-bottom: 0">
                <div class="my-table" style="flex-grow: 1">
                    <div class="control has-icons-left">
                        <input
                            type="text"
                            class="input search"
                            v-model="searchText"
                            placeholder="Search Devices"
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
                    <table class="table is-fullwidth">
                        <tbody>
                            <tr
                                :class="{
                                    'is-selected': isDeviceSelected(device),
                                }"
                                v-for="device in filteredDevices"
                                :key="device.id"
                            >
                                <td class="device-name">
                                    <span
                                        class="has-text-success adding"
                                        v-if="isDeviceSelected(device)"
                                    >
                                        {{ device.name }}
                                    </span>
                                    <span v-else>
                                        {{ device.name }}
                                    </span>
                                </td>
                                <td class="datacenter">
                                    {{ device.phase }}
                                </td>
                                <td class="has-text-right">
                                    <i
                                        class="material-icons has-text-danger"
                                        v-if="isDeviceSelected(device)"
                                        @click="removeDevice(device)"
                                    >
                                        close
                                    </i>
                                    <i
                                        class="material-icons has-text-success add-device"
                                        @click="addDevice(device)"
                                        v-else
                                    >
                                        add
                                    </i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style="padding: 20px;">
                    <div class="device-table-filter">
                        <p class="heading is-size-6">Filter Devices</p>
                        <label class="label">Phases</label>
                        <div class="select select-phases">
                            <select>
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
                        <label class="label">Graduated</label>
                        <div class="select select-graduated">
                            <select>
                                <option value="all">All</option>
                                <option value="graduated">Yes</option>
                                <option value="not-graduated">No</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import search from 'fuzzysearch';

export default {
    data() {
        return {
            searchText: '',
            selectedDevices: [],
            showCloseButton: false,
            devices: [
                {
                    name: 'Android-1',
                    graduated: false,
                    phase: 'integration',
                    validated: false,
                },
                {
                    name: 'Super Computer',
                    graduated: true,
                    phase: 'installation',
                    validated: false,
                },
                {
                    name: 'Cloud Rack',
                    graduated: true,
                    phase: 'diagnostics',
                    validated: true,
                },
                {
                    name: 'Very Cool Machine',
                    graduated: false,
                    phase: 'integration',
                    validated: false,
                },
                {
                    name: 'Device-1szv33a',
                    graduated: true,
                    phase: 'decommissioned',
                    validated: false,
                },
                {
                    name: 'Android-2',
                    graduated: false,
                    phase: 'production',
                    validated: true,
                },
            ],
        };
    },
    methods: {
        addDevice(device) {
            this.selectedDevices.push(device);
        },
        isDeviceSelected(device) {
            return this.selectedDevices.indexOf(device) !== -1;
        },
        removeDevice(device) {
            const index = this.selectedDevices.indexOf(device);
            this.selectedDevices.splice(index, 1);
        },
    },
    computed: {
        filteredDevices() {
            let devices = this.devices;
            const searchText = this.searchText.toLowerCase();

            if (searchText) {
                return devices.reduce((acc, device) => {
                    const name = device.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(device);
                    }

                    return acc;
                }, []);
            }

            return devices;
        },
    },
};
</script>
