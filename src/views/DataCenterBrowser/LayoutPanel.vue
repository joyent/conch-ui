<template>
    <div class="layout-panel">
        <nav class="panel">
            <div class="panel-heading">Rack {{ activeRack.name }}</div>
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
                    style="white-space:pre;"
                    :class="{ 'is-active': selectedProgress === progress }"
                >
                    {{ progress }}
                </a>
            </p>
            <div class="panel-block">
                <button class="button is-primary is-outlined is-fullwidth is-small" @click="openModal">Edit Assignments</button>
            </div>
            <Spinner v-if="rackLoading" />
            <LayoutTable
                v-else
                :device-slots="filteredSlots"
                :active-device-id="activeDeviceId"
                :highlight-device-id="highlightDeviceId"
            />
        </nav>
        <EditLayoutModal :device-solts="normalizedSlots" :active-rack="activeRack" :current-workspace="currentWorkspace"
        />
    </div>
</template>

<script>
import LayoutTable from './LayoutTable.vue';
import Spinner from '../components/Spinner.vue';
import { deviceToProgress } from './util.js';

export default {
    props: {
        activeDeviceId: {},
        activeRack: {},
        currentWorkspace: {},
        highlightDeviceId: {},
        rackLayout: {},
        rackLoading: false,
    },
    components: {
        LayoutTable,
        Spinner,
    },
    data() {
        return {
            availableDeviceProgress: '',
            deviceSearchText: '',
            filteredSlots: '',
            normalizedSlots: '',
            selectedProgress: 'all',
            showModal: false,
        };
    },
    computed: {
        deviceSearchTextLowerCase() {
            return this.deviceSearchText.map(t => t.toLowerCase());
        },
    },
    methods: {
        openModal() {

        },
    },
};
</script>
