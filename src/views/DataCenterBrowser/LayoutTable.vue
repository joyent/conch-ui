<template>
    <table class="table is-fullwidth is-hoverable">
        <thead>
            <tr>
                <th>Slot</th>
                <th></th>
                <th>Product Name</th>
                <th class="has-text-right">Assigned Device</th>
                <th class="has-text-right">Asset Tag</th>
            </tr>
        </thead>
        <tbody>
            <tr
                :class="{ 'is-selected': slot.occupant && highlightDeviceId && slot.occupant.id === highlightDeviceId }"
                v-for="(slot, index) in deviceSlots"
                :key="index"
                @click="activateDevice(slot)"
                style="cursor: pointer;"
            >
                <th>{{ slot.id }}</th>
                <td>
                    <p>
                        <ProgressIcon :progress="slot.progress" />
                    </p>
                </td>
                <td>{{ slot.name }}</td>
                <td class="has-text-right ">
                    <span class="has-text-light" v-if="slot.occupant">{{ slot.occupant.id }}</span>
                </td>
                <td class="has-text-right">
                    <span class="has-text-grey-light" v-if="slot.occupant">{{ slot.occupant.asset_tag }}</span>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th>Slot</th>
                <th></th>
                <th>Product Name</th>
                <th class="has-text-right">Assigned Device</th>
                <th class="has-text-right">Asset Tag</th>
            </tr>
        </tfoot>
    </table>
</template>

<script>
import ProgressIcon from '../components/ProgressIcon.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import { EventBus } from '../../eventBus.js';
import { getDeviceDetails, getDeviceSettings, getDeviceValidations } from '../../api/device.js';

export default {
    props: {
        deviceSlots: {
            required: true,
        },
    },
    components: {
        ProgressIcon,
    },
    methods: {
        ...mapActions([
            'setActiveDevice',
            'setActiveDeviceDetails',
            'setActiveDeviceSettings',
            'setActiveDeviceValidations',
        ]),
        activateDevice(slot) {
            const device = slot.occupant;

            if (device) {
                this.setActiveDevice(device);
                this.setDeviceDetails(device.id);
                this.setDeviceSettings(device.id);
                this.setDeviceValidations(device.id);
            }

            EventBus.$emit('openModal:deviceModal');
        },
        setDeviceDetails(activeDeviceId) {
            getDeviceDetails(activeDeviceId)
                .then(response => {
                    this.setActiveDeviceDetails(response.data);
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
        ]),
        ...mapState([
            'highlightDeviceId',
        ]),
    },
};
</script>
