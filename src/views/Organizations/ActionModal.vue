<template>
    <div class="action-modal">
        <div class="modal" :class="{ 'is-active': isActive }">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-card">
                <div class="modal-card-head">
                    <p class="modal-card-title is-uppercase">
                        {{ action }} {{ itemType }}
                    </p>
                    <i class="material-icons close" @click="closeModal()">
                        close
                    </i>
                </div>
                <div class="modal-card-body">
                    <table class="table is-fullwidth">
                        <tbody>
                            <tr>
                                <td class="search-input" colspan="3">
                                    <p class="control has-icons-left">
                                        <input
                                            class="input search"
                                            type="text"
                                            :placeholder="`Search ${itemType}s`"
                                            v-model="searchText"
                                        />
                                        <span class="icon">
                                            <i class="material-icons">search</i>
                                        </span>
                                    </p>
                                </td>
                            </tr>
                            <tr
                                class="row"
                                :class="{
                                    'is-selected': isSelected(item.name),
                                }"
                                v-for="item in itemList"
                                :key="item.id"
                            >
                                <template v-if="isSelected(item.name)">
                                    <td class="item-name">
                                        <span class="name has-text-grey-light">
                                            {{ item.name }}
                                        </span>
                                    </td>
                                    <td class="organization-permissions-select">
                                        <div
                                            class="select permissions"
                                            v-if="isSelected(item.name)"
                                        >
                                            <select
                                                @change="
                                                    updatePermissions(
                                                        item.name,
                                                        $event
                                                    )
                                                "
                                            >
                                                <option value="admin">
                                                    Admin
                                                </option>
                                                <option value="rw">
                                                    Read / Write
                                                </option>
                                                <option value="ro" selected>
                                                    Read Only
                                                </option>
                                            </select>
                                        </div>
                                    </td>
                                    <td class="action">
                                        <i
                                            class="material-icons has-text-success add-item"
                                            v-if="
                                                showRemoveIcon !== item.name &&
                                                    action === 'add'
                                            "
                                            @mouseover="
                                                showRemoveIcon = item.name
                                            "
                                        >
                                            check
                                        </i>
                                        <i
                                            class="material-icons has-text-danger remove-item"
                                            v-if="showRemoveIcon === item.name"
                                            @click="removeItem(item.name)"
                                            @mouseleave="showRemoveIcon = ''"
                                        >
                                            close
                                        </i>
                                        <i
                                            class="material-icons has-text-danger remove-item"
                                            v-if="action === 'remove'"
                                        >
                                            close
                                        </i>
                                    </td>
                                </template>
                                <template v-else>
                                    <td class="item-name">
                                        <span class="name">
                                            {{ item.name }}
                                        </span>
                                    </td>
                                    <td>
                                        <i
                                            class="material-icons add-item"
                                            @click="addItem(item)"
                                        >
                                            add
                                        </i>
                                    </td>
                                </template>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <footer class="modal-card-foot">
                    <div class="buttons is-marginless">
                        <a
                            class="button is-outlined is-danger"
                            @click="closeModal()"
                            :disabled="isLoading"
                        >
                            Cancel
                        </a>
                        <a
                            class="button is-capitalized"
                            :class="{
                                'is-loading': isLoading,
                                'is-danger': action === 'remove',
                                'is-success': action === 'add',
                            }"
                            @click="saveChanges()"
                            :disabled="modifiedData.length === 0"
                        >
                            {{ action }} {{ itemType }}
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
import orderBy from 'lodash';
import search from 'fuzzysearch';
import {
    addUserToOrganization,
    removeUserFromOrganization,
} from '@api/organizations';
import { EventBus } from '@src/eventBus.js';

export default {
    props: {
        action: {
            type: String,
            required: true,
        },
        availableData: {
            type: Array,
            required: true,
        },
        itemType: {
            type: String,
            required: true,
        },
        organizationId: {
            type: String,
            required: true,
        },
        unavailableData: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            changesExist: false,
            isActive: true,
            isLoading: false,
            modifiedData: [],
            searchText: '',
            showRemoveIcon: '',
        };
    },
    methods: {
        addItem(item) {
            this.changesExist = true;
            this.modifiedData.push(item);
        },
        closeModal() {
            EventBus.$emit('close-modal:action-modal');
        },
        getModifiedDataIndex(itemName) {
            return this.modifiedData
                .map(modifiedItem => modifiedItem.name)
                .indexOf(itemName);
        },
        isSelected(itemName) {
            return this.modifiedData.some(modifiedItem => {
                return modifiedItem.name === itemName;
            });
        },
        removeItem(itemName) {
            const index = this.getModifiedDataIndex(itemName);

            this.modifiedData.splice(index, 1);

            if (!this.modifiedData.length) {
                this.changesExist = false;
            }
        },
        saveChanges() {
            this.isLoading = true;
            const data = this.modifiedData;

            // NEED TO GET ROLE VIA SELECT
            if (this.action === 'add') {
                data.forEach(item => {
                    if (this.itemType === 'member') {
                        addUserToOrganization(
                            this.organizationId,
                            'admin',
                            item.id
                        );
                    }
                });
            } else {
                data.forEach(item => {
                    if (this.itemType === 'member') {
                        removeUserFromOrganization(
                            this.organizationId,
                            item.id
                        );
                    }
                });
            }

            this.isLoading = false;
        },
        updatePermissions(item, event) {
            const index = this.modifiedData.indexOf(item);
            if (event && event.target && event.target.value) {
                this.workspacePermissions[index].permissions =
                    event.target.value;
            }
        },
    },
    computed: {
        itemList() {
            const searchText = this.searchText.toLowerCase();
            let data;

            if (this.action === 'add') {
                data = orderBy(
                    this.availableData,
                    [item => item.name.toLowerCase()],
                    ['desc']
                );

                return data.reduce((acc, item) => {
                    const index = this.unavailableData
                        .map(unavailableItem => unavailableItem.name)
                        .indexOf(item.name);

                    if (searchText) {
                        const name = item.name.toLowerCase();

                        if (search(searchText, name) && index === -1) {
                            acc.push(item);
                        }
                    } else {
                        if (index === -1) {
                            acc.push(item);
                        }
                    }

                    return acc;
                }, []);
            } else {
                return this.unavailableData.reduce((acc, item) => {
                    if (searchText) {
                        const name = item.name.toLowerCase();

                        if (search(searchText, name)) {
                            acc.push(item);
                        }
                    } else {
                        acc.push(item);
                    }

                    return acc;
                }, []);
            }
        },
    },
    mounted() {
        EventBus.$on('closeModal:baseModal', () => {
            this.closeModal();
        });
    },
};
</script>
