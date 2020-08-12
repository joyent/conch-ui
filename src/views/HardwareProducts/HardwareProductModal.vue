<template>
    <div
        class="modal hardware-product-modal"
        :class="{ 'is-active': isActive }"
    >
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Hardware Product</p>
                <button
                    class="delete"
                    aria-label="close"
                    @click="closeModal()"
                ></button>
            </header>
            <section class="modal-card-body">
                <form>
                    <div class="field">
                        <label class="label">Name</label>
                        <div class="control">
                            <input class="input" type="text" v-model="name" />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Alias</label>
                        <div class="control">
                            <input class="input" type="email" v-model="alias" />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">SKU</label>
                        <div class="control">
                            <input class="input" type="email" v-model="sku" />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">CPU Type</label>
                        <div class="control">
                            <input
                                class="input"
                                type="email"
                                v-model="cpuType"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Hardware Vendor ID</label>
                        <div class="control">
                            <input
                                class="input"
                                type="email"
                                v-model="hardwareVendorId"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">BIOS Firmware</label>
                        <div class="control">
                            <input
                                class="input"
                                type="email"
                                v-model="biosFirmware"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Purpose</label>
                        <div class="control">
                            <input
                                class="input"
                                type="email"
                                v-model="purpose"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Validation Plan ID</label>
                        <div class="control">
                            <input
                                class="input"
                                type="email"
                                v-model="validationPlanId"
                            />
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Rack Unit Size</label>
                        <div class="control">
                            <input
                                class="input"
                                type="email"
                                v-model="rackUnitSize"
                            />
                        </div>
                    </div>
                </form>
            </section>
            <footer class="modal-card-foot">
                <button
                    class="button is-success"
                    :disabled="!hasRequiredValues"
                    :class="{ 'is-loading': isLoading }"
                    @click="createHardwareProduct()"
                    >Save changes</button
                >
                <button class="button" @click="closeModal()">Cancel</button>
            </footer>
        </div>
    </div>
</template>

<script>
import { createHardwareProduct } from '@api/hardwareProduct.js';

export default {
    data() {
        return {
            alias: '',
            biosFirmware: '',
            cpuType: '',
            hardwareVendorId: '',
            isActive: true,
            isLoading: false,
            name: '',
            purpose: '',
            rackUnitSize: '',
            sku: '',
            validationPlanId: '',
        };
    },
    computed: {
        hasRequiredValues() {
            return (
                this.alias &&
                this.biosFirmware &&
                this.cpuType &&
                this.hardwareVendorId &&
                this.name &&
                this.purpose &&
                this.rackUnitSize &&
                this.sku &&
                this.validationPlanId
            );
        },
    },
    methods: {
        closeModal() {
            this.$emit('close-modal');
            this.isActive = false;
        },
        async createHardwareProduct() {
            this.isLoading = true;

            await createHardwareProduct({
                name: this.name,
                alias: this.alias,
                hardware_vendor_id: this.hardwareVendorId,
                sku: this.sku,
                rack_unit_size: Number(this.rackUnitSize),
                validation_plan_id: this.validationPlanId,
                purpose: this.purpose,
                bios_firmware: this.biosFirmware,
                cpu_type: this.cpuType,
            });

            this.isLoading = false;
            this.$emit('success');
            this.closeModal();
        },
    },
};
</script>
