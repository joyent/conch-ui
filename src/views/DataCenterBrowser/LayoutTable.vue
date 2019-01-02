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
            <tr :class="{ 'is-selected': slot.occupant && highlightDeviceId && slot.occupant.id === highlightDeviceId }" v-for="(slot, index) in deviceSlots" :key="index" style="cursor: pointer;">
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
import ProgressIcon from './ProgressIcon.vue'

export default {
    props: {
        deviceSlots: {
            required: true,
        },
        activeDeviceId: {
            required: false,
        },
        highlightDeviceId: {
            required: false,
        },
    },
    components: {
        ProgressIcon,
    },
    data() {
        return {
            currentActiveDeviceId: '',
        };
    },
};
</script>
