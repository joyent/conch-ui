<template>
    <div class="modal edit-layout-modal" :class="{ 'is-active': isActive }">
        <div class="modal-background" @click="closeModal()"></div>
        <div class="modal-card">
            <article
                class="message is-success update-success"
                v-if="isSuccess && !noChanges"
            >
                <div class="message-header">
                    <i class="material-icons">check_circle</i>
                    <p>Assignment successfully updated!</p>
                </div>
            </article>
            <article class="message is-info no-changes" v-if="noChanges">
                <div class="message-header">
                    <i class="material-icons">info</i>
                    <p>
                        No changes made
                    </p>
                </div>
            </article>
            <article
                v-if="invalidSerialNumber"
                class="message is-danger no-changes"
            >
                <div class="message-header">
                    <i class="material-icons">error</i>
                    <p>
                        Invalid serial number
                    </p>
                </div>
            </article>
            <article
                v-if="duplicateSerialNumber"
                class="message is-danger no-changes"
            >
                <div class="message-header">
                    <i class="material-icons">error</i>
                    <p>
                        Duplicate serial number
                    </p>
                </div>
            </article>
            <article
                v-if="duplicateAssetTag"
                class="message is-danger no-changes"
            >
                <div class="message-header">
                    <i class="material-icons">error</i>
                    <p>
                        Duplicate serial number
                    </p>
                </div>
            </article>
            <header class="modal-card-head">
                <div class="modal-card-title has-text-centered">
                    Assign Rack {{ rackLayout.name }}
                </div>
                <button class="delete" @click="closeModal()" type="button">
                </button>
            </header>
            <section class="modal-card-body">
                <table class="table is-fullwidth is-hoverable is-marginless">
                    <thead>
                        <th>Slot</th>
                        <th>Product Name</th>
                        <th>Serial Number</th>
                        <th>Asset Tag</th>
                        <th></th>
                    </thead>
                    <tfoot v-if="deviceSlots.length > 10">
                        <th>Slot</th>
                        <th>Product Name</th>
                        <th>Serial Number</th>
                        <th>Asset Tag</th>
                        <th></th>
                    </tfoot>
                    <tbody>
                        <tr
                            v-for="assignment in assignments"
                            :key="assignment.slot"
                            :class="{
                                'is-editing': isEditingAssignment(
                                    assignment.slot
                                ),
                            }"
                        >
                            <td>{{ assignment.slot }}</td>
                            <td>{{ assignment.name }}</td>
                            <template
                                v-if="isEditingAssignment(assignment.slot)"
                            >
                                <td>
                                    <input
                                        type="text"
                                        class="input"
                                        v-model.trim="assignment.id"
                                        placeholder="Serial Number"
                                        @keyup.enter="
                                            saveModifiedAssignmentassignment(
                                                assignment
                                            )
                                        "
                                    />
                                </td>
                                <td class="asset-tag">
                                    <input
                                        type="text"
                                        class="input"
                                        v-model.trim="assignment.assetTag"
                                        placeholder="Asset Tag"
                                        @keyup.enter="
                                            saveModifiedAssignmentassignment(
                                                assignment
                                            )
                                        "
                                    />
                                </td>
                            </template>
                            <template v-else>
                                <td class="serial-number" v-if="assignment.id">
                                    {{ assignment.id }}
                                </td>
                                <td class="serial-number" v-else>
                                    None
                                </td>
                                <td
                                    class="asset-tag"
                                    v-if="assignment.assetTag"
                                >
                                    {{ assignment.assetTag }}
                                </td>
                                <td class="asset-tag" v-else>
                                    None
                                </td>
                            </template>
                            <td class="edit">
                                <div
                                    class="button-group"
                                    v-if="isEditingAssignment(assignment.slot)"
                                >
                                    <a
                                        v-if="
                                            isEditingAssignment(assignment.slot)
                                        "
                                        class="button is-success"
                                        :class="{ 'is-loading': isLoading }"
                                        @click="
                                            saveModifiedAssignment(assignment)
                                        "
                                    >
                                        <i class="material-icons">check</i>
                                    </a>
                                    <a
                                        v-if="
                                            isEditingAssignment(assignment.slot)
                                        "
                                        class="button is-danger"
                                        @click="
                                            cancelEditAssignment(
                                                assignment.slot
                                            )
                                        "
                                    >
                                        <i class="material-icons">close</i>
                                    </a>
                                </div>
                                <a
                                    class="button is-info is-fullwidth edit"
                                    @click="editAssignment(assignment.slot)"
                                    v-else
                                >
                                    Edit
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <footer class="modal-card-foot">
                <a class="button is-fullwidth" @click="closeModal()">Close</a>
            </footer>
        </div>
    </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapState } from 'vuex';
