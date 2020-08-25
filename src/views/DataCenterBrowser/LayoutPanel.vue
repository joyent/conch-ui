<template>
    <div class="layout-panel">
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
                        v-model="searchText"
                    />
                    <span class="icon is-small is-left">
                        <i class="fas fa-search"></i>
                    </span>
                </p>
            </div>
            <p class="panel-tabs" v-if="filteredSlots.length > 0">
                <a
                    v-for="progress in availableDeviceProgress"
                    :key="progress"
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
                    Rack Phase:
                    <span class="is-capitalized">{{ rackLayout.phase }}</span>
                </p>
                <a
                    class="button update-phase is-small is-primary"
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
            <table
                class="table is-fullwidth is-hoverable"
                v-if="filteredSlots.length > 0"
            >
                <thead>
                    <tr>
                        <th>Slot</th>
                        <th></th>
                        <th>Product Name</th>
                        <th class="has-text-right">Assigned Device</th>
                        <th class="has-text-right">Asset Tag</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        :class="{
                            'is-selected':
                                slot.occupant &&
                                highlightDeviceId &&
                                slot.occupant.id === highlightDeviceId,
                        }"
                        v-for="slot in filteredSlots"
                        :key="slot.id"
                        @click="activateDevice(slot)"
                        style="cursor: pointer;"
                    >
                        <td>{{ slot.id }}</td>
                        <td>
                            <ProgressIcon :progress="slot.progress" />
                        </td>
                        <td>{{ slot.hardware_product_name }}</td>
                        <td class="has-text-right">
                            <span
                                class="has-text-light"
                                v-if="
                                    slot.occupant && slot.occupant.serial_number
                                "
                            >
                                {{ slot.occupant.serial_number }}
                            </span>
                            <span class="has-text-grey" v-else>
                                N/A
                            </span>
                        </td>
                        <td class="has-text-right">
                            <span
                                class="has-text-grey-light"
                                v-if="slot.occupant && slot.occupant.asset_tag"
                            >
                                {{ slot.occupant.asset_tag }}
                            </span>
                            <span class="has-text-grey" v-else>
                                N/A
                            </span>
                        </td>
                        <td>
                            <span
                                v-if="
                                    slot.occupant &&
                                        slot.occupant.settings &&
                                        slot.occupant.settings.firmware &&
                                        slot.occupant.settings.firmware ===
                                            'updating'
                                "
                                class="tag is-info"
                            >
                                Firmware Updating
                            </span>
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
                        <th></th>
                    </tr>
                </tfoot>
            </table>
            <p
                class="panel-block"
                v-else-if="filteredSlots.length === 0 && searchText"
                style="justify-content: center;"
            >
                No devices found
            </p>
        </nav>
        <transition name="fade">
            <EditLayoutModal
                v-if="editLayout"
                :device-slots="normalizedSlots"
            />
        </transition>
        <transition name="fade">
            <PhaseUpdateModal
                :item="'rack'"
                :item-data="rackLayout"
                v-if="updatingPhase"
            />
        </transition>
    </div>
</template>

<script>
import moment from 'moment';
import search from 'fuzzysearch';
import isEmpty from 'lodash/isEmpty';
import PhaseUpdateModal from '@src/views/components/PhaseUpdateModal.vue';
import EditLayoutModal from './EditLayoutModal.vue';
import ProgressIcon from '@views/components/ProgressIcon.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        EditLayoutModal,
        PhaseUpdateModal,
        ProgressIcon,
    },
    data() {
        return {
            searchText: '',
            editLayout: false,
            selectedProgress: 'all',
            updatingPhase: false,
        };
    },
    methods: {
        ...mapActions(['setActiveDevice', 'setRackLayout']),
        activateDevice(slot) {
            const device = slot.occupant;

            this.setActiveDevice(device);
            this.$router.push({
                name: 'device',
                params: { deviceId: device.id },
            });
        },
        closeModal() {
            this.editLayout = false;
            this.updatingPhase = false;
        },
        getDeviceProgress(device) {
            if (device == null) {
                return 'unassigned';
            } else if (device.graduated) {
                return 'graduated';
            } else if (device.validated) {
                return 'validated';
            } else if (device.health.toLowerCase() === 'fail') {
                return 'failing';
            } else if (
                moment().diff(moment(device.last_seen), 'second') <= 300
            ) {
                return 'active';
            }

            return 'in progress';
        },
        openModal() {
            this.editLayout = true;
        },
    },
    computed: {
        ...mapState(['highlightDeviceId', 'rackLayout']),
        availableDeviceProgress() {
            return Array.from(
                Object.keys(this.rackLayout.slots || {}).reduce(
                    (acc, slotId) => {
                        const occupant = this.rackLayout.slots[slotId].occupant;

                        if (!isEmpty(occupant)) {
                            acc.add(this.getDeviceProgress(occupant));
                        } else {
                            acc.add('unassigned');
                        }

                        return acc;
                    },
                    new Set(['all'])
                )
            ).sort();
        },
        filteredSlots() {
            return this.normalizedSlots.filter(slot => {
                const occupant = slot.occupant;
                const progressFilter =
                    this.selectedProgress === 'all' ||
                    this.selectedProgress === this.getDeviceProgress(occupant);
                let searchFilter;

                if (occupant) {
                    const searchText = this.searchText
                        ? this.searchText.toLowerCase()
                        : '';
                    let deviceId = '';
                    let assetTag = '';

                    if (occupant.id) {
                        deviceId = occupant.id.toLowerCase();
                    }

                    if (occupant.asset_tag) {
                        assetTag = occupant.asset_tag.toLowerCase();
                    }

                    searchFilter =
                        search(searchText, deviceId) ||
                        search(searchText, assetTag);
                }

                return progressFilter && searchFilter;
            });
        },
        normalizedSlots() {
            if (!isEmpty(this.rackLayout.slots)) {
                return Object.keys(this.rackLayout.slots)
                    .reverse()
                    .map(slotId => {
                        const slot = this.rackLayout.slots[slotId];
                        const occupant = slot.occupant;

                        slot.id = slotId;
                        slot.progress = !isEmpty(occupant)
                            ? this.getDeviceProgress(occupant)
                            : 'unassigned';

                        return slot;
                    });
            }

            return [];
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
