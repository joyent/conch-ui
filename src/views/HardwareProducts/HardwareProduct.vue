<template>
    <spinner v-if="!product.name"></spinner>
    <section class="hardware-product" v-else>
        <nav
            class="navbar"
            style="margin: -20px -20px 20px -20px; position: sticky; top: -1px"
        >
            <div class="navbar-brand">
                <div class="navbar-item">
                    <span class="icon material-icons">memory</span>
                    <h1
                        class="title is-4 has-text-weight-bold"
                        style="margin-left: 8px;"
                    >
                        {{ product.name }}
                    </h1>
                </div>
            </div>
            <div class="navbar-menu">
                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            <a
                                class="button is-info"
                                v-if="!editProduct"
                                @click="editProduct = true"
                                style="min-width: 96px"
                            >
                                <strong>Edit</strong>
                            </a>
                            <a
                                class="button is-danger"
                                v-if="!editProduct"
                                @click="modalConfirmAction = true"
                                style="min-width: 96px"
                            >
                                <strong>Delete</strong>
                            </a>
                            <template v-if="editProduct">
                                <a
                                    class="button is-dark"
                                    @click="editProduct = false"
                                >
                                    <strong>Cancel</strong>
                                </a>
                                <a
                                    class="button is-success"
                                    :class="{ 'is-loading': isLoading }"
                                    :disabled="!isProductModified"
                                    @click="
                                        isProductModified
                                            ? editHardwareProduct()
                                            : null
                                    "
                                >
                                    <strong>Save Changes</strong>
                                </a>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div class="columns">
            <div class="column is-6 is-offset-3">
                <article class="message is-danger" v-if="errorMessage">
                    <div class="message-header">
                        <p class="">Error: {{ errorMessage }}</p>
                        <button
                            class="delete"
                            aria-label="delete"
                            @click="errorMessage = ''"
                        ></button>
                    </div>
                </article>
            </div>
        </div>
        <div class="columns">
            <div class="column is-6 is-offset-3">
                <div class="card">
                    <div class="card-content">
                        <form>
                            <div
                                class="field"
                                v-for="field in fields"
                                :key="field.key"
                            >
                                <label class="label">
                                    {{ field.text }}
                                    <span
                                        v-if="isValueModified(field)"
                                        class="has-text-success"
                                        >(modified)</span
                                    >
                                </label>
                                <div class="control">
                                    <input
                                        v-if="
                                            field.key === 'created' ||
                                                field.key === 'updated'
                                        "
                                        class="input"
                                        type="text"
                                        readonly
                                        :value="getFormattedValue(field.value)"
                                    />
                                    <input
                                        v-else
                                        class="input"
                                        type="text"
                                        v-model="field.value"
                                        :readonly="!editProduct"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <transition name="fade">
            <confirmation-modal
                v-if="modalConfirmAction"
                message="Are you sure you ant to remove this hardware product?"
                @confirm-action="deleteHardwareProduct()"
                @close-modal="modalConfirmAction = false"
            ></confirmation-modal>
        </transition>
    </section>
</template>

<script>
import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import {
    deleteHardwareProduct,
    editHardwareProduct,
    getHardwareProduct,
} from '@api/hardwareProduct.js';
import ConfirmationModal from '../HardwareProducts/ConfirmationModal';
import Spinner from '@src/views/components/Spinner.vue';