import { EventBus } from '@src/eventBus.js';
import { updateRackAssignment } from '@api/rack.js';
import { getDevices, getRackById } from '@api/workspaces';

export default {
    props: {
        deviceSlots: {
            required: true,
            type: Array,
        },
    },
    data() {
        return {
            assignments: [],
            assignmentsEditing: [],
            duplicateAssetTag: false,
            duplicateSerialNumber: false,
            invalidSerialNumber: false,
            isActive: true,
            isLoading: false,
            isSuccess: false,
            noChanges: false,
        };
    },
    computed: {
        ...mapState(['currentWorkspace', 'devices', 'rackLayout']),
    },
    methods: {
        ...mapActions(['setDevices', 'setRackLayout']),
        cancelEditAssignment(slotId) {
            const index = this.assignmentsEditing.indexOf(slotId);

            this.assignmentsEditing.splice(index, 1);

            this.clearErrors();
        },
        clearErrors() {
            this.duplicateAssetTag = false;
            this.duplicateSerialNumber = false;
            this.invalidSerialNumber = false;
            this.noChanges = false;
        },
        closeModal() {
            this.isActive = false;

            EventBus.$emit('closeModal:editLayoutModal');
        },
        editAssignment(slotId) {
            const index = this.assignmentsEditing.indexOf(slotId);

            if (index === -1) {
                this.assignmentsEditing.push(slotId);
            }
        },
        isEditingAssignment(slotId) {
            return this.assignmentsEditing.indexOf(slotId) !== -1;
        },
        saveModifiedAssignment(assignment) {
            this.isLoading = true;
            this.clearErrors();

            const originalAssetTag = assignment.originalAssetTag;

            if (
                assignment.assetTag === originalAssetTag &&
                originalAssetTag !== '' &&
                assignment.id === assignment.originalSerialNumber
            ) {
                this.cancelEditAssignment(assignment.slot);
                this.isLoading = false;
                this.noChanges = true;

                setTimeout(() => {
                    this.noChanges = false;
                }, 2000);
            } else if (this.validateInput(assignment)) {
                updateRackAssignment(this.rackLayout.id, [
                    {
                        device_asset_tag: assignment.assetTag,
                        device_id: assignment.id,
                        device_serial_number: assignment.serialNumber,
                        rack_unit_start: assignment.rackUnitStart,
                    },
                ]).then(() => {
                    getRackById(
                        this.currentWorkspace.id,
                        this.rackLayout.id
                    ).then(response => {
                        this.setRackLayout(response);

                        getDevices(this.currentWorkspace.id).then(response => {
                            this.setDevices(response.data);
                        });

                        this.cancelEditAssignment(assignment.slot);
                        this.isLoading = false;
                        this.isSuccess = true;

                        setTimeout(() => {
                            this.isSuccess = false;
                        }, 2000);
                    });
                });
            } else {
                this.isLoading = false;
            }
        },
        validateInput(assignment) {
            const assetTag = assignment.assetTag;
            const serialNumber = assignment.id;
            let validInput = true;

            if (
                !serialNumber ||
                serialNumber.indexOf('/') !== -1 ||
                serialNumber.indexOf('.') !== -1 ||
                serialNumber.indexOf(' ') !== -1
            ) {
                this.invalidSerialNumber = true;
                validInput = false;
            }

            for (let i = 0; i < this.devices.length; i++) {
                const device = this.devices[i];

                if (
                    device.asset_tag === assetTag &&
                    assetTag !== assignment.originalAssetTag
                ) {
                    this.duplicateAssetTag = true;
                    validInput = false;
                }

                if (
                    device.id === serialNumber &&
                    serialNumber !== assignment.originalSerialNumber
                ) {
                    this.duplicateSerialNumber = true;
                    validInput = false;
                }

                if (!validInput) {
                    break;
                }
            }

            return validInput;
        },
    },
    created() {
        this.deviceSlots.map(slot => {
            const occupant = slot.occupant;

            if (!isEmpty(occupant)) {
                this.assignments.push({
                    assetTag: occupant.asset_tag,
                    id: occupant.id || '',
                    name: slot.name,
                    originalAssetTag: occupant.asset_tag,
                    originalSerialNumber: occupant.id,
                    rackUnitStart: occupant.rack_unit_start,
                    slot: slot.id,
                });
            }
        });
    },
};
</script>
