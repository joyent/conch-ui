<template>
    <div class="storage-tab">
        <Spinner v-if="!hasDisks" />
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
            <tr :class="{ 'is-selected': revealDetails }" v-for="(disk, index) in sortedDisks" :key="index" @click="revealDetails = !revealDetails" style="cursor: pointer">
                <td>
                    <div class="icon">
                        <i class="fas fa-caret-down" v-if="revealDetails"></i>
                        <i class="fas fa-caret-right" v-else></i>
                    </div>
                </td>
                <td>{{ disk.disk.health }}</td>
                <td>{{ disk.disk.id }}</td>
                <td>{{ disk.disk.enclosure }}</td>
                <td>{{ disk.disk.hba }}</td>
                <td>{{ disk.disk.slot }}</td>
            </tr>
            <tr v-if="revealDetails" v-for="(disk, index) in sortedDisks" :key="index">
                <td></td>
                <td colspan="5">
                    <div class="content">
                        <table class="table is-narrow is-marginless">
                            <tbody>
                                <tr>
                                    <td class="has-text-weight-semibold">Vendor</td>
                                    <td>{{ disk.disk.vendor }}</td>
                                </tr>
                                <tr>
                                    <td class="has-text-weight-semibold">Model</td>
                                    <td>{{ disk.disk.model }}</td>
                                </tr>
                                <tr>
                                    <td class="has-text-weight-semibold">Size</td>
                                    <td>{{ disk.disk.size }}</td>
                                </tr>
                                <tr>
                                    <td class="has-text-weight-semibold">Drive Type</td>
                                    <td>{{ disk.disk.drive_type }}</td>
                                </tr>
                                <tr>
                                    <td class="has-text-weight-semibold">Transport</td>
                                    <td>{{ disk.disk.transport }}</td>
                                </tr>
                                <tr>
                                    <td class="has-text-weight-semibold">Firmware</td>
                                    <td>{{ disk.disk.firmware }}</td>
                                </tr>
                                <tr>
                                    <td class="has-text-weight-semibold">Temperature</td>
                                    <td>{{ disk.disk.temperature }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
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
import Spinner from '../components/Spinner.vue';
import isEmpty from 'lodash/isEmpty';
import { mapState } from 'vuex';

export default {
    components: {
        Spinner,
    },
    data() {
        return {
            revealDetails: false,
        };
    },
    computed: {
        ...mapState([
            'activeDevice',
        ]),
        disks() {
            const activeDevice = this.activeDevice;

            return activeDevice.latest_report && activeDevice.latest_report.disks ? activeDevice.latest_report.disks : {};
        },
        hasDisks() {
            return !isEmpty(this.disks);
        },
        sortedDisks() {
            return Object.entries(this.disks)
                .map(([id, disk]) => {
                    disk.id = id;

                    return {
                        sortKey: 100 * (parseInt(disk.hba) || 0) + (parseInt(disk.slot) || 0),
                        disk
                    }
                })
                .sort((a, b) => a.sortKey - b.sortKey);
        }
    },
};
</script>
