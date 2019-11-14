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
                            <tr
                                v-if="
                                    itemList.length ||
                                        (itemList.length === 0 && searchText)
                                "
                            >
                                <td class="search-input" colspan="3">
                                    <p class="control has-icons-left">
                                        <input
                                            class="input search"
                                            type="text"
                                            :placeholder="`Search ${itemType}`"
                                            v-model="searchText"
                                        />
                                        <span class="icon">
                                            <i class="material-icons">search</i>
                                        </span>
                                    </p>
                                </td>
                            </tr>
                            <template v-if="itemList.length">
                                <tr
                                    class="row"
                                    :class="{
                                        'is-adding':
                                            action === 'add' &&
                                            isModified(item.id),
                                        'is-removing':
                                            action === 'remove' &&
                                            isModified(item.id),
                                    }"
                                    v-for="item in itemList"
                                    :key="item.id"
                                >
                                    <template v-if="isModified(item.id)">
                                        <td class="item-name">
                                            <span
                                                class="name has-text-grey-light"
                                            >
                                                {{ item.name }}
                                            </span>
                                        </td>
                                        <td class="organization-role-select">
                                            <div
                                                class="select role"
                                                v-if="action === 'add'"
                                            >
                                                <select
                                                    @change="
                                                        updateRole(
                                                            item.id,
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
                                                    showRemoveIcon !==
                                                        item.name &&
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
                                                v-if="
                                                    showRemoveIcon ===
                                                        item.name &&
                                                        action === 'add'
                                                "
                                                @click="removeItem(item.id)"
                                                @mouseleave="
                                                    showRemoveIcon = ''
                                                "
                                            >
                                                close
                                            </i>
                                            <i
                                                class="material-icons has-text-danger remove-item"
                                                v-if="
                                                    showAddIcon !== item.name &&
                                                        action === 'remove'
                                                "
                                                @mouseover="
                                                    showAddIcon = item.name
                                                "
                                            >
                                                check
                                            </i>
                                            <i
                                                class="material-icons has-text-success add-item"
                                                v-if="
                                                    showAddIcon === item.name &&
                                                        action === 'remove'
                                                "
                                                @click="removeItem(item.id)"
                                                @mouseleave="showAddIcon = ''"
                                            >
                                                add
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
                                                v-if="action === 'add'"
                                                @click="modifyItem(item)"
                                            >
                                                add
                                            </i>
                                            <i
                                                class="material-icons remove-item"
                                                v-if="action === 'remove'"
                                                @click="modifyItem(item)"
                                            >
                                                close
                                            </i>
                                        </td>
                                    </template>
                                </tr>
                            </template>
                            <template
                                v-else-if="!itemList.length && !searchText"
                            >
                                <tr class="row no-data">
                                    <td>No {{ itemType }} available</td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr class="row no-data">
                                    <td>
                                        No search results found
                                    </td>
                                </tr>
                            </template>
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
import * as Builds from '@api/builds.js';
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
            showAddIcon: '',
            showRemoveIcon: '',
        };
    },
    methods: {
        modifyItem(item) {
            this.changesExist = true;
            this.modifiedData.push({
                name: item.name,
                id: item.id,
                role: 'ro',
            });
        },
        closeModal() {
            this.isActive = false;
            this.modifiedData = [];
            EventBus.$emit('close-modal:action-modal');
        },
        getModifiedDataIndex(itemId) {
            return this.modifiedData
                .map(modifiedItem => modifiedItem.id)
                .indexOf(itemId);
        },
        isModified(itemId) {
            return this.modifiedData.some(modifiedItem => {
                return modifiedItem.id === itemId;
            });
        },
        removeItem(itemId) {
            const index = this.getModifiedDataIndex(itemId);

            this.modifiedData.splice(index, 1);

            if (!this.modifiedData.length) {
                this.changesExist = false;
            }
        },
        async saveChanges() {
            this.isLoading = true;
            const data = this.modifiedData;
            const dataLength = data.length;
            const organizationId = this.organizationId;

            if (this.action === 'add') {
                if (this.itemType === 'members') {
                    for (let i = 0; i < dataLength; i++) {
                        const member = data[i];
                        await addUserToOrganization(
                            organizationId,
                            member.role,
                            member.id
                        );
                    }

                    EventBus.$emit('member-added', {
                        count: dataLength,
                        type: 'member',
                    });
                } else if (this.itemType === 'builds') {
                    for (let i = 0; i < dataLength; i++) {
                        const build = data[i];
                        await Builds.addOrganizationToBuild(
                            build.id,
                            organizationId,
                            build.role
                        );
                    }

                    EventBus.$emit('build-added', {
                        count: dataLength,
                        type: 'build',
                    });
                }
            } else {
                if (this.itemType === 'members') {
                    for (let i = 0; i < dataLength; i++) {
                        const member = data[i];
                        await removeUserFromOrganization(
                            organizationId,
                            member.id
                        );
                    }

                    EventBus.$emit('member-removed', {
                        count: dataLength,
                        type: 'member',
                    });
                } else if (this.itemType === 'builds') {
                    for (let i = 0; i < dataLength; i++) {
                        const build = data[i];
                        await Builds.removeOrganizationFromBuild(
                            build.id,
                            organizationId
                        );
                    }

                    EventBus.$emit('build-removed', {
                        count: dataLength,
                        type: 'build',
                    });
                }
            }

            this.closeModal();
            this.isLoading = false;
        },
        updateRole(itemId, event) {
            if (event && event.target && event.target.value) {
                const modifiedData = this.modifiedData;

                for (let i = 0; i < modifiedData.length; i++) {
                    const modifiedItem = modifiedData[i];

                    if (modifiedItem.id === itemId) {
                        this.modifiedData[i].role = event.target.value;

                        break;
                    }
                }
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
};
</script>
