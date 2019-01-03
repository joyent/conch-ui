<template>
    <div class="layout-panel">
        <nav class="panel">
            <div class="panel-heading has-text-centered">Rack {{ activeRack.name }}</div>
            <div class="panel-block">
                <p class="control has-icons-left">
                    <input type="text" class="input is-small" placeholder="Search Device" v-model="deviceSearchText">
                    <span class="icon is-small is-left">
                        <i class="fas fa-search"></i>
                    </span>
                </p>
            </div>
            <p class="panel-tabs">
                <a
                    v-for="(progress, index) in availableDeviceProgress"
                    :key="index"
                    @click="selectedProgress = progress"
                    :class="{ 'is-active': selectedProgress === progress }"
                >
                    {{ progress }}
                </a>
            </p>
            <div class="panel-block">
                <button class="button is-primary is-outlined is-fullwidth is-small" @click="openModal">Edit Assignments</button>
            </div>
            <Spinner v-if="rackLoading" />
            <LayoutTable v-else :device-slots="filteredSlots" :highlight-device-id="highlightDeviceId" />
        </nav>
        <EditLayoutModal :active-rack="activeRack" :current-workspace="currentWorkspace" :device-slots="normalizedSlots" />
    </div>
</template>

<script>
import search from "fuzzysearch";
import EditLayoutModal from './EditLayoutModal.vue';
import LayoutTable from './LayoutTable.vue';
import Spinner from '../components/Spinner.vue';
import { EventBus } from '../../eventBus.js';
import { deviceToProgress } from './util.js';
import { mapState, mapGetters } from 'vuex';

export default {
    props: {
        highlightDeviceId: {
            required: false,
        },
        rackLayout: {
            required: true,
        },
        rackLoading: {
            required: true,
            default: false,
        },
    },
    components: {
        EditLayoutModal,
        LayoutTable,
        Spinner,
    },
    data() {
        return {
            deviceSearchText: '',
            selectedProgress: 'all',
            showModal: false,
        };
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
        ]),
        ...mapState([
            'activeRack',
            'currentWorkspace',
        ]),
        availableDeviceProgress() {
            return Array.from(
                Object.keys(this.rackLayout.slots || {}).reduce((acc, slotId) => {
                    let occupant = this.rackLayout.slots[slotId].occupant;

                    if (occupant) {
                        acc.add(deviceToProgress(occupant));
                    } else {
                        acc.add('unassigned');
                    }

                    return acc;
                }, new Set(['all']))
            ).sort();
        },
        deviceSearchTextLowerCase() {
            return this.deviceSearchText.toLowerCase();
        },
        filteredSlots() {
            return this.normalizedSlots.filter(slot => this.deviceFilter(slot.occupant));
        },
        normalizedSlots() {
            return Object.keys(this.rackLayout.slots || {})
                .reverse()
                .map(slotId => {
                    let slot = this.rackLayout.slots[slotId];
                    let occupant = slot.occupant;
                    return {
                        id: slotId,
                        name: slot.name,
                        progress: occupant ? deviceToProgress(occupant) : 'unassigned',
                        occupant: occupant
                    };
                });
        },
    },
    methods: {
        deviceFilter(occupant) {
            const deviceId = occupant ? occupant.id.toLowerCase() : '';
            const assetTag = occupant && occupant.asset_tag ? occupant.asset_tag.toLowerCase() : '';
            const progressFilter = this.selectedProgress === 'all' || this.selectedProgress === deviceToProgress(occupant);
            const searchFilter = search(this.deviceSearchTextLowerCase, deviceId) || search(this.deviceSearchTextLowerCase, assetTag);

            return progressFilter && searchFilter;
        },
        openModal() {
            EventBus.$emit('openModal:editLayoutModal');
        },
    },
};
</script>
