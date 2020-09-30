<template>
    <spinner v-if="hardwareProducts.length < 1"></spinner>
    <section class="hardware-products" v-else>
        <div class="hardware-products-list" v-if="!$route.params.id">
            <div
                class="page-heading"
                style="display: flex; align-items: center; margin-bottom: 20px"
            >
                <span class="icon material-icons">memory</span>
                <h1
                    class="title is-4 has-text-weight-bold"
                    style="margin-left: 8px;"
                >
                    Hardware Products
                </h1>
            </div>
            <div class="columns" v-if="errorMessage">
                <div class="column is-12">
                    <article class="message is-danger">
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
            <div style="display: flex">
                <div
                    class="control has-icons-left"
                    style="margin-bottom: 20px; margin-right: 20px; flex-grow: 1"
                >
                    <input
                        type="text"
                        class="input search"
                        placeholder="Search..."
                        v-model="searchText"
                    />
                    <span class="icon is-small is-left">
                        <i class="material-icons">search</i>
                    </span>
                </div>
                <a
                    v-if="currentUser && currentUser.is_admin"
                    class="button is-success create-new"
                    @click="showHardwareProductModal = true"
                >
                    <span class="icon">
                        <i class="material-icons">add</i>
                    </span>
                    <span>Create New</span>
                </a>
            </div>
            <table class="table is-hoverable is-fullwidth is-marginless">
                <thead>
                    <th>Name</th>
                    <th>Alias</th>
                    <th>SKU</th>
                    <th>Generation Name</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th v-if="currentUser && currentUser.is_admin"></th>
                </thead>
                <tfoot>
                    <th>Name</th>
                    <th>Alias</th>
                    <th>SKU</th>
                    <th>Generation Name</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th v-if="currentUser && currentUser.is_admin"></th>
                </tfoot>
                <tbody>
                    <tr
                        class="row"
                        v-for="product in filteredHardwareProducts"
                        :key="product.id"
                        @click="navigateToHardwareProduct(product)"
                        style="cursor: pointer"
                    >
                        <td>{{ product.name }}</td>
                        <td>{{ product.alias }}</td>
                        <td>{{ product.sku }}</td>
                        <td>{{ product.generation_name }}</td>
                        <td>{{ getFormattedDate(product.created) }}</td>
                        <td>{{ getFormattedDate(product.updated) }}</td>
                        <td v-if="currentUser && currentUser.is_admin">
                            <div
                                class="dropdown is-right"
                                :class="{
                                    'is-active': activeButton === product.id,
                                }"
                            >
                                <div
                                    class="dropdown-trigger"
                                    @click.stop="toggleDropdown(product.id)"
                                >
                                    <a
                                        style="display: flex; justify-content: center"
                                        aria-haspopup="true"
                                    >
                                        <span class="icon">
                                            <i class="material-icons"
                                                >more_vert</i
                                            >
                                        </span>
                                    </a>
                                </div>
                                <div class="dropdown-menu" role="menu">
                                    <div class="dropdown-content">
                                        <a
                                            class="dropdown-item"
                                            @click.stop="editProduct(product)"
                                        >
                                            Edit
                                        </a>
                                        <a
                                            class="dropdown-item"
                                            @click.stop="
                                                showConfirmActionModal(product)
                                            "
                                        >
                                            Delete
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <transition name="fade">
            <confirmation-modal
                v-if="modalConfirmAction"
                message="Are you sure you ant to remove this hardware product?"
                @confirm-action="deleteHardwareProduct()"
                @close-modal="modalConfirmAction = false"
            ></confirmation-modal>
            <hardware-product-modal
                v-if="showHardwareProductModal"
                @success="fetchHardwareProducts()"
                @close-modal="showHardwareProductModal = false"
            ></hardware-product-modal>
        </transition>
        <router-view></router-view>
    </section>
</template>

<script>
import moment from 'moment';
import search from 'fuzzysearch';
import {
    deleteHardwareProduct,
    getHardwareProducts,
} from '@api/hardwareProduct';
import { mapState } from 'vuex';
import ConfirmationModal from '../HardwareProducts/ConfirmationModal';
import Spinner from '@src/views/components/Spinner.vue';
import HardwareProductModal from '../HardwareProducts/HardwareProductModal';

export default {
    components: {
        ConfirmationModal,
        HardwareProductModal,
        Spinner,
    },
    data() {
        return {
            activeButton: '',
            errorMessage: '',
            hardwareProduct: '',
            hardwareProducts: [],
            isLoading: false,
            modalConfirmAction: false,
            showHardwareProductModal: false,
            searchText: '',
        };
    },
    async mounted() {
        await this.fetchHardwareProducts();
    },
    methods: {
        async deleteHardwareProduct() {
            this.isLoading = true;

            try {
                await deleteHardwareProduct(this.hardwareProduct);
                await this.fetchHardwareProducts();

                this.activeButton = '';
                this.isLoading = false;
                this.modalConfirmAction = false;
            } catch (error) {
                this.setError(error);
            }
        },
        editProduct(product) {
            this.$router.push({
                name: 'hardware-product',
                params: {
                    id: product.id,
                },
                query: {
                    edit: true,
                },
            });
        },
        async fetchHardwareProducts() {
            this.isLoading = true;

            try {
                const response = await getHardwareProducts();
                this.hardwareProducts = response.data;
            } catch (error) {
                this.setError(error);
            }

            this.isLoading = false;
        },
        getFormattedDate(date) {
            return moment(date).fromNow();
        },
        navigateToHardwareProduct(product) {
            this.$router.push({
                name: 'hardware-product',
                params: {
                    id: product.id,
                },
            });
        },
        setError(error) {
            this.errorMessage =
                (error && error.data && error.data.error) ||
                'An error occurred';
            this.isLoading = false;
        },
        showConfirmActionModal(product) {
            this.hardwareProduct = product.id;
            this.modalConfirmAction = true;
        },
        toggleDropdown(productId) {
            if (this.activeButton) {
                this.activeButton = '';
            } else {
                this.activeButton = productId;
            }
        },
    },
    computed: {
        ...mapState(['currentUser']),
        filteredHardwareProducts() {
            const searchText = this.searchText.toLowerCase();
            let products = this.hardwareProducts;

            if (searchText) {
                return products.reduce((acc, product) => {
                    const name =
                        (product.name && product.name.toLowerCase()) || '';
                    const alias =
                        (product.alias && product.alias.toLowerCase()) || '';
                    const sku =
                        (product.sku && product.sku.toLowerCase()) || '';
                    const genName =
                        (product.generation_name &&
                            product.generation_name.toLowerCase()) ||
                        '';
                    const id = (product.id && product.id.toLowerCase()) || '';

                    if (
                        search(searchText, name) ||
                        search(searchText, alias) ||
                        search(searchText, sku) ||
                        search(searchText, genName) ||
                        search(searchText, id)
                    ) {
                        acc.push(product);
                    }

                    return acc;
                }, []);
            }

            return products;
        },
    },
};
</script>
