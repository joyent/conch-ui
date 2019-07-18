<template>
    <div class="storage-tab">
        <p class="has-text-centered" v-if="isEmpty(this.disks)">
            No storage details available.
        </p>
        <Spinner v-else-if="this.sortedDisks.length < 1" />
        <table class="table is-narrow is-fullwidth" v-else>
            <thead>
                <tr>
                    <th></th>
                    <th>Health</th>
                    <th>Serial Number</th>
                    <th>Enclosure</th>
                    <th>HBA</th>
                    <th>Slot Number</th>
                </tr>
            </thead>
            <template v-for="(disk, index) in sortedDisks">
                <tr
                    :class="{ 'is-selected': isRowSelected(index) }"
                    class="row"
                    @click="revealDiskDetails(index)"
                    style="cursor: pointer"
                    :key="index"
                >
                    <td>
                        <div class="icon">
                            <i
                                class="fas fa-caret-down"
                                v-if="isRowSelected(index)"
                            ></i>
                            <i class="fas fa-caret-right" v-else></i>
                        </div>
                    </td>
                    <td>{{ disk.health }}</td>
                    <td>{{ disk.id }}</td>
                    <td>{{ disk.enclosure }}</td>
                    <td>{{ disk.hba }}</td>
                    <td>{{ disk.slot }}</td>
                </tr>
                <tr v-if="isRowSelected(index)" :key="`${index}a`">
                    <td></td>
                    <td colspan="5">
                        <div class="content">
                            <table class="table is-narrow is-marginless">
                                <tbody>
                                    <tr>
                                        <td class="has-text-weight-semibold">
                                            Vendor
                                        </td>
                                        <td>{{ disk.vendor }}</td>
                                    </tr>
                                    <tr>
                                        <td class="has-text-weight-semibold">
                                            Model
                                        </td>
                                        <td>{{ disk.model }}</td>
                                    </tr>
                                    <tr>
                                        <td class="has-text-weight-semibold">
                                            Size
                                        </td>
                                        <td>{{ disk.size }}</td>
                                    </tr>
                                    <tr>
                                        <td class="has-text-weight-semibold">
                                            Drive Type
                                        </td>
                                        <td>{{ disk.drive_type }}</td>
                                    </tr>
                                    <tr>
                                        <td class="has-text-weight-semibold">
                                            Transport
                                        </td>
                                        <td>{{ disk.transport }}</td>
                                    </tr>
                                    <tr>
                                        <td class="has-text-weight-semibold">
                                            Firmware
                                        </td>
                                        <td>{{ disk.firmware }}</td>
                                    </tr>
                                    <tr>
                                        <td class="has-text-weight-semibold">
                                            Temperature
                                        </td>
                                        <td>{{ disk.temperature }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </template>
            <tfoot>
                <tr>
                    <th></th>
                    <th>Health</th>
                    <th>Serial Number</th>
                    <th>Enclosure</th>
                    <th>HBA</th>
                    <th>Slot Number</th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
import Spinner from '@views/components/Spinner.vue';
import isEmpty from 'lodash/isEmpty';
import { mapState } from 'vuex';

export default {
    components: {
        Spinner,
    },
    data() {
        return {
            headers: [
                '',
                'Health',
                'Serial Number',
                'Enclosure',
                'HBA',
                'Slot Number',
            ],
            diskDetailsRows: [],
        };
    },
    methods: {
        isEmpty,
        isRowSelected(index) {
            return this.diskDetailsRows.indexOf(index) >= 0;
        },
        revealDiskDetails(index) {
            const indexPos = this.diskDetailsRows.indexOf(index);

            if (indexPos === -1) {
                this.diskDetailsRows.push(index);
            } else {
                this.diskDetailsRows.splice(indexPos, 1);
            }
        },
    },
    computed: {
        ...mapState(['activeDeviceDetails']),
        disks() {
            const activeDeviceDetails = this.activeDeviceDetails;

            return activeDeviceDetails.latest_report &&
                activeDeviceDetails.latest_report.disks
                ? activeDeviceDetails.latest_report.disks
                : {};
        },
        sortedDisks() {
            return Object.entries(this.disks)
                .map(([id, disk]) => {
                    disk.id = id;

                    return {
                        drive_type: disk.drive_type,
                        enclosure: disk.enclosure,
                        firmware: disk.firmware,
                        hba: disk.hba,
                        health: disk.health,
                        id: disk.id,
                        model: disk.model,
                        size: disk.size,
                        slot: disk.slot,
                        sortKey:
                            100 * (parseInt(disk.hba) || 0) +
                            (parseInt(disk.slot) || 0),
                        temperature: disk.temperature,
                        transport: disk.transport,
                        vendor: disk.vendor,
                    };
                })
                .sort((a, b) => a.sortKey - b.sortKey);
        },
    },
};
</script>
