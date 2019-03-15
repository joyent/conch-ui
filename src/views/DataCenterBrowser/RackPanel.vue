<template>
    <nav class="panel rack-panel">
        <p class="panel-heading has-text-centered">{{ this.activeRoomName }} Racks</p>
        <div class="panel-block">
            <p class="control has-icons-left">
                <input type="text" class="input is-small" placeholder="Search Racks" v-model="rackFilterText">
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
            :class="{ 'is-active': activeRackId === rack.id }"
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
import search from "fuzzysearch";
import ProgressIcon from '../components/ProgressIcon.vue';
import { mapActions, mapGetters } from 'vuex';
import { getRackById } from '../../api/workspaces';
import { EventBus } from '../../eventBus.js';

export default {
    props: {
        activeRacks: {
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
        ...mapGetters([
            'activeRackId',
            'activeRoomName',
            'currentWorkspaceId',
        ]),
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
        ...mapActions([
            'setRackLayout',
        ]),
        activateRack(rack) {
            getRackById(this.currentWorkspaceId, rack.id)
                .then(response => {
                    this.setRackLayout(response);

                    this.$router.push({ name: 'datacenterRack', params: { rackId: `${this.activeRackId}` } })
                });
        },
        rackFilterMatch(rack) {
            return this.rackNameFilter(rack.name) && this.rackRoleFilter(rack.role) && this.rackProgressFilter(rack);
        },
        rackNameFilter(rackName) {
            return search(this.rackFilterTextLowerCase, rackName.toLowerCase());
        },
        rackToProgress(rack) {
            if (rack["device_progress"]["FAIL"]) {
                return "failing";
            } else if (rack["device_progress"]["PASS"]) {
                return "in progress";
            } else if (rack["device_progress"]["VALID"]) {
                return "validated";
            } else {
                return "not started";
            }
        },
        rackRoleFilter(role) {
            return this.selectedRole === 'all' || this.selectedRole === role.toLowerCase();
        },
        rackProgressFilter(rack) {
            return this.selectedProgress === 'all' || this.selectedProgress === this.rackToProgress(rack);
        },
    },
    created() {
        // get the list of available rack roles
        this.availableRackRoles = Array.from(
            this.activeRacks.reduce((acc, rack) => {
                let rackRole = rack.role.toLowerCase();

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
            }, new Set(["all"]))
        ).sort();
    },
    mounted() {
        EventBus.$on('refreshRackLayout', rack => {
            this.activateRack(rack);
        });
    },
};
</script>
