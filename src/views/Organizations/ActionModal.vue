<template>
    <div class="workspace-modal">
        <div class="modal" :class="{ 'is-active': isActive }">
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-card">
                <div class="modal-card-head">
                    <p class="modal-card-title is-uppercase">
                        {{ action }} {{ itemType }}s
                    </p>
                    <i class="material-icons close" @click="closeModal()">
                        close
                    </i>
                </div>
                <div class="modal-card-body">
                    <table class="table is-fullwidth">
                        <tbody>
                            <tr class="table-title">
                                <td>Available Workspaces</td>
                            </tr>
                            <tr
                                class="row"
                                :class="{
                                    'is-selected': isSelected(item),
                                }"
                                v-for="item in itemList"
                                :key="item"
                            >
                                <template v-if="isSelected(item)">
                                    <td class="workspace">
                                        <span
                                            class="name has-text-grey is-italic"
                                        >
                                            {{ item }}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            class="has-text-success is-italic"
                                            v-if="action === 'add'"
                                        >
                                            adding
                                        </span>
                                        <span
                                            class="has-text-danger is-italic"
                                            v-if="action === 'remove'"
                                        >
                                            removing
                                        </span>
                                    </td>
                                </template>
                                <template v-else>
                                    <td class="workspace">
                                        <span class="name">
                                            {{ item }}
                                        </span>
                                    </td>
                                    <td>
                                        <i
                                            class="material-icons add-workspace"
                                            @click="addItem(item)"
                                        >
                                            add
                                        </i>
                                    </td>
                                </template>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table is-fullwidth">
                        <tbody>
                            <tr class="table-title">
                                <td>Pending Changes</td>
                            </tr>
                            <template v-if="changesExist">
                                <tr
                                    class="row"
                                    v-for="item in modifiedData"
                                    :key="`${item}_changing`"
                                >
                                    <td class="workspace">
                                        <span class="name">
                                            {{ item }}
                                        </span>
                                    </td>
                                    <td>
                                        <i
                                            class="material-icons remove-workspace"
                                            @click="removeItem(item)"
                                        >
                                            close
                                        </i>
                                    </td>
                                </tr>
                            </template>
                            <tr class="row no-changes" v-else>
                                <td class="workspace">
                                    <span class="name has-text-grey-light">
                                        No Changes Pending
                                    </span>
                                </td>
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
                            class="button is-info is-capitalized"
                            :class="{ 'is-loading': isLoading }"
                            @click="saveChanges()"
                            :disabled="modifiedData.length === 0"
                        >
                            {{ action }} {{ itemType }}s
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    </div>
</template>

<script>
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
        isSelected(item) {
            return this.modifiedData.indexOf(item) !== -1 ? true : false;
        },
        removeItem(item) {
            const index = this.modifiedData.indexOf(item);

            this.modifiedData.splice(index, 1);

            if (!this.modifiedData.length) {
                this.changesExist = false;
            }
        },
        saveChanges() {
            this.isLoading = true;
            const data = this.modifiedData;

            if (this.action === 'add') {
                data.forEach(item => {
                    // addItem(workspace);
                });
            } else {
                data.forEach(item => {
                    // removeItem(workspace);
                });
            }

            this.isLoading = false;
        },
    },
    computed: {
        itemList() {
            if (this.action === 'add') {
                let data = this.availableData;
                data = data.sort();

                return data.reduce((acc, item) => {
                    if (this.unavailableData.indexOf(item) === -1) {
                        acc.push(item);
                    }

                    return acc;
                }, []);
            } else {
                let data = this.unavailableData;

                return data.sort();
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
