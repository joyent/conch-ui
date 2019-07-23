<template>
    <div
        class="modal"
        :class="{ 'is-active': isActive }"
        id="device-editor-modal"
    >
        <div class="modal-background" @click="closeModal()"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title has-text-centered">
                    Assign Rack {{ rackLayout.name }}
                </p>
                <button
                    class="delete"
                    aria-label="close"
                    @click="closeModal()"
                    type="button"
                ></button>
            </header>
            <section class="modal-card-body">
                <table
                    class="table is-fullwidth is-marginless"
                    id="edit-layout-table"
                >
                    <thead>
                        <tr>
                            <th>Slot</th>
                            <th>Product Name</th>
                            <th class="has-text-right">
                                Device Identification
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(slot, index) in deviceSlots" :key="index">
                            <th>{{ slot.id }}</th>
                            <td>{{ slot.name }}</td>
                            <td class="has-text-right">
                                <div class="control has-icons-left">
                                    <input
                                        type="text"
                                        class="input is-small serial-number"
                                        placeholder="Serial Number"
                                        pattern="[a-zA-Z0-9]+"
                                        @input="
                                            serialNumberInput($event, slot.id)
                                        "
                                        :value="inputValue(slot, 'sn')"
                                    />
                                    <span class="icon is-left">
                                        <i class="fas fa-barcode"></i>
                                    </span>
                                    <div
                                        class="notification help is-danger is-paddingless has-text-centered"
                                        v-if="duplicateSerials[slot.id]"
                                        style="font-size: 0.75rem; margin: 0 0 4px;"
                                    >
                                        Device serial is duplicated
                                    </div>
                                </div>
                                <div class="control has-icons-left">
                                    <input
                                        type="text"
                                        class="input is-small asset-tag"
                                        placeholder="Asset Tag"
                                        pattern="[a-zA-Z0-9]+"
                                        :disabled="assignments[slot.id] == null"
                                        @input="assetTagInput($event, slot.id)"
                                        :value="inputValue(slot, 'at')"
                                    />
                                    <span class="icon is-left">
                                        <i class="fas fa-tag"></i>
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Slot</th>
                            <th>Product Name</th>
                            <th class="has-text-right">
                                Device Identification
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </section>
            <footer class="modal-card-foot">
                <div class="field is-grouped">
                    <p class="control">
                        <button
                            class="button save is-primary"
                            :class="{ 'is-loading': buttonLoading }"
                            @click="save()"
                            type="button"
                        >
                            Save
                        </button>
                    </p>
                    <p class="control">
                        <button
                            class="button cancel"
                            @click="closeModal()"
                            type="button"
                        >
                            Cancel
                        </button>
                    </p>
                </div>
            </footer>
        </div>
    </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { setAssetTag } from '@api/device.js';
import { setRackLayout } from '@api/workspaces.js';
import { EventBus } from '@src/eventBus.js';
import { mapGetters, mapState } from 'vuex';

export default {
    props: {
        deviceSlots: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            assignments: {},
            buttonLoading: false,
            duplicateSerials: [],
            isActive: false,
        };
    },
    computed: {
        ...mapGetters(['currentWorkspaceId']),
        ...mapState(['rackLayout']),
    },
    methods: {
        assetTagInput: debounce(function(event, slotId) {
            if (this.assignments[slotId]) {
                this.assignments[slotId].assetTag = event.target.value;
            }
        }, 750),
        closeModal() {
            EventBus.$emit('closeModal:editLayoutModal');
        },
        inputValue(slot, type) {
            const assignment = this.assignments[slot.id];

            if (assignment) {
                if (type === 'sn' && assignment.id) {
                    return assignment.id;
                } else if (type === 'at' && assignment.assetTag) {
                    return assignment.assetTag;
                }

                return '';
            } else {
                return '';
            }
        },
        refreshRackLayout(rackLayout) {
            EventBus.$emit('refreshRackLayout', rackLayout);
        },
        serialNumberInput: debounce(function(event, slotId) {
            if (this.assignments[slotId]) {
                this.assignments[slotId].id = event.target.value;
            }
        }, 750),
        save() {
            const layout = {};
            const duplicates = [];
            const assignments = this.assignments;

            Object.keys(assignments).forEach(slot => {
                if (layout[assignments[slot].id]) {
                    duplicates[slot] = true;
                    duplicates[layout[assignments[slot].id]] = true;
                }

                layout[assignments[slot].id] = slot;
            });

            this.duplicateSerials = duplicates;

            if (Object.keys(duplicates).length === 0) {
                this.buttonLoading = true;

                setRackLayout(
                    this.currentWorkspaceId,
                    this.rackLayout.id,
                    layout
                ).then(() => {
                    Promise.all(
                        Object.values(assignments).map(assignment => {
                            if (assignment.assetTag == null) {
                                return Promise.resolve();
                            }

                            return setAssetTag(
                                assignment.id,
                                assignment.assetTag
                            );
                        })
                    ).then(() => {
                        this.closeModal();
                        this.refreshRackLayout(this.rackLayout);
                        this.buttonLoading = false;
                    });
                });
            }
        },
    },
    created() {
        this.deviceSlots.map(slot => {
            const occupant = slot.occupant;
            if (occupant) {
                this.assignments[slot.id] = {
                    id: occupant.id,
                    assetTag: occupant.asset_tag,
                };
            }
        });
    },
    mounted() {
        EventBus.$on('closeModal:editLayoutModal', () => {
            this.isActive = false;
        });

        EventBus.$on('openModal:editLayoutModal', () => {
            this.isActive = true;
        });
    },
};
</script>
