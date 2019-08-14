<template>
    <div class="racks-table">
        <div class="columns">
            <div class="column is-6 is-offset-3 box">
                <div class="control has-icons-left">
                    <input
                        type="text"
                        class="input search"
                        v-model="searchText"
                        placeholder="Search Racks"
                    />
                    <span class="icon">
                        <i class="fas fa-search"></i>
                    </span>
                </div>
                <table class="table is-fullwidth">
                    <tbody>
                        <tr
                            :class="{ 'is-selected': isRackSelected(rack) }"
                            v-for="rack in filteredRacks"
                            :key="rack.id"
                        >
                            <td class="rack-name">
                                <span
                                    class="has-text-success adding"
                                    v-if="isRackSelected(rack)"
                                >
                                    {{ rack.name }}
                                </span>
                                <span v-else>
                                    {{ rack.name }}
                                </span>
                            </td>
                            <td class="datacenter">
                                <span class="has-text-grey-light">
                                    {{ rack.datacenter }}
                                </span>
                            </td>
                            <td class="has-text-right">
                                <i
                                    class="material-icons has-text-danger"
                                    v-if="isRackSelected(rack)"
                                    @click="removeRack(rack)"
                                >
                                    close
                                </i>
                                <i
                                    class="material-icons has-text-success add-rack"
                                    @click="addRack(rack)"
                                    v-else
                                >
                                    add
                                </i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import search from 'fuzzysearch';

export default {
    data() {
        return {
            searchText: '',
            selectedRacks: [],
            showCloseButton: false,
            racks: [
                {
                    datacenter: 'us-southwest-1a',
                    id: 'e3e7c2c0-7b4d-4q9a-b865-2y678976543p',
                    name: 'DS-23C-ABCD23',
                    phase: 'integration',
                    role: 'CERES',
                    slots: [
                        {
                            alias: 'CERES Type 1',
                            id: 'e3e7c2c0-7b4d-4q9a-b865-2y678976543a',
                            name: 'dell-2u-compute-v1-256g-10-12tb',
                            role: 'MANTA',
                            occupant: {
                                asset_tag: null,
                                created: '2017-08-14T23:37:37.182853-07:00',
                                graduated: null,
                                hardware_product:
                                    'e3e7c2c0-7b4d-4q9a-b865-2y678976543h',
                                health: 'pass',
                                id: 'ACEGI82',
                                rack_id: 'e3e7c2c0-7b4d-4q9a-b865-2y678976543a',
                                validated: '2018-01-10T17:36:24.965412-08:00',
                            },
                            vendor: 'Dell',
                        },
                        {
                            alias: 'CERES Type 1',
                            id: 'e3e7c2c0-7b4d-4q9a-b865-2y678976543b',
                            name: 'dell-2u-compute-v1-256g-10-12tb',
                            role: 'CERES',
                            occupant: {
                                asset_tag: null,
                                created: '2017-08-14T23:37:37.276789-07:00',
                                graduated: '2018-01-10T17:38:17.000181-08:00',
                                hardware_product:
                                    'e3e7c2c0-7b4d-4q9a-b865-2y678976543h',
                                health: 'pass',
                                id: 'ACEGI83',
                                validated: null,
                            },
                            vendor: 'IBM',
                        },
                        {
                            alias: 'CERES Type 1',
                            id: 'e3e7c2c0-7b4d-4q9a-b865-2y678976543c',
                            name: 'dell-2u-compute-v1-256g-10-12tb',
                            role: 'TRITON',
                            occupant: {
                                asset_tag: null,
                                created: '2017-08-14T23:37:37.249873-07:00',
                                graduated: null,
                                hardware_product:
                                    'e3e7c2c0-7b4d-4q9a-b865-2y678976543h',
                                health: 'pass',
                                id: 'ACEGI84',
                                validated: '2018-01-10T17:36:39.659718-08:00',
                            },
                            vendor: 'Microsoft',
                        },
                    ],
                },
                {
                    datacenter: 'us-east-2a',
                    id: 'e3e7c2c0-7b4d-4q9a-b865-2y678976543a',
                    name: 'DS-23C-232168',
                    phase: 'integration',
                    role: 'CERES',
                    slots: [
                        {
                            alias: 'CERES Type 1',
                            id: 'e3e7c2c0-7b4d-4q9a-b865-2y678976543a',
                            name: 'dell-2u-compute-v1-256g-10-12tb',
                            occupant: {
                                asset_tag: null,
                                created: '2017-08-14T23:37:37.182853-07:00',
                                graduated: null,
                                hardware_product:
                                    'e3e7c2c0-7b4d-4q9a-b865-2y678976543h',
                                health: 'pass',
                                id: 'ACEGI82',
                                rack_id: 'e3e7c2c0-7b4d-4q9a-b865-2y678976543a',
                                validated: '2018-01-10T17:36:24.965412-08:00',
                            },
                            vendor: 'Dell',
                        },
                    ],
                },
                {
                    datacenter: 'us-west-1b',
                    id: 'e3e7c2c0-7b4d-4q9a-b865-2y6789765432',
                    name: 'SW-03F-126029',
                    role: 'TRITON',
                },
            ],
        };
    },
    methods: {
        addRack(rack) {
            this.selectedRacks.push(rack);
        },
        isRackSelected(rack) {
            return this.selectedRacks.indexOf(rack) !== -1;
        },
        removeRack(rack) {
            const index = this.selectedRacks.indexOf(rack);
            this.selectedRacks.splice(index, 1);
        },
    },
    computed: {
        filteredRacks() {
            let racks = this.racks;
            const searchText = this.searchText.toLowerCase();

            if (searchText) {
                return racks.reduce((acc, rack) => {
                    const name = rack.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(rack);
                    }

                    return acc;
                }, []);
            }

            return racks;
        },
    },
};
</script>
