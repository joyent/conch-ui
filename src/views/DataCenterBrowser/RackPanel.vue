<template>
    <nav class="panel">
        <p class="panel-heading">{{ this.activeRoomName }} Racks</p>
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
                style="white-space:pre"
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
            @click="activeRackId = rack.id"
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
import ProgressIcon from './ProgressIcon.vue';
import { rackToProgress } from './util.js';

export default {
    props: {
        activeRacks: {
            required: true,
        },
    },
    data() {
        return {
            activeRackId: '',
            activeRacks: '',
            activeRoomName: '',
            availableRackRoles: '',
            availableRackProgress: '',
            rackFilterText: '',
            selectedProgress: 'all',
            selectedRole: 'all',
        };
    },
    computed: {
        filteredActiveRacks() {
            return this.activeRacks.reduce((acc, rack) => {
                if (this.rackFilterMatch(rack)) {
                    acc.push(rack);
                }

                return acc;
            })
        },
        rackFilterTextLowerCase() {
            return this.rackFilterText.map(t => t.toLowerCase());
        },
    },
    methods: {
        rackFilterMatch(rack) {
            return this.rackNameFilter(rack.name) && this.rackRoleFilter(rack.role) && this.rackProgressFilter(rack);
        },
        rackNameFilter(rackName) {
            return search(this.rackFilterTextLowerCase(), rackName.toLowerCase());
        },
        rackRoleFilter(role) {
            return this.selectedRole === 'all' || this.selectedRole === role.toLowerCase();
        },
        rackProgressFilter(rack) {
            return this.selectedProgress === 'all' || this.selectedProgress === rackToProgress(rack);
        },
    },
    created() {
        // get the list of available rack roles
        this.availableRackRoles = this.activeRacks.map(racks => {
            Array.from(
                racks.reduce((acc, rack) => {
                    acc.add(rack.role.toLowerCase());

                    return acc;
                }, new Set(['all']))
            ).sort();
        });

        this.availableRackProgress = activeRacks.map(racks => {
            Array.from(
                racks.reduce((acc, rack) => {
                    acc.add(rackToProgress(rack));
                    return acc;
                }, new Set(["all"]))
            ).sort();
        });

        activeRacks.map(() => {
            selectedRole("all");
            selectedProgress("all");
            rackFilterText("");
        });
    },
};
</script>
