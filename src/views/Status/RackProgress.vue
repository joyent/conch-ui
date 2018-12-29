<template>
    <div class="rack-progress-graph"></div>
</template>

<script>
import { select, selectAll } from 'd3-selection';
import RelationshipGraph from 'd3-relationshipgraph';

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

const sortNodes = sortOrder => nodes =>
	nodes.sort((a, b) => {
		if (sortOrder[a.parent] === sortOrder[b.parent])
			// sort by percentage validated within groups
			return b.value - a.value;
		else return sortOrder[a.parent] > sortOrder[b.parent] ? 1 : -1;
	});

export default {
    props: {
        rackRooms: {
            required: true,
        },
        group: {
            required: false,
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
        // sortNodes(sortOrder) {
        //     return function(nodes) {
        //         nodes.sort((a, b) => {
        //             if (sortOrder[a.parent] === sortOrder[b.parent]) {
        //                 return b.value - a.value;
        //             } else {
        //                 return sortOrder[a.parent] > sortOrder[b.parent] ? 1 : -1;
        //             }
        //         });
        //     };
        // },
        selectParent(rack) {
            if (this.group === undefined || this.group === 'status') {
                return this.nodeParent(rack.device_progress);
            }

            return rack.role;
        },
        sortFunction(nodes) {
            if (this.group === undefined || this.group === 'status') {
                return sortNodes(statusSortOrder);
            }

            return sortNodes(roleSortOrder);
        },
    },
    computed: {
        rackStatus() {
            return Object.keys(this.rackRooms).reduce((acc, room) => {
                this.rackRooms[room].forEach(rack => {
                    acc.push({
                        Room: room,
                        "Rack Name": rack.name,
                        "Rack Role": rack.role,
                        "Rack size": rack.size,
                        parent: this.selectParent(rack),
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
            sortFunction: this.sortFunction,
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
                    window.open(
                        `${path}/datacenter/${
                            _private_.room_name
                        }/rack/${_private_.rack_id}/device`,
                        "_blank"
                    );
                }
            }
        }).data(this.rackStatus);
    },
    updated() {
        this.graph.configuration.sortFunction = this.sortFunction;
        this.graph.data(this.rackStatus);
    },
    beforeDestroy() {
        selectAll('svg').remove();
    },
};
</script>
