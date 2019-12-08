<template>
    <nav class="panel rack-panel">
        <p class="panel-heading has-text-centered">
            {{ activeRoomName }} Racks
        </p>
        <div class="panel-block">
            <p class="control has-icons-left">
                <input
                    type="text"
                    class="input is-small"
                    placeholder="Search Racks"
                    v-model="rackFilterText"
                />
                <span class="icon is-small is-left">
                    <i class="fas fa-search"></i>
                </span>
            </p>
        </div>
        <p class="panel-tabs">
            <a
                v-for="(progress, index) in availableRackProgress"
                :key="index"
                :class="{ 'is-active': selectedProgress === progress }"
                @click="selectedProgress = progress"
            >
                {{ progress }}
            </a>
        </p>
        <p class="panel-tabs">
            <a
                v-for="(role, index) in availableRackRoles"
                :key="index"
                :class="{ 'is-active': selectedRole === role }"
                @click="selectedRole = role"
            >
                {{ role }}
            </a>
        </p>
        <a
            v-for="(rack, index) in filteredActiveRacks"
            :key="index"
            class="panel-block"
            :class="{ 'is-active': rackLayout.id === rack.id }"
            @click="activateRack(rack)"
        >
            <div class="panel-icon">
                <ProgressIcon :progress="rackToProgress(rack)" />
            </div>
            {{ rack.name }}
        </a>
    </nav>
</template>

<script>
import search from 'fuzzysearch';
import ProgressIcon from '@views/components/ProgressIcon.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import { getRackById } from '@api/workspaces';
import { EventBus } from '@src/eventBus.js';

export default {
    props: {
        activeRacks: {
            type: Array,
            required: true,
        },
    },
    components: {
        ProgressIcon,
    },
    data() {
        return {
            availableRackRoles: '',
            availableRackProgress: '',
            rackFilterText: '',
            selectedProgress: 'all',
            selectedRole: 'all',
        };
    },
    computed: {
        ...mapGetters(['currentWorkspaceId']),
        ...mapState(['activeRoomName', 'rackLayout']),
        filteredActiveRacks() {
            return this.activeRacks.reduce((acc, rack) => {
                if (this.rackFilterMatch(rack)) {
                    acc.push(rack);
                }

                return acc;
            }, []);
        },
        rackFilterTextLowerCase() {
            return this.rackFilterText.toLowerCase();
        },
    },
    methods: {
        ...mapActions(['setRackLayout']),
        activateRack(rack) {
            getRackById(this.currentWorkspaceId, rack.id).then(response => {
                this.setRackLayout(response);

                this.$router.push({
                    name: 'datacenterRack',
                    params: { rackId: `${this.rackLayout.id}` },
                });
            });
        },
        rackFilterMatch(rack) {
            return (
                this.rackNameFilter(rack.name) &&
                this.rackRoleFilter(rack.rack_role_name) &&
                this.rackProgressFilter(rack)
            );
        },
        rackNameFilter(rackName) {
            return search(this.rackFilterTextLowerCase, rackName.toLowerCase());
        },
        rackToProgress(rack) {
            if (rack['device_progress']['fail']) {
                return 'failing';
            } else if (rack['device_progress']['pass']) {
                return 'in progress';
            } else if (rack['device_progress']['valid']) {
                return 'validated';
            } else {
                return 'not started';
            }
        },
        rackRoleFilter(role) {
            return (
                this.selectedRole === 'all' ||
                this.selectedRole === role.toLowerCase()
            );
        },
        rackProgressFilter(rack) {
            return (
                this.selectedProgress === 'all' ||
                this.selectedProgress === this.rackToProgress(rack)
            );
        },
    },
    created() {
        // get the list of available rack roles
        this.availableRackRoles = Array.from(
            this.activeRacks.reduce((acc, rack) => {
                const rackRole = rack.rack_role_name.toLowerCase();

                if (!acc.has(rackRole)) {
                    acc.add(rackRole);
                }

                return acc;
            }, new Set(['all']))
        ).sort();

        this.availableRackProgress = Array.from(
            this.activeRacks.reduce((acc, rack) => {
                acc.add(this.rackToProgress(rack));

                return acc;
            }, new Set(['all']))
        ).sort();
    },
    mounted() {
        EventBus.$on('refreshRackLayout', rack => {
            this.activateRack(rack);
        });
    },
};
</script>