export default {
    components: {
        ConfirmationModal,
        Spinner,
    },
    data() {
        return {
            defaultFields: {},
            editProduct: false,
            errorMessage: '',
            fields: [
                {
                    text: 'Alias',
                    key: 'alias',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'BIOS Firmware',
                    key: 'bios_firmware',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'CPU Count',
                    key: 'cpu_num',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'CPU Type',
                    key: 'cpu_type',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'Created',
                    key: 'created',
                    value: '',
                    modified: false,
                    type: 'datetime',
                },
                {
                    text: 'Dimms Count',
                    key: 'dimms_num',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'Generation Name',
                    key: 'generation_name',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'Hardware Vendor ID',
                    key: 'hardware_vendor_id',
                    value: '',
                    modified: false,
                    type: 'uuid',
                },
                {
                    text: 'HBA Firmware',
                    key: 'hba_firmware',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'Legacy Product Name',
                    key: 'legacy_product_name',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'Name',
                    key: 'name',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'Nics Count',
                    key: 'nics_num',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'NVME SSD Count',
                    key: 'nvme_ssd_num',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'NVME SSD Size',
                    key: 'nvme_ssd_size',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'NVME SSD Slots',
                    key: 'nvme_ssd_slots',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'Prefix',
                    key: 'prefix',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'PSU Total',
                    key: 'psu_total',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'Purpose',
                    key: 'purpose',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'Rack Unit Size',
                    key: 'rack_unit_size',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'RAID LUN Count',
                    key: 'raid_lun_num',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'RAM Total',
                    key: 'ram_total',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'SAS HDD Count',
                    key: 'sas_hdd_num',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'SAS HDD Size',
                    key: 'sas_hdd_size',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'SAS HDD Slots',
                    key: 'sas_hdd_slots',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'SAS SDD Count',
                    key: 'sas_ssd_num',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'SAS SDD Size',
                    key: 'sas_ssd_size',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'SAS SDD Slots',
                    key: 'sas_ssd_slots',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'SATA HDD Count',
                    key: 'sata_hdd_num',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'SATA HDD Size',
                    key: 'sata_hdd_size',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'SATA HDD Slots',
                    key: 'sata_hdd_slots',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'SATA SSD Count',
                    key: 'sata_ssd_num',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'SATA SSD Size',
                    key: 'sata_ssd_size',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'SATA SSD Slots',
                    key: 'sata_ssd_slots',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'SKU',
                    key: 'sku',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'Specification',
                    key: 'specification',
                    value: '',
                    modified: false,
                    type: 'string',
                },
                {
                    text: 'Updated',
                    key: 'updated',
                    value: '',
                    modified: false,
                    type: 'datetime',
                },
                {
                    text: 'USB Count',
                    key: 'usb_num',
                    value: '',
                    modified: false,
                    type: 'number',
                },
                {
                    text: 'Validation Plan ID',
                    key: 'validation_plan_id',
                    value: '',
                    modified: false,
                    type: 'uuid',
                },
            ],
            isLoading: false,
            modalConfirmAction: false,
            product: {},
        };
    },
    async mounted() {
        let response;
        const id = this.$route.params.id;

        try {
            response = await getHardwareProduct(id);

            const product = response.data;
            this.product = product;

            this.setFields(product);

            if (this.$route.query && this.$route.query.edit) {
                this.editProduct = true;
            }
        } catch (error) {
            this.setError(error);
        }
    },
    computed: {
        isProductModified() {
            const values = this.fields.map(field => {
                let value = field.value;
                if (typeof value === 'number') {
                    value = value.toString();
                }

                return value;
            });
            const defaultValues = this.defaultFields.map(field => {
                let value = field.value;
                if (typeof value === 'number') {
                    value = value.toString();
                }

                return value;
            });

            return !isEqual(values, defaultValues);
        },
    },
    methods: {
        async deleteHardwareProduct() {
            this.isLoading = true;

            try {
                await deleteHardwareProduct(this.product.id);

                this.$router.push({ name: 'hardware-products' });
            } catch (error) {
                this.setError(error);
            }
        },
        async editHardwareProduct() {
            const productId = this.product.id;
            this.isLoading = true;

            const data = {};
            const modifiedFields = this.fields.filter(field => field.modified);

            modifiedFields.forEach(field => {
                const value = field.value;

                if (field.type === 'number') {
                    data[field.key] = Number(value);
                } else {
                    data[field.key] = value;
                }
            });

            try {
                await editHardwareProduct(productId, data);
                const response = await getHardwareProduct(productId);
                this.product = response.data;
                this.setFields(response.data);

                this.editProduct = false;
                this.isLoading = false;
            } catch (error) {
                this.setError(error);
            }
        },
        getFormattedValue(fieldValue) {
            return moment.utc(fieldValue).format('DD-MMM-YYYY HH:mm:ss');
        },
        isValueModified(formField) {
            const { key, value } = formField;
            const field = this.product[key];
            let isModified;

            if (!value) {
                return false;
            }

            if (typeof field === 'number') {
                isModified = field.toString() !== value.toString();
            } else {
                isModified = field !== value;
            }

            for (let i = 0; i < this.fields.length; i++) {
                const field = this.fields[i];

                if (field.key === key) {
                    this.fields[i].modified = isModified;
                    break;
                }
            }

            return isModified;
        },
        setError(error) {
            this.errorMessage =
                (error && error.data && error.data.error) ||
                'An error occurred';
            this.editProduct = false;
            this.isLoading = false;
        },
        setFields(product) {
            const keys = Object.keys(product);

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];

                for (let j = 0; j < this.fields.length; j++) {
                    const field = this.fields[j];

                    if (field.key === key) {
                        this.fields[j].value = product[key];
                    }
                }
            }

            this.defaultFields = cloneDeep(this.fields);
        },
    },
};
</script>
