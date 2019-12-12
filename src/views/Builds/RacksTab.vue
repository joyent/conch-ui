<template>
    <div class="racks-tab">
        <div class="columns">
            <div class="column">
                <div
                    class="members-table is-paddingless"
                    v-if="filteredRacks && filteredRacks.length > 0"
                >
                    <div class="datatable-header">
                        <span class="heading is-size-6 is-marginless">
                            Racks
                        </span>
                        <div class="control has-icons-left has-icons-right">
                            <input
                                type="text"
                                class="input search"
                                v-model="searchText"
                                placeholder="Search..."
                            />
                            <span class="icon is-small is-left">
                                <i class="material-icons search">search</i>
                            </span>
                        </div>
                        <div class="select-with-label phase">
                            <label class="select-label">Phase</label>
                            <div class="select device-phase">
                                <select v-model="phaseFilter">
                                    <option value="all">All</option>
                                    <option
                                        :value="phase"
                                        v-for="phase in phases"
                                        :key="phase"
                                    >
                                        {{ phase }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="select-with-label phase">
                            <label class="select-label">Datacenter Room</label>
                            <div class="select device-phase">
                                <select v-model="datacenterRoomFilter">
                                    <option value="all" selected>All</option>
                                    <option
                                        v-for="datacenterRoom in availableDatacenterRooms"
                                        :key="datacenterRoom"
                                        :value="datacenterRoom"
                                    >
                                        {{ datacenterRoom }}
                                    </option>
                                </select>
                            </div>
                        </div>
                        <i
                            class="material-icons has-text-success"
                            @click="showAddRackModal()"
                        >
                            add_circle
                        </i>
                    </div>
                    <table class="table is-hoverable is-fullwidth">
                        <thead>
                            <th v-for="header in headers" :key="header">
                                <a
                                    class="table-header-filter is-capitalized"
                                    :class="{
                                        'has-text-white': sortBy === header,
                                    }"
                                    @click="sort()"
                                >
                                    {{ header }}
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="
                                            sortBy === header && !reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="
                                            sortBy === header && reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th></th>
                        </thead>
                        <tfoot v-if="filteredRacks.length > 10">
                            <th v-for="header in headers" :key="header">
                                {{ header }}
                            </th>
                            <th></th>
                        </tfoot>
                        <tbody>
                            <tr
                                class="row"
                                v-for="rack in filteredRacks"
                                :key="rack.id"
                            >
                                <td class="name">
                                    <span>{{ rack.name }}</span>
                                </td>
                                <td class="datacenterRoom">
                                    <span>
                                        {{
                                            getDatacenterRoom(
                                                rack.datacenter_room_id
                                            )
                                        }}
                                    </span>
                                </td>
                                <td class="phase">{{ rack.phase }}</td>
                                <td class="type">
                                    <span>Type</span>
                                </td>
                                <td class="remove-item has-text-right">
                                    <i
                                        class="fas fa-trash-alt"
                                        @click="showRemoveItemModal(rack)"
                                    ></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div
                    class="no-results"
                    v-else-if="filteredRacks.length === 0 && searchText"
                >
                    <p class="subtitle has-text-centered">
                        No Results to Display
                    </p>
                </div>
                <div class="no-items" style="margin-top: 40px;" v-else>
                    <p class="subtitle has-text-centered">
                        No racks in this build
                    </p>
                    <a class="button is-success" @click="showAddRackModal()">
                        Add a Rack
                    </a>
                </div>
            </div>
        </div>
        <RemoveItemModal
            v-if="removeRack"
            :item="removingRack"
            item-type="rack"
        />
        <AddRackModal v-if="addingRack" />
    </div>
</template>

<script>
import search from 'fuzzysearch';
import AddRackModal from './AddRackModal.vue';
import RemoveItemModal from './RemoveItemModal.vue';
import * as DatacenterRooms from '@api/datacenterRooms.js';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import * as Builds from '@api/builds.js';

export default {
    components: {
        AddRackModal,
        RemoveItemModal,
    },
    props: {
        buildId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            addingRack: false,
            datacenterRoomFilter: 'all',
            headers: ['name', 'datacenter room', 'phase', 'type'],
            phaseFilter: 'all',
            phases: [
                'Installation',
                'Integration',
                'Production',
                'Diagnostics',
                'Decommissioned',
            ],
            removeRack: false,
            removingRack: {},
            searchText: '',
            sortBy: '',
        };
    },
    methods: {
        ...mapActions(['setDatacenterRooms', 'setCurrentBuildRacks']),
        closeModal() {
            this.addingRack = false;
            this.removeRack = false;
            this.removingRack = {};
        },
        getDatacenterRoom(datacenterRoomId) {
            if (this.datacenterRooms) {
                const datacenterRoom = this.datacenterRooms.find(room => {
                    return room.id === datacenterRoomId;
                });

                if (datacenterRoom && datacenterRoom.az) {
                    return datacenterRoom.az;
                } else {
                    return '';
                }
            }
        },
        async getDatacenterRooms() {
            await DatacenterRooms.getDatacenterRooms().then(response => {
                this.setDatacenterRooms(response.data);
            });
        },
        showAddRackModal() {
            this.addingRack = true;
        },
        showRemoveItemModal(rack) {
            this.removingRack = rack;
            this.removeRack = true;
        },
        refetchCurrentBuildRacks() {
            Builds.getBuildRacks(this.buildId).then(response => {
                this.setCurrentBuildRacks(response.data);
            });
        },
        removeRackFromBuild() {
            Builds.removeRackFromBuild(this.buildId, this.removingRack.id).then(
                () => {
                    EventBus.$emit('item-removed');

                    this.refetchCurrentBuildRacks();
                }
            );
        },
        sort() {

        },
    },
    computed: {
        ...mapState(['currentBuildRacks', 'datacenterRooms']),
        availableDatacenterRooms() {
            if (!this.currentBuildRacks.length) {
                return [];
            }

            return Array.from(
                new Set(
                    this.currentBuildRacks.map(rack =>
                        this.getDatacenterRoom(rack.datacenter_room_id)
                    )
                )
            ).sort();
        },
        filteredRacks() {
            if (!this.currentBuildRacks.length) {
                return [];
            }

            let racks = this.currentBuildRacks;

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

            if (this.phaseFilter !== 'all') {
                racks = racks.filter(rack => {
                    return rack.phase === this.phaseFilter.toLowerCase();
                });
            }

            if (this.datacenterRoomFilter !== 'all') {
                racks = racks.filter(rack => {
                    const datacenterRoom = this.getDatacenterRoom(
                        rack.datacenter_room_id
                    );

                    if (datacenterRoom === this.datacenterRoomFilter) {
                        return rack;
                    }
                });
            }

            return racks;
        },
    },
    created() {
        if (!this.datacenterRooms.length) {
            this.getDatacenterRooms();
        }

        EventBus.$on(
            [
                'close-modal:add-item',
                'close-modal:remove-item',
                'close-modal:success-modal',
            ],
            () => {
                this.closeModal();
            }
        );

        EventBus.$on('remove-item:rack', () => {
            this.removeRackFromBuild();
        });

        EventBus.$on('rack-added', () => {
            this.refetchCurrentBuildRacks();
        });
    },
};
</script>
