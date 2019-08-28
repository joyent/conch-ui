<template>
    <div class="layout-panel" v-if="hasRackLayout">
        <nav class="panel">
            <div class="panel-heading has-text-centered">
                Rack {{ rackLayout.name }}
            </div>
            <div class="panel-block">
                <p class="control has-icons-left">
                    <input
                        type="text"
                        class="input is-small"
                        placeholder="Search Device"
                        v-model="deviceSearchText"
                    >
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
            <div
                class="panel-block"
                style="justify-content: center; position: relative;"
            >
                <p class="rack-phase">
                    Rack Phase: <span class="is-capitalized">{{ rackLayout.phase }}</span>
                </p>
                <a
                    class="button update-phase is-small is-primary"
                    v-if="userHasPermissions"
                    @click="updatingPhase = true"
                    style="position: absolute; right: 12px;"
                >
                    Update Rack Phase
                </a>
            </div>
            <div class="panel-block">
                <button
                    class="button is-primary is-fullwidth"
                    @click="openModal()"
                >
                    Edit Assignments
                </button>
            </div>
            <Spinner v-if="rackLoading" />
            <table class="table is-fullwidth is-hoverable" v-else>
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
                        v-for="(slot, index) in filteredSlots"
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
        </nav>
        <EditLayoutModal v-if="editLayout" :device-slots="normalizedSlots" />
        <transition name="fade">
            <PhaseUpdateModal
                :item="'rack'"
                :itemData="rackLayout"
                v-if="updatingPhase"
            />
        </transition>
    </div>
</template>

<script>
import PhaseUpdateModal from '@src/views/components/PhaseUpdateModal.vue';
import EditLayoutModal from './EditLayoutModal.vue';
import ProgressIcon from '@views/components/ProgressIcon.vue';
import Spinner from '@views/components/Spinner.vue';
import isEmpty from 'lodash/isEmpty';
import search from "fuzzysearch";
import { EventBus } from '@src/eventBus.js';
import { deviceToProgress } from '@views/shared/utils.js';
import { mapActions, mapState } from 'vuex';

export default {
    props: {
        rackLoading: {
            required: true,
            default: false,
        },
    },
    components: {
        EditLayoutModal,
        PhaseUpdateModal,
        ProgressIcon,
        Spinner,
    },
    data() {
        return {
            deviceSearchText: '',
            editLayout: false,
            selectedProgress: 'all',
            updatingPhase: false,
        };
    },
    methods: {
        ...mapActions([
            'setActiveDevice',
        ]),
        activateDevice(slot) {
            const device = slot.occupant;

            if (device) {
                this.setActiveDevice(device);
            }

            EventBus.$emit('openModal:deviceModal');
        },
        closeModal() {
            this.editLayout = false;
            this.updatingPhase = false;
        },
        deviceFilter(occupant) {
            const deviceId = occupant ? occupant.id.toLowerCase() : '';
            const assetTag = occupant && occupant.asset_tag ? occupant.asset_tag.toLowerCase() : '';
            const progressFilter = this.selectedProgress === 'all' || this.selectedProgress === deviceToProgress(occupant);
            const searchFilter = search(this.deviceSearchTextLowerCase, deviceId) || search(this.deviceSearchTextLowerCase, assetTag);

            return progressFilter && searchFilter;
        },
        openModal() {
            this.editLayout = true;
        },
    },
    computed: {
        ...mapState([
            'currentWorkspace',
            'highlightDeviceId',
            'rackLayout',
        ]),
        availableDeviceProgress() {
            return Array.from(
                Object.keys(this.rackLayout.slots || {}).reduce((acc, slotId) => {
                    const occupant = this.rackLayout.slots[slotId].occupant;

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
        hasRackLayout() {
            return !isEmpty(this.rackLayout);
        },
        normalizedSlots() {
            return Object.keys(this.rackLayout.slots || {})
                .reverse()
                .map(slotId => {
                    const slot = this.rackLayout.slots[slotId];
                    const occupant = slot.occupant;

                    return {
                        id: slotId,
                        name: slot.name,
                        progress: occupant ? deviceToProgress(occupant) : 'unassigned',
                        occupant: occupant
                    };
                });
        },
        userHasPermissions() {
            return this.currentWorkspace.role === 'admin' ||
                   this.currentWorkspace.role === 'rw';
        },
    },
    mounted() {
        EventBus.$on('closeModal:baseModal', () => {
            this.closeModal();
        });

        EventBus.$on('closeModal:editLayoutModal', () => {
            this.closeModal();
        });
    },
};
</script>
