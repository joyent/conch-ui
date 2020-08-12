<template>
    <div class="modal edit-layout-modal" :class="{ 'is-active': isActive }">
        <div class="modal-background" @click="closeModal()"></div>
        <div class="modal-card">
            <article class="message is-success update-success" v-if="isSuccess">
                <div class="message-header">
                    <p>
                        <i class="material-icons">check_circle</i>
                        Update successful
                    </p>
                </div>
            </article>
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
                <div
                    class="notification is-danger"
                    v-if="errorMessage"
                    style="display: flex; align-items: center; padding: 20px 24px; margin-bottom: 0;"
                >
                    <p class="has-text-left" style="flex-grow: 1"
                        >Error: {{ errorMessage }}</p
                    >
                    <button
                        class="delete"
                        @click="errorMessage = ''"
                        style="position: relative; top: 0; right: 0;"
                    ></button>
                </div>
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
                            <td>
                                <a
                                    class="has-text-white"
                                    @click="
                                        navigateToHardwareProduct(
                                            assignment.hardware_product_name
                                        )
                                    "
                                >
                                    {{ assignment.hardware_product_name }}
                                </a>
                            </td>
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
                                            v-model.trim="
                                                assignment.serial_number
                                            "
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
                                            v-model.trim="assignment.asset_tag"
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
                                <td
                                    class="serial-number"
                                    v-if="assignment.serial_number"
                                >
                                    {{ assignment.serial_number }}
                                </td>
                                <td class="serial-number" v-else>
                                    None
                                </td>
                                <td
                                    class="asset-tag"
                                    v-if="assignment.asset_tag"
                                >
                                    {{ assignment.asset_tag }}
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
import { updateRackAssignment } from '@api/racks.js';
import { getRack } from '@api/racks';
import { getHardwareProducts } from '@api/hardwareProduct';

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
            duplicateAssetTag: false,
            duplicateSerialNumber: false,
            editingAssignments: false,
            errorMessage: '',
            hardwareProducts: [],
            invalidSerialNumber: false,
            isActive: true,
            isLoading: false,
            isSuccess: false,
            modifiedAssignments: [],
            validationErrors: [],
        };
    },
    computed: {
        ...mapState(['devices', 'rackLayout']),
    },
    methods: {
        ...mapActions(['setDevices', 'setRackLayout']),
        assignmentHasError(slot) {
            return this.validationErrors.some(error => {
                return error.slot === slot;
            });
        },
        cancelEditAssignment(slot) {
            const index = this.getModifiedAssignmentIndex(slot);

            if (index !== undefined) {
                this.modifiedAssignments.splice(index, 1);
            }

            // Resets assignment serial number and asset tag to original values
            for (let i = 0; i < this.assignments.length; i++) {
                if (this.assignments[i].slot === slot) {
                    const assignment = this.assignments[i];

                    this.assignments[i].serial_number =
                        assignment.original_serial_number;
                    this.assignments[i].asset_tag =
                        assignment.original_asset_tag;

                    break;
                }
            }

            if (!this.modifiedAssignments.length) {
                this.editingAssignments = false;
            }

            this.clearErrors();
        },
        clearErrors() {
            this.duplicateAssetTag = false;
            this.duplicateSerialNumber = false;
            this.invalidSerialNumber = false;
            this.validationErrors = [];
        },
        closeModal() {
            this.isActive = false;

            EventBus.$emit('closeModal:editLayoutModal');
        },
        editAssignment(assignment) {
            const slot = assignment.slot;

            if (this.getModifiedAssignmentIndex(slot) === -1) {
                this.modifiedAssignments.push(assignment);
            }

            if (!this.editingAssignments) {
                this.editingAssignments = true;
            }
        },
        getModifiedAssignmentIndex(slot) {
            const modifiedAssignments = this.modifiedAssignments;
            let index;

            for (let i = 0; i < modifiedAssignments.length; i++) {
                const assigment = modifiedAssignments[i];

                if (assigment.slot === slot) {
                    index = i;
                    break;
                }
            }

            return index === undefined ? -1 : index;
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
        isEditingAssignment(slot) {
            return this.modifiedAssignments.some(assignment => {
                return assignment.slot === slot;
            });
        },
        navigateToHardwareProduct(productName) {
            const products = this.hardwareProducts;
            const product = products.find(
                product => product.name === productName
            );

            if (product) {
                this.$router.push({
                    name: 'hardware-product',
                    params: {
                        id: product.id,
                    },
                });
            }
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
                        device_asset_tag: assignment.asset_tag,
                        device_serial_number: assignment.serial_number,
                        rack_unit_start: assignment.rack_unit_start,
                    });
                });

                updateRackAssignment(
                    this.rackLayout.id,
                    newRackAssignments
                ).then(() => {
                    getRack(this.rackLayout.id).then(response => {
                        this.setRackLayout(response.data);

                        this.modifiedAssignments = [];
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
        setError(error) {
            this.errorMessage =
                (error && error.data && error.data.error) ||
                'An error occurred';
            this.isLoading = false;
        },
        validateInput() {
            const modifiedAssignments = this.modifiedAssignments;

            for (let i = 0; i < modifiedAssignments.length; i++) {
                const assignment = modifiedAssignments[i];
                const assetTag = assignment.asset_tag;
                const serialNumber = assignment.serial_number;
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
                        assetTag !== assignment.original_asset_tag
                    ) {
                        // Checks for edge case where an assignment is given a new asset
                        // tag equal to an existing asset tag, but the duplicated asset
                        // tag is also being modified. In this case, no invalid input
                        // warning should appear.
                        const duplicatedAssetTagModified = modifiedAssignments.some(
                            modifiedAssignment =>
                                assetTag ===
                                    modifiedAssignment.original_asset_tag &&
                                modifiedAssignment.asset_tag !==
                                    modifiedAssignment.original_asset_tag
                        );

                        if (!duplicatedAssetTagModified) {
                            duplicateAssetTag = true;
                            this.duplicateAssetTag = true;
                        }
                    }

                    if (
                        device.serial_number === serialNumber &&
                        serialNumber !== assignment.original_serial_number
                    ) {
                        // Checks for edge case where an assignment is given a new serial
                        // number equal to an existing serial number, but the duplicated
                        // serial number is also being modified. In this case, no invalid
                        // input warning should appear.
                        const duplicatedSerialNumberModified = modifiedAssignments.some(
                            modifiedAssignment =>
                                serialNumber ===
                                    modifiedAssignment.original_serial_number &&
                                modifiedAssignment.serial_number !==
                                    modifiedAssignment.original_serial_number
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
    async mounted() {
        let response;

        try {
            const response = await getHardwareProducts();
            this.hardwareProducts = response.data;
        } catch (error) {
            this.setError(error);
        }
    },
    created() {
        this.deviceSlots.map(slot => {
            const occupant = slot.occupant;

            if (!isEmpty(occupant)) {
                this.assignments.push({
                    asset_tag: occupant.asset_tag,
                    hardware_product_name: slot.hardware_product_name,
                    original_asset_tag: occupant.asset_tag,
                    original_serial_number: occupant.serial_number,
                    rack_unit_start: occupant.rack_unit_start,
                    serial_number: occupant.serial_number || '',
                    slot: slot.id,
                });
            }
        });
    },
};
</script>
