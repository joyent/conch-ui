<template>
    <div class="racks-tab">
        <div class="columns">
            <div class="column">
                <div class="members-table is-paddingless">
                    <div class="datatable-header">
                        <span class="heading is-size-6 is-marginless">
                            {{ `Racks (${filteredRacks.length})` }}
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
                                <select
                                    v-model="phaseFilter"
                                    class="is-capitalized"
                                >
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
                            <label class="select-label"
                                >Datacenter Room Alias</label
                            >
                            <div class="select device-phase">
                                <select v-model="datacenterRoomFilter">
                                    <option value="all" selected>All</option>
                                    <option
                                        v-for="(alias,
                                        index) in availableDatacenterRooms"
                                        :key="index"
                                        :value="alias"
                                    >
                                        {{ alias }}
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
                    <table
                        class="table is-hoverable is-fullwidth"
                        v-if="filteredRacks.length"
                    >
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
                                <span class="is-capitalized">{{ header }}</span>
                            </th>
                            <th></th>
                        </tfoot>
                        <tbody>
                            <tr
                                class="row"
                                v-for="rack in filteredRacks"
                                :key="rack.id"
                                @click="
                                    $router.push({
                                        name: 'build-devices',
                                        params: { id: currentBuild.id },
                                        query: { rackId: rack.id },
                                    })
                                "
                                :style="{
                                    cursor: userIsAdmin ? 'pointer' : 'default',
                                }"
                            >
                                <td class="name">
                                    <span>{{ rack.name }}</span>
                                </td>
                                <td class="rack-role-name">
                                    <span>{{ rack.rack_role_name }}</span>
                                </td>
                                <td class="datacenterRoom">
                                    <span>
                                        {{ rack.datacenter_room_alias }}
                                    </span>
                                </td>
                                <td class="phase">{{ rack.phase }}</td>
                                <td class="remove-item has-text-right">
                                    <i
                                        class="fas fa-trash-alt"
                                        @click="showRemoveItemModal(rack)"
                                    ></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="no-results" v-else>
                        <p class="subtitle has-text-centered">
                            No Results to Display
                        </p>
                    </div>
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
    data() {
        return {
            addingRack: false,
            datacenterRoomAliases: [],
            datacenterRoomFilter: 'all',
            headers: ['name', 'role', 'datacenter room alias', 'phase'],
            phaseFilter: 'all',
            phases: [
                'installation',
                'integration',
                'production',
                'diagnostics',
                'decommissioned',
            ],
            removeRack: false,
            removingRack: {},
            searchText: '',
            sortBy: '',
        };
    },
    methods: {
        ...mapActions(['setCurrentBuildRacks']),
        closeModal() {
            this.addingRack = false;
            this.removeRack = false;
            this.removingRack = {};
        },
        selectRack(rack) {
            this.$emit('rack-selected', { rack });
        },
        async navigateToRack(rack) {
            const response = await DatacenterRooms.getDatacenterRoom(
                rack.datacenter_room_id
            );

            if (response && response.data && response.data.az) {
                this.$router.push({
                    name: 'datacenterRack',
                    params: {
                        rackId: rack.id,
                        roomName: response.data.az,
                    },
                });
            }
        },
        showAddRackModal() {
            this.addingRack = true;
        },
        showRemoveItemModal(rack) {
            this.removingRack = rack;
            this.removeRack = true;
        },
        refetchCurrentBuildRacks() {
            Builds.getBuildRacks(this.currentBuild.id).then(response => {
                this.setCurrentBuildRacks(response.data);
            });
        },
    },
    computed: {
        ...mapState(['currentBuild', 'currentBuildRacks', 'currentUser']),
        availableDatacenterRooms() {
            if (!this.currentBuildRacks.length) {
                return [];
            }

            let rooms = [];

            this.datacenterRoomAliases.forEach(room => {
                if (rooms.includes(room) === false) {
                    rooms.push(room);
                }
            });

            return rooms;
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
                    const role = rack.rack_role_name.toLowerCase();
                    const datacenterRoomAlias = rack.datacenter_room_alias.toLowerCase();
                    const phase = rack.phase.toLowerCase();

                    if (
                        (name && search(searchText, name)) ||
                        (role && search(searchText, role)) ||
                        (datacenterRoomAlias &&
                            search(searchText, datacenterRoomAlias)) ||
                        (phase && search(searchText, phase))
                    ) {
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
                racks = racks.filter(
                    rack =>
                        rack.datacenter_room_alias === this.datacenterRoomFilter
                );
            }

            return racks;
        },
        userIsAdmin() {
            const user = this.currentUser;

            if (user && user.is_admin) {
                return true;
            }

            if (user && user.builds && user.builds.length) {
                const build = user.builds.find(
                    build => build.id === this.currentBuild.id
                );

                if (build && build.role === 'admin') {
                    return true;
                }
            }

            return false;
        },
    },
    created() {
        if (this.$route.query && this.$route.query.rackPhase) {
            this.phaseFilter = this.$route.query.rackPhase;
        }

        this.datacenterRoomAliases = this.currentBuildRacks.map(
            rack => rack.datacenter_room_alias
        );

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

        EventBus.$on('rack-added', () => {
            this.refetchCurrentBuildRacks();
        });
    },
};
</script>
