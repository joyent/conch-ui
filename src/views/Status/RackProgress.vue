<template>
    <div class="rack-progress">
        <div class="rack-progress-graph"></div>
    </div>
</template>

<script>
import RelationshipGraph from 'd3-relationshipgraph';
import { select, selectAll } from 'd3-selection';
import { mapState } from 'vuex';

const statusSortOrder = {};
statusSortOrder["Validated"] = 1;
statusSortOrder["Failing"] = 2;
statusSortOrder["In Progress"] = 3;
statusSortOrder["Not Started"] = 4;

const roleSortOrder = {};
roleSortOrder["TRITON"] = 1;
roleSortOrder["MANTA"] = 2;
roleSortOrder["MANTA_TALL"] = 3;
roleSortOrder["CERES"] = 4;

export default {
    props: {
        group: {
            required: true,
        },
    },
    data() {
        return {
            graph: null,
        };
    },
    methods: {
        nodeParent(device_progress) {
            // If there's any failing devices, the whole rack is Failing
            if (device_progress.FAIL) {
                return "Failing";
            }

            // If there's no passing and no validated devices (or no devices at all),
            // then the rack hasn't started validation
            if (!device_progress.PASS && !device_progress.VALID) {
                return "Not Started";
            }

            // If the only devices are validated, then the rack has finished validation
            if (device_progress.VALID && !device_progress.PASS && !device_progress.UNKNOWN) {
                return "Validated";
            }

            // There's a mixture of passing and unknown devices
            return "In Progress";
        },
        // Calculate a numerical value between [-1..100] based on the status of devices
        // in the rack. -1 when any device is failing, 0 when all devices are unknown
        // (haven't yet reported), 100 when all devices are validated, 50 when all
        // devices are passing, and somewhere between 0 and 100 otherwise
        nodeValue(device_progress) {
            // Any failing rack should show up as another color
            if (device_progress.FAIL) {
                return -1;
            }

            const pass = device_progress.PASS || 0;
            const unknown = device_progress.UNKNOWN || 0;
            const valid = device_progress.VALID || 0;
            const total = pass + unknown + valid;

            // validated devices worth 2 points, passing 1, unknown 0
            const points = valid * 2 + pass;

            // normalize to 100 percent. 0 if total is 0
            const score = total ? Math.trunc(100 * (points / 2 / total)) : 0;
            return score;
        },
        selectParentRole(rack) {
            return rack.role;
        },
        selectParentStatus(rack) {
            return this.nodeParent(rack.device_progress);
        },
        sortNodesRole(nodes) {
            const sortOrder = {
                'TRITON': 1,
                'MANTA': 2,
                'MANTA_TALL': 3,
                'CERES': 4
            };

            nodes.sort((a, b) => {
                if (sortOrder[a.parent] === sortOrder[b.parent]) {
                    return b.value - a.value;
                }

                return sortOrder[a.parent] > sortOrder[b.parent] ? 1 : -1;
            });
        },
        sortNodesStatus(nodes) {
            const sortOrder = {
                'Validated': 1,
                'Failing': 2,
                'In Progress': 3,
                'Not Started': 4
            };

            nodes.sort((a, b) => {
                if (sortOrder[a.parent] === sortOrder[b.parent]) {
                    return b.value - a.value;
                }

                return sortOrder[a.parent] > sortOrder[b.parent] ? 1 : -1;
            });
        },
    },
    watch: {
        rackRooms() {
            this.graph.data(this.rackStatus);
        },
    },
    computed: {
        ...mapState([
            'rackRooms',
        ]),
        rackStatus() {
            return Object.keys(this.rackRooms).reduce((acc, room) => {
                this.rackRooms[room].forEach(rack => {
                    acc.push({
                        Room: room,
                        "Rack Name": rack.name,
                        "Rack Role": rack.role,
                        "Rack size": rack.size,
                        parent: this.group === 'status' ? this.selectParentStatus(rack) : this.selectParentRole(rack),
                        value: this.nodeValue(rack.device_progress),
                        _private_: {
                            room_name: room,
                            rack_id: rack.id
                        }
                    });
                });

                return acc;
            }, []);
        },
    },
    mounted() {
        this.graph = new RelationshipGraph(select(this.$el), {
            showTooltips: true,
            maxChildCount: 10,
            showKeys: true,
            sortFunction: this.group === 'status' ? this.sortNodesStatus : this.sortNodesRole,
            thresholds: [-1, 0, 25, 50, 75, 99, 100],
            colors: [
                "hsl(0, 80%, 60%)",
                "hsl(225, 20%, 85%)",
                "hsl(225, 50%, 80%)",
                "hsl(225, 80%, 70%)",
                "hsl(190, 60%, 60%)",
                "hsl(160, 60%, 60%)",
                "hsl(130, 60%, 60%)"
            ],
            onClick: {
                child: ({ _private_ }) => {
                    let path = window.location.href.split("/");
                    path.pop();
                    path = path.join("/");
                    window.location.href = `${path}/datacenter/${_private_.room_name}/rack/${_private_.rack_id}/device`;
                }
            }
        }).data(this.rackStatus);

        // This forceUpdate fixes an issue with d3-relationshipgraph not displaying
        // tooltips for both RackProgress graphs. If this forceUpdate is not called,
        // tooltips will only display for the last graph loaded on the page.
        this.$forceUpdate();
    },
    updated() {
        this.graph.data(this.rackStatus);
    },
    destroyed() {
        selectAll('svg').remove();
    },
};
</script>
