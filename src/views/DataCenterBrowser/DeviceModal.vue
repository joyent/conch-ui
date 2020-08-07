<template>
    <div
        class="modal device-modal"
        :class="{ 'is-active': isActive }"
        style="align-items: start;"
        v-if="activeDevice && activeDevice.id"
    >
        <div class="modal-background" @click="closeModal()"></div>
        <div class="modal-card device-modal">
            <header class="modal-card-head">
                <p class="modal-card-title has-text-left">
                    {{ activeDevice.serial_number }}
                </p>
                <i class="material-icons close" @click="closeModal()">
                    close
                </i>
            </header>
            <section class="modal-card-body">
                <DeviceInspector />
            </section>
            <footer class="modal-card-foot"></footer>
        </div>
    </div>
    <div class="modal empty-slot" :class="{ 'is-active': isActive }" v-else>
        <div class="modal-background" @click="closeModal()"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">No Device</p>
                <i class="material-icons close" @click="closeModal()">
                    close
                </i>
            </header>
            <section class="modal-card-body">
                <p>
                    There is no device in this slot.
                </p>
                <a class="button" @click="closeModal()">
                    Close
                </a>
            </section>
        </div>
    </div>
</template>

<script>
import DeviceInspector from '@views/DeviceInspector/DeviceInspector.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: { DeviceInspector },
    data() {
        return {
            isActive: false,
        };
    },
    methods: {
        ...mapActions(['clearActiveDevice']),
        closeModal() {
            EventBus.$emit('closeModal:deviceModal');
            this.clearActiveDevice();
        },
    },
    computed: {
        ...mapState(['activeDevice']),
    },
    mounted() {
        EventBus.$on('openModal:deviceModal', () => {
            this.isActive = true;
        });

        EventBus.$on('closeModal:deviceModal', () => {
            this.isActive = false;
        });
    },
};
</script>
