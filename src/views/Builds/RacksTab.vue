<template>
    <div class="racks-tab">
        <div class="columns">
            <div class="column">
                <div class="members-table is-paddingless">
                    <div class="datatable-header">
                        <span class="heading is-size-6 is-marginless">
                            Racks
                        </span>
                        <div class="control has-icons-left has-icons-right">
                            <input
                                type="text"
                                class="input search"
                                v-model="searchText"
                                placeholder="Search racks"
                            >
                            <span class="icon is-small is-left">
                                <i class="fas fa-search"></i>
                            </span>
                        </div>
                        <i
                            class="material-icons has-text-success"
                            @click="addRack()"
                        >
                            add_circle
                        </i>
                    </div>
                    <table class="table is-hoverable is-fullwidth">
                        <thead>
                            <th>
                                <a
                                    class="table-header-filter name"
                                    :class="{ 'has-text-white': sortBy === 'name' }"
                                    @click="sort()"
                                >
                                    Name
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="sortBy === 'name' && !reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="sortBy === 'name' && reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th>
                                <a
                                    class="table-header-filter role"
                                    :class="{ 'has-text-white': sortBy === 'type' }"
                                    @click="sort()"
                                >
                                    Type
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="sortBy === 'type' && !reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="sortBy === 'type' && reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th></th>
                        </thead>
                        <tfoot v-if="filteredRacks.length > 10">
                            <th>Name</th>
                            <th>Type</th>
                        </tfoot>
                        <tbody>
                            <tr
                                class="row"
                                v-for="rack in filteredRacks"
                                :key="rack.name"
                            >
                                <td class="name">
                                    <span>{{ rack.name }}</span>
                                </td>
                                <td class="role">
                                    <span>{{ rack.role }}</span>
                                </td>
                                <td class="remove-item has-text-right">
                                    <i
                                        class="fas fa-trash-alt"
                                        @click="removeRack(rack)"
                                    ></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <RemoveItemModal
            v-if="removingRack"
            :item="rack"
            item-type="rack"
        />
    </div>
</template>

<script>
import search from "fuzzysearch";
import RemoveItemModal from './RemoveItemModal.vue';
import { EventBus } from '@src/eventBus.js';

export default {
    components: {
        RemoveItemModal,
    },
    props: {
        build: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            rackFilter: 'all',
            removingRack: false,
            searchText: '',
            sortBy: '',
            rack: {},
        };
    },
    methods: {
        addRack(rack) {

        },
        removeRack(rack) {
            this.rack = rack;
            this.removingRack = true;
        },
        sort() {

        },
    },
    computed: {
        filteredRacks() {
            let racks = this.build.racks;

            if (this.searchText) {
                const searchText = this.searchText.toLowerCase();

                return racks.reduce((acc, rack) => {
                    const name = rack.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(rack);
                    }

                    return acc;
                }, []);
            }

            // if (this.rackFilter) {
            //     const userFilter = this.userFilter;

            //     if (rackFilter === 'admin') {
            //         return users.filter(user => user.role === 'admin');
            //     } else if (rackFilter === 'regular') {
            //         return users.filter(user => user.role === 'regular user');
            //     }
            // }

            return racks;
        },
    },
    mounted() {
        EventBus.$on('close-modal:remove-item', () => {
            this.removingRack = false;
        });
    },
};
</script>
