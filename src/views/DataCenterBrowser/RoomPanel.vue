<template>
    <nav class="panel room-panel">
        <p class="panel-heading has-text-centered">Datacenter Rooms</p>
        <div class="panel-block">
            <p class="control has-icons-left">
                <input
                    type="text"
                    class="input is-small"
                    placeholder="Search Rooms"
                    v-model="searchText"
                />
                <span class="icon is-small is-left">
                    <i class="fas fa-search"></i>
                </span>
            </p>
        </div>
        <p class="panel-tabs" v-if="filteredRackRooms.length > 0">
            <a
                :class="{ 'is-active': selectedProgress === progress }"
                @click="selectedProgress = progress"
                v-for="(progress, index) in availableRoomProgress"
                :key="index"
                style="whitespace: pre"
            >
                {{ progress }}
            </a>
        </p>
        <template v-if="filteredRackRooms.length > 0">
            <a
                v-for="(room, index) in filteredRackRooms"
                :key="index"
                class="panel-block"
                :class="{ 'is-active': activeRoomName === room.name }"
                @click="activateRoom(room)"
            >
                <div class="panel-icon">
                    <ProgressIcon :progress="room.progress" />
                </div>
                {{ room.name }}
            </a>
        </template>
        <p
            class="panel-block"
            v-else-if="filteredRackRooms.length === 0 && searchText"
            style="justify-content: center;"
        >
            No rooms found
        </p>
    </nav>
</template>

<script>
import search from 'fuzzysearch';
import isEmpty from 'lodash/isEmpty';
import ProgressIcon from '@views/components/ProgressIcon.vue';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        ProgressIcon,
    },
    data() {
        return {
            searchText: '',
            selectedProgress: 'all',
        };
    },
    methods: {
        ...mapActions(['clearRackLayout', 'setActiveRoomName']),
        activateRoom(room) {
            if (room.name) {
                this.setActiveRoomName(room.name);
            }

            if (!isEmpty(this.rackLayout)) {
                this.clearRackLayout();
            }

            this.$router.push({
                name: 'datacenterRoom',
                params: { roomName: this.activeRoomName },
            });
        },
        roomNameFilter(roomName) {
            return search(
                this.searchText.toLowerCase(),
                roomName.toLowerCase()
            );
        },
        roomProgressFilter(progress) {
            return (
                this.selectedProgress === 'all' ||
                this.selectedProgress === progress
            );
        },
    },
    computed: {
        ...mapState(['activeRoomName', 'rackLayout', 'rackRooms']),
        availableRoomProgress() {
            if (this.rackRooms.length) {
                return Array.from(
                    this.rackRooms.reduce((acc, room) => {
                        if (!acc.has(room.progress)) {
                            acc.add(room.progress);
                        }

                        return acc;
                    }, new Set(['all']))
                ).sort();
            }

            return [];
        },
        filteredRackRooms() {
            if (this.rackRooms.length) {
                return this.rackRooms.reduce((acc, room) => {
                    if (
                        this.roomNameFilter(room.name) &&
                        this.roomProgressFilter(room.progress)
                    ) {
                        acc.push(room);
                    }

                    return acc;
                }, []);
            }

            return [];
        },
    },
};
</script>
