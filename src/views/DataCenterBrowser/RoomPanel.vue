<template>
    <nav class="panel room-panel">
        <p class="panel-heading has-text-centered">Datacenter Rooms</p>
        <div class="panel-block">
            <p class="control has-icons-left">
                <input
                    type="text"
                    class="input is-small"
                    placeholder="Search Rooms"
                    v-model="roomFilterText"
                />
                <span class="icon is-small is-left">
                    <i class="fas fa-search"></i>
                </span>
            </p>
        </div>
        <p class="panel-tabs">
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
    </nav>
</template>

<script>
import search from 'fuzzysearch';
import isEmpty from 'lodash/isEmpty';
import ProgressIcon from '@views/components/ProgressIcon.vue';
import { mapActions, mapState } from 'vuex';

export default {
    props: {
        rackRooms: {
            type: Array,
            required: true,
        },
    },
    components: {
        ProgressIcon,
    },
    data() {
        return {
            roomFilterText: '',
            selectedProgress: 'all',
        };
    },
    computed: {
        ...mapState(['activeRoomName', 'rackLayout']),
        availableRoomProgress() {
            return Array.from(
                this.rackRooms.reduce((acc, room) => {
                    if (!acc.has(room.progress)) {
                        acc.add(room.progress);
                    }

                    return acc;
                }, new Set(['all']))
            ).sort();
        },
        filteredRackRooms() {
            return this.rackRooms.reduce((acc, room) => {
                if (
                    this.roomNameFilter(room.name) &&
                    this.roomProgressFilter(room.progress)
                ) {
                    acc.push(room);
                }

                return acc;
            }, []);
        },
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
                params: {
                    roomName: `${this.activeRoomName}`,
                },
            });
        },
        roomFilterTextLowerCase() {
            return this.roomFilterText.toLowerCase();
        },
        roomNameFilter(roomName) {
            return search(
                this.roomFilterTextLowerCase(),
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
};
</script>
