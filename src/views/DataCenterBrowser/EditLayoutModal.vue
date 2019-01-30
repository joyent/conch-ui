<template>
    <div class="modal" :class="{ 'is-active': isActive }" id="device-editor-modal">
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title has-text-centered">Assign Rack {{ rackLayout.name }}</p>
                <button class="delete" aria-label="close" @click="closeModal"></button>
            </header>
            <section class="modal-card-body">
                <button class="button is-fullwidth is-primary" @click="save">Save</button>
                <table class="table is-fullwidth is-marginless" id="edit-layout-table">
                    <thead>
                        <tr>
                            <th>Slot</th>
                            <th>Product Name</th>
                            <th class="has-text-right">Device Identification</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(slot, index) in deviceSlots" :key="index">
                            <th>{{ slot.id }}</th>
                            <td>{{ slot.name }}</td>
                            <td class="has-text-right">
                                <div class="control has-icons-left">
                                    <input type="text" class="input is-small" placeholder="Serial Number" pattern="[a-zA-Z0-9]+">
                                    <span class="icon is-left">
                                        <i class="fas fa-barcode"></i>
                                        <p class="help is-danger" v-if="duplicateSerials[slot.id]">Device serial is duplicated</p>
                                    </span>
                                </div>
                                <div class="control has-icons-left">
                                    <input type="text" class="input is-small" placeholder="Asset Tag" pattern="[a-zA-Z0-9]+" :disabled="assignments[slot.id] == null">
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
                            <th class="has-text-right">Device Identification</th>
                        </tr>
                    </tfoot>
                </table>
                <button class="button is-fullwidth is-primary" @click="save">Save</button>
            </section>
        </div>
    </div>
</template>

<script>
import { setAssetTag } from '../../api/device.js';
import { setRackLayout } from '../../api/workspaces.js';
import { EventBus } from '../../eventBus.js';
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
    props: {
        deviceSlots: {
            required: true,
        },
    },
    data() {
        return {
            assignments: [],
            duplicateSerials: [],
            isActive: false,
        };
    },
    computed: {
        ...mapGetters([
            'currentWorkspaceId',
        ]),
        ...mapState([
            'rackLayout',
        ]),
    },
    methods: {
        ...mapActions([
            'clearRackLayout',
        ]),
        closeModal() {
            EventBus.$emit('closeModal:editLayoutModal');
        },
        save(event) {
                const layout = {};
                const duplicates = {};
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
                    // TODO: use :class to trigger this change
                    event.target.classList.add("is-loading");

                    setRackLayout(this.currentWorkspaceId, this.rackLayout.id, layout)
                        .then(() => {
                            Promise.all(
                                Object.values(assignments).map(assignment => {
                                    if (!assignment.assetTag) {
                                        return Promise.resolve();
                                    }

                                    return setAssetTag(assignment.id, assignment.assetTag);
                                })
                            ).then(() => {
                                this.closeModal();
                                this.clearRackLayout();
                            });
                        });
                }
        },
    },
    created() {
        this.deviceSlots.map(slot => {
            let occupant = slot.occupant;
            if (occupant) {
                this.assignments[slot.id] = {
                    id: occupant.id,
                    assetTag: occupant.asset_tag
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
