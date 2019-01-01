<template>
    <div class="modal" id="device-editor-modal">
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Assign Rack {{ activeRack.name }}</p>
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
                                    <span class="icon is-lef">
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
import { setRackLayout } from '../../api/workspaces.js';

export default {
    props: {
        deviceSlots: {
            required: true,
        },
        currentWorkspace: {
            required: true,
        },
        activeRack: {
            required: true,
        },
    },
    data() {
        return {
            assignments: [],
            duplicateSerials: [],
        };
    },
    methods: {
        closeModal() {

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

            if (Object.keys(this.duplicateSerials.length === 0)) {
                event.target.classList.add("is-loading");

                setRackLayout(this.activeRack.id, layout)
                    .then(() => {
                        Promise.all(
                            Object.values(assignments).map(assignment => {
                                if (!assignment.assetTag)
                                    return Promise.resolve();

                                const device = new Device(assignment.id);
                                return device.setAssetTag(assignment.assetTag);
                            })
                        ).then(() => {
                            this.closeModal();
                        });
                    });
            }
        },
    },
};
</script>
