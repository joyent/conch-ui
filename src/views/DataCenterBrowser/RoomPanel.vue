<template>
    <nav class="panel">
        <p class="panel-heading">Datacenter Rooms</p>
        <div class="panel-block">
            <p class="control has-icons-left">
                <input type="text" class="input is-small" placeholder="Search Rooms" v-model="roomFilterText">
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
                style="whitespace: pre">
                {{ progress }}
            </a>
        </p>
        <a v-for="(room, index) in rackRooms" :key="index" class="panel-block" :class="{ 'is-active': activeRoomName }" @click="activeRoomName = room.name">
            <div class="panel-icon">
                <ProgressIcon :progress="room.progress" />
            </div>
        </a>
    </nav>
</template>

<script>
import search from "fuzzysearch";
import ProgressIcon from './ProgressIcon.vue';

export default {
    props: {
        rackRooms: {
            required: true,
        },
    },
    data() {
        return {
            activeRoomName: '',
            roomFilterText: '',
            selectedProgress: 'all',
        };
    },
    computed: {
        availableRoomProgress() {
            return this.rackRooms.map(rooms => {
                Array.from(rooms.reduce((acc, room) => {
                    acc.add(room.progress);

                    return acc;
                }, new Set['all'])).sort();
            });
        },
        roomFilterTextLowerCase() {
            return roomFilterText.map(t => t.toLowerCase());
        },
        roomNameFilter(roomName) {
            return search(this.roomFilterTextLowerCase(), roomName.toLowerCase())
        },
        roomProgressFilter(p) {
            return this.selectedProgress === 'all' || this.selectedProgress === p
        },
    },
};
</script>
