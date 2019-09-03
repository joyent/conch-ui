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
                    <p>Update successful</p>
                </div>
            </article>
            <!-- <article class="message is-info no-changes" v-if="noChanges">
                <div class="message-header">
                    <i class="material-icons">info</i>
                    <p>
                        No changes made
                    </p>
                </div>
            </article> -->
            <article
                v-if="
                    invalidSerialNumber ||
                        duplicateSerialNumber ||
                        duplicateAssetTag
                "
                class="message is-danger"
            >
                <div class="message-header">
                    <p v-if="duplicateAssetTag">
                        <i class="material-icons">error</i>
                        Duplicate asset tag
                    </p>
                    <p v-if="duplicateSerialNumber">
                        <i class="material-icons">error</i>
                        Duplicate serial number
                    </p>
                    <p v-if="invalidSerialNumber">
                        <i class="material-icons">error</i>
                        Invalid serial number
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
                                'has-error': assignmentHasError(
                                    assignment.slot
                                ),
                            }"
                        >
                            <td>{{ assignment.slot }}</td>
                            <td>{{ assignment.name }}</td>
                            <template
                                v-if="isEditingAssignment(assignment.slot)"
                            >
                                <td class="serial-number">
                                    <div
                                        class="control has-icons-right"
                                        :class="{
                                            'tooltip is-tooltip-danger':
                                                hasDuplicateSerialNumber(
                                                    assignment.slot
                                                ) ||
                                                hasInvalidSerialNumber(
                                                    assignment.slot
                                                ),
                                        }"
                                        :data-tooltip="
                                            getTooltip(assignment.slot)
                                        "
                                    >
                                        <input
                                            type="text"
                                            class="input serial-number"
                                            :class="{
                                                'is-danger':
                                                    hasDuplicateSerialNumber(
                                                        assignment.slot
                                                    ) ||
                                                    hasInvalidSerialNumber(
                                                        assignment.slot
                                                    ),
                                            }"
                                            v-model.trim="assignment.id"
                                            placeholder="Serial Number"
                                        />
                                        <span
                                            class="icon is-small is-right"
                                            v-if="
                                                hasDuplicateSerialNumber(
                                                    assignment.slot
                                                ) ||
                                                    hasInvalidSerialNumber(
                                                        assignment.slot
                                                    )
                                            "
                                        >
                                            <i
                                                class="material-icons has-text-danger"
                                            >
                                                error
                                            </i>
                                        </span>
                                    </div>
                                </td>
                                <td class="asset-tag">
                                    <div
                                        class="control has-icons-right"
                                        :class="{
                                            'tooltip is-tooltip-danger': hasDuplicateAssetTag(
                                                assignment.slot
                                            ),
                                        }"
                                        data-tooltip="Duplicate asset tag"
                                    >
                                        <input
                                            type="text"
                                            class="input asset-tag"
                                            :class="{
                                                'is-danger': hasDuplicateAssetTag(
                                                    assignment.slot
                                                ),
                                            }"
                                            v-model.trim="assignment.assetTag"
                                            placeholder="Asset Tag"
                                        />
                                        <span
                                            class="icon is-small is-right"
                                            v-if="
                                                hasDuplicateAssetTag(
                                                    assignment.slot
                                                )
                                            "
                                        >
                                            <i
                                                class="material-icons has-text-danger"
                                            >
                                                error
                                            </i>
                                        </span>
                                    </div>
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
                            <td class="edit-action">
                                <a
                                    v-if="isEditingAssignment(assignment.slot)"
                                    class="button is-fullwidth is-danger cancel"
                                    @click="
                                        cancelEditAssignment(assignment.slot)
                                    "
                                >
                                    <span>Cancel</span>
                                </a>
                                <a
                                    class="button is-info is-fullwidth edit"
                                    @click="editAssignment(assignment)"
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
                <a
                    v-if="editingAssignments"
                    class="button is-fullwidth is-success save-changes"
                    :class="{ 'is-loading': isLoading }"
                    @click="saveModifiedAssignments()"
                >
                    Save Changes
                </a>
                <a
                    class="button is-fullwidth close-modal"
                    @click="closeModal()"
                    v-else
                >
                    Close
                </a>
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
            editingAssignments: false,
            invalidSerialNumber: false,
            isActive: true,
            isLoading: false,
            isSuccess: false,
            modifiedAssignments: [],
            noChanges: false,
            validationErrors: [],
        };
    },
    computed: {
        ...mapState(['currentWorkspace', 'devices', 'rackLayout']),
    },
    methods: {
        ...mapActions(['setDevices', 'setRackLayout']),
        assignmentHasError(slot) {
            return this.validationErrors.some(error => {
                return error.slot === slot;
            });
        },
        getTooltip(slot) {
            const validationErrors = this.validationErrors;

            if (validationErrors.length) {
                const error = validationErrors.find(error => {
                    return error.slot === slot;
                });

                if (error) {
                    if (error.invalidSerialNumber) {
                        return 'Invalid serial number';
                    } else if (error.duplicateSerialNumber) {
                        return 'Duplicate serial number';
                    }
                }
            }
        },
        hasDuplicateAssetTag(slot) {
            return this.validationErrors.some(error => {
                return error.slot === slot && error.duplicateAssetTag;
            });
        },
        hasDuplicateSerialNumber(slot) {
            return this.validationErrors.some(error => {
                return error.slot === slot && error.duplicateSerialNumber;
            });
        },
        hasInvalidSerialNumber(slot) {
            return this.validationErrors.some(error => {
                return error.slot === slot && error.invalidSerialNumber;
            });
        },
        cancelEditAssignment(slot) {
            const index = this.assignmentsEditing.indexOf(slot);

            this.assignmentsEditing.splice(index, 1);
            this.modifiedAssignments.splice(index, 1);

            if (!this.assignmentsEditing.length) {
                this.editingAssignments = false;
            }

            this.clearErrors();
        },
        clearErrors() {
            this.duplicateAssetTag = false;
            this.duplicateSerialNumber = false;
            this.invalidSerialNumber = false;
            this.noChanges = false;
            this.validationErrors = [];
        },
        closeModal() {
            this.isActive = false;

            EventBus.$emit('closeModal:editLayoutModal');
        },
        editAssignment(assignment) {
            const slot = assignment.slot;

            if (this.assignmentsEditing.indexOf(slot) === -1) {
                this.assignmentsEditing.push(slot);
                this.modifiedAssignments.push(assignment);
            }

            if (!this.editingAssignments) {
                this.editingAssignments = true;
            }
        },
        isEditingAssignment(slot) {
            return this.assignmentsEditing.indexOf(slot) !== -1;
        },
        async saveModifiedAssignments() {
            this.isLoading = true;
            this.clearErrors();

            await this.validateInput();

            if (!this.validationErrors.length) {
                const modifiedAssignments = this.modifiedAssignments;
                let newRackAssignments = [];

                await modifiedAssignments.map(assignment => {
                    newRackAssignments.push({
                        device_asset_tag: assignment.assetTag,
                        device_id: assignment.id,
                        device_serial_number: assignment.serialNumber,
                        rack_unit_start: assignment.rackUnitStart,
                    });
                });

                updateRackAssignment(
                    this.rackLayout.id,
                    newRackAssignments
                ).then(() => {
                    getRackById(
                        this.currentWorkspace.id,
                        this.rackLayout.id
                    ).then(response => {
                        this.setRackLayout(response);

                        getDevices(this.currentWorkspace.id).then(response => {
                            this.setDevices(response.data);
                        });

                        this.assignmentsEditing = [];
                        this.isLoading = false;
                        this.editingAssignments = false;
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
        validateInput() {
            const modifiedAssignments = this.modifiedAssignments;

            for (let i = 0; i < modifiedAssignments.length; i++) {
                const assignment = modifiedAssignments[i];
                const assetTag = assignment.assetTag;
                const serialNumber = assignment.id;
                let invalidSerialNumber = false;
                let duplicateAssetTag = false;
                let duplicateSerialNumber = false;

                if (
                    !serialNumber ||
                    serialNumber.indexOf('/') !== -1 ||
                    serialNumber.indexOf('.') !== -1 ||
                    serialNumber.indexOf(' ') !== -1
                ) {
                    invalidSerialNumber = true;
                    this.invalidSerialNumber = true;
                }

                for (let i = 0; i < this.devices.length; i++) {
                    const device = this.devices[i];

                    if (
                        device.asset_tag === assetTag &&
                        assetTag !== assignment.originalAssetTag
                    ) {
                        // Checks for edge case where an assignment is given a new asset
                        // tag equal to an existing asset tag, but the duplicated asset
                        // tag is also being modified. In this case, no invalid input
                        // warning should appear.
                        const duplicatedAssetTagModified = modifiedAssignments.some(
                            modifiedAssignment =>
                                assetTag ===
                                    modifiedAssignment.originalAssetTag &&
                                modifiedAssignment.assetTag !==
                                    modifiedAssignment.originalAssetTag
                        );

                        if (!duplicatedAssetTagModified) {
                            duplicateAssetTag = true;
                            this.duplicateAssetTag = true;
                        }
                    }

                    if (
                        device.id === serialNumber &&
                        serialNumber !== assignment.originalSerialNumber
                    ) {
                        // Checks for edge case where an assignment is given a new serial
                        // number equal to an existing serial number, but the duplicated
                        // serial number is also being modified. In this case, no invalid
                        // input warning should appear.
                        const duplicatedSerialNumberModified = modifiedAssignments.some(
                            modifiedAssignment =>
                                serialNumber ===
                                    modifiedAssignment.originalSerialNumber &&
                                modifiedAssignment.serialNumber !==
                                    modifiedAssignment.originalSerialNumber
                        );

                        if (!duplicatedSerialNumberModified) {
                            duplicateSerialNumber = true;
                            this.duplicateSerialNumber = true;
                        }
                    }

                    if (duplicateAssetTag || duplicateSerialNumber) {
                        break;
                    }
                }

                if (
                    duplicateAssetTag ||
                    duplicateSerialNumber ||
                    invalidSerialNumber
                ) {
                    this.validationErrors.push({
                        slot: assignment.slot,
                        duplicateAssetTag,
                        duplicateSerialNumber,
                        invalidSerialNumber,
                    });
                }
            }
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
