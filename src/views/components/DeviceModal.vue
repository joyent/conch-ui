<template>
    <div
        class="modal device-modal"
        :class="{ 'is-active': isActive }"
        style="align-items: start;"
    >
        <div class="modal-background" @click="closeModal()"></div>
        <div class="modal-card" v-if="activeDevice && activeDevice.id">
            <header class="modal-card-head">
                <p class="modal-card-title has-text-left">
                    {{ activeDevice.serial_number }}
                </p>
                <button
                    class="delete"
                    aria-label="close"
                    @click="closeModal()"
                ></button>
            </header>
            <section class="modal-card-body">
                <DeviceInspector />
            </section>
            <footer class="modal-card-foot"></footer>
        </div>
        <div class="modal-card" v-else>
            <Spinner />
        </div>
    </div>
</template>

<script>
import DeviceInspector from '@views/DeviceInspector/DeviceInspector.vue';
import Spinner from './Spinner.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        DeviceInspector,
        Spinner,
    },
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
