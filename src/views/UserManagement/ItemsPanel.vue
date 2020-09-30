<template>
    <div class="items-panel">
        <p class="control has-icons-left">
            <input
                class="input search"
                v-model="searchText"
                placeholder="Search..."
                type="text"
            />
            <span class="icon is-left">
                <i class="material-icons">search</i>
            </span>
        </p>
        <table class="table is-fullwidth">
            <tbody>
                <template v-if="filteredItems.length > 0">
                    <tr
                        class="row item"
                        :class="{ 'is-selected': isItemSelected(item.id) }"
                        v-for="item in filteredItems"
                        :key="item.id"
                    >
                        <template v-if="isItemSelected(item.id)">
                            <td class="item-name">
                                <span class="name has-text-grey-light">
                                    {{ item.name }}
                                </span>
                            </td>
                            <td class="role-select">
                                <div class="select role">
                                    <select
                                        @change="updateRole(item.id, $event)"
                                    >
                                        <option
                                            value="admin"
                                            :selected="item.role === 'admin'"
                                        >
                                            Admin
                                        </option>
                                        <option
                                            value="rw"
                                            :selected="item.role === 'rw'"
                                        >
                                            Read &#47; Write
                                        </option>
                                        <option
                                            value="ro"
                                            :selected="item.role === 'ro'"
                                        >
                                            Read Only
                                        </option>
                                    </select>
                                </div>
                            </td>
                            <td class="action">
                                <i
                                    class="material-icons has-text-success item-added"
                                    v-if="showRemoveIcon !== item.name"
                                    @mouseover="showRemoveIcon = item.name"
                                >
                                    check
                                </i>
                                <i
                                    class="material-icons has-text-danger remove-item"
                                    v-if="showRemoveIcon === item.name"
                                    @click="removeItem(item.id)"
                                    @mouseleave="showRemoveIcon = ''"
                                >
                                    close
                                </i>
                            </td>
                        </template>
                        <template v-else>
                            <td class="item-name">
                                <span>{{ item.name }}</span>
                            </td>
                            <td class="action">
                                <i
                                    class="material-icons has-text-success add-item"
                                    @click="addItem(item)"
                                >
                                    add
                                </i>
                            </td>
                        </template>
                    </tr>
                </template>
                <tr
                    class="row item"
                    v-else-if="filteredItems.length === 0 && searchText"
                >
                    <td class="has-text-centered no-results">
                        No search results
                    </td>
                </tr>
                <tr v-else>
                    <td class="row"><Spinner /></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import search from 'fuzzysearch';
import Spinner from '@src/views/components/Spinner.vue';
import { EventBus } from '@src/eventBus.js';

export default {
    props: {
        itemType: {
            type: String,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
        userItems: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    components: {
        Spinner,
    },
    data() {
        return {
            searchText: '',
            selectedItems: [],
            showRemoveIcon: '',
        };
    },
    methods: {
        addItem(item) {
            this.selectedItems.push(Object.assign(item, { role: 'ro' }));
        },
        isItemSelected(itemId) {
            const selectedItems = this.selectedItems;

            if (selectedItems.length) {
                return selectedItems.map(item => item.id).indexOf(itemId) !== -1
                    ? true
                    : false;
            }

            return false;
        },
        removeItem(itemId) {
            const index = this.selectedItems
                .map(item => item.id)
                .indexOf(itemId);

            this.selectedItems.splice(index, 1);
        },
        updateRole(itemId, event) {
            const selectedItems = this.selectedItems;

            for (let i = 0; i < selectedItems.length; i++) {
                const modifiedItem = selectedItems[i];

                if (modifiedItem.id === itemId) {
                    this.selectedItems[i].role = event.target.value;

                    break;
                }
            }
        },
    },
    computed: {
        filteredItems() {
            const items = this.items;
            const searchText = this.searchText.toLowerCase();

            if (searchText) {
                return items.reduce((acc, item) => {
                    const name = item.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(item);
                    }

                    return acc;
                }, []);
            }

            return items;
        },
    },
    mounted() {
        if (this.userItems.length) {
            this.userItems.forEach(item => {
                this.selectedItems.push(item);
            });
        }

        EventBus.$on('get-selected-items', () => {
            EventBus.$emit('send-selected-items', {
                itemType: this.itemType,
                items: this.selectedItems,
            });

            this.selectedItems = [];
        });
    },
};
</script>
