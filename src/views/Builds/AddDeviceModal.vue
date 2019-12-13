<template>
    <div class="add-device-modal modal" :class="{ 'is-active': isActive }">
        <div class="modal-background" @click="closeModal()"></div>
        <div class="modal-content notification">
            <div class="content-header">
                <p class="title has-text-weight-bold is-5">
                    <i class="material-icons has-text-success" v-if="isSuccess">
                        check_circle
                    </i>
                    <i
                        class="material-icons has-text-danger"
                        v-if="serialNumberUnknown"
                    >
                        error
                    </i>
                    <span v-if="isSuccess">Device Added Successfully</span>
                    <span
                        class="has-text-danger"
                        v-else-if="serialNumberUnknown"
                    >
                        Unknown Serial Number
                    </span>
                    <span
                        class="has-text-warning"
                        v-else-if="serialNumberDuplicated"
                    >
                        Device Already in Build
                    </span>
                    <span v-else-if="creatingNewDevice">
                        Create New Device
                    </span>
                    <span v-else>Add Device to Build</span>
                </p>
                <i class="material-icons close" @click="closeModal()">close</i>
            </div>
            <div class="content-body">
                <label class="label">Serial Number</label>
                <div class="control has-icons-right">
                    <input
                        type="text"
                        class="input"
                        :class="{
                            'is-danger': serialNumberUnknown,
                            'is-loading': isInputLoading,
                            'is-success': serialNumberValidated || isSuccess,
                            'is-warning': serialNumberDuplicated,
                        }"
                        placeholder="Enter Device Serial Number"
                        v-model.trim="serialNumber"
                        :readonly="setInputReadOnly ? true : false"
                        @blur="inputBlurred()"
                        @input="!serialNumber ? resetErrors() : null"
                    />
                    <span class="icon is-small is-right">
                        <i
                            class="material-icons error"
                            :class="{
                                'has-text-danger': serialNumberUnknown,
                                'has-text-warning': serialNumberDuplicated,
                            }"
                            v-if="hasError"
                        >
                            error
                        </i>
                        <i
                            class="material-icons has-text-success success"
                            v-else-if="serialNumberValidated"
                        >
                            check
                        </i>
                    </span>
                </div>
                <template v-if="creatingNewDevice">
                    <label class="label">Device SKU</label>
                    <div class="control">
                        <input
                            type="text"
                            class="input"
                            :class="{
                                'is-success': isSuccess,
                            }"
                            placeholder="Enter Device SKU"
                            v-model.trim="deviceSku"
                            :readonly="setInputReadOnly ? true : false"
                            @input="!deviceSku ? resetErrors() : null"
                        />
                    </div>
                    <label class="label">Links</label>
                    <div class="control">
                        <input
                            type="text"
                            class="input"
                            :class="{
                                'is-success': isSuccess,
                            }"
                            placeholder="Device Link"
                            v-model.trim="deviceLinkOne"
                            :readonly="setInputReadOnly ? true : false"
                            @input="!deviceLinkOne ? resetErrors() : null"
                            style="margin-bottom: 10px;"
                        />
                    </div>
                    <div class="control">
                        <input
                            type="text"
                            class="input"
                            :class="{
                                'is-success': isSuccess,
                            }"
                            placeholder="Device Link"
                            v-model.trim="deviceLinkTwo"
                            :readonly="setInputReadOnly ? true : false"
                            @input="!deviceLinkTwo ? resetErrors() : null"
                        />
                    </div>
                </template>
            </div>
            <div class="content-footer">
                <div class="buttons">
                    <a class="button is-link" @click="closeModal()">
                        <span v-if="isSuccess">Close</span>
                        <span v-else>Cancel</span>
                    </a>
                    <a
                        class="button is-success"
                        v-if="isSuccess || serialNumberUnknown"
                        @click="resetModal()"
                    >
                        <span v-if="isSuccess">
                            Add Another Device
                        </span>
                        <span v-else>
                            Enter New SN
                        </span>
                    </a>
                    <a
                        class="button is-success"
                        :class="{ 'is-loading': isButtonLoading }"
                        @click="createNewDevice()"
                        v-else-if="creatingNewDevice"
                    >
                        Create Device
                    </a>
                    <a
                        class="button is-success"
                        :class="{ 'is-loading': isButtonLoading }"
                        @click="validateSerialNumber()"
                        v-else-if="!serialNumberValidated"
                        :disabled="serialNumber ? false : true"
                    >
                        Validate Serial Number
                    </a>
                    <a
                        class="button is-success"
                        :class="{ 'is-loading': isButtonLoading }"
                        @click="addDevice()"
                        v-else
                    >
                        Add Device
                    </a>
                    <div class="create-new-device" v-if="serialNumberUnknown">
                        <span class="text-or">OR</span>
                        <a
                            class="button is-text is-marginless"
                            @click="showCreateNewDeviceModal()"
                        >
                            Create a New Device
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from '@src/eventBus.js';
import { addDeviceToBuild, createDeviceAddToBuild } from '@api/builds.js';
import { getDeviceDetails } from '@api/device.js';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            creatingNewDevice: false,
            deviceLinkOne: '',
            deviceLinkTwo: '',
            deviceSku: '',
            isActive: true,
            isInputLoading: false,
            isButtonLoading: false,
            isSuccess: false,
            serialNumber: '',
            serialNumberDuplicated: false,
            serialNumberUnknown: false,
            serialNumberValidated: false,
        };
    },
    methods: {
        addDevice() {
            this.isButtonLoading = true;

            addDeviceToBuild(this.currentBuild.id, this.serialNumber).then(
                () => {
                    this.isSuccess = true;
                    this.isButtonLoading = false;

                    EventBus.$emit('device-added-to-build');
                }
            );
        },
        createNewDevice() {
            const deviceSku = this.deviceSku;
            const serialNumber = this.serialNumber;

            this.isButtonLoading = true;

            if (deviceSku && serialNumber) {
                createDeviceAddToBuild(
                    this.currentBuild.id,
                    serialNumber,
                    deviceSku,
                    this.links
                ).then(() => {
                    this.isSuccess = true;
                    this.isButtonLoading = false;

                    EventBus.$emit('device-added-to-build');
                });
            }
        },
        closeModal() {
            this.isActive = false;

            EventBus.$emit('close-modal:add-item');
        },
        inputBlurred() {
            if (!this.serialNumber) {
                this.resetErrors();
            }
        },
        isDeviceInBuild(serialNumber) {
            return this.currentBuildDevices.some(device => {
                return device.serial_number === serialNumber;
            });
        },
        resetErrors() {
            this.serialNumberDuplicated = false;
            this.serialNumberUnknown = false;
        },
        resetModal() {
            this.isInputLoading = false;
            this.isButtonLoading = false;
            this.isSuccess = false;
            this.serialNumberValidated = false;
            this.serialNumber = '';

            this.resetErrors();
        },
        showCreateNewDeviceModal() {
            this.creatingNewDevice = true;
            this.resetErrors();
        },
        validateSerialNumber() {
            const serialNumber = this.serialNumber;

            this.resetErrors();

            if (serialNumber) {
                this.isButtonLoading = true;
                this.isInputLoading = true;

                getDeviceDetails(serialNumber)
                    .then(() => {
                        if (this.isDeviceInBuild(serialNumber) === true) {
                            this.serialNumberDuplicated = true;
                        } else {
                            this.serialNumberValidated = true;
                        }

                        this.isButtonLoading = false;
                        this.isInputLoading = false;
                    })
                    .catch(error => {
                        if (error.status === 404) {
                            this.isButtonLoading = false;
                            this.isInputLoading = false;
                            this.serialNumberUnknown = true;
                        }
                    });
            }
        },
    },
    computed: {
        ...mapState(['currentBuild', 'currentBuildDevices']),
        hasError() {
            return this.serialNumberDuplicated || this.serialNumberUnknown;
        },
        setInputReadOnly() {
            return (
                this.isSuccess ||
                this.serialNumberValidated ||
                this.serialNumberUnknown
            );
        },
    },
};
</script>
