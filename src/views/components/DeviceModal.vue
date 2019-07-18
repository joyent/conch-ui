<template>
    <div
        class="modal device-modal"
        :class="{ 'is-active': isActive }"
        style="align-items: start;"
    >
        <div class="modal-background" @click="closeModal()"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title has-text-left">
                    Device {{ activeDeviceId }}
                </p>
                <button
                    class="delete"
                    aria-label="close"
                    @click="closeModal()"
                ></button>
            </header>
            <section class="modal-card-body">
                <DeviceInspector v-if="activeDeviceId" />
                <Spinner v-else />
            </section>
            <footer class="modal-card-foot"></footer>
        </div>
    </div>
</template>

<script>
import DeviceInspector from '@views/DeviceInspector/DeviceInspector.vue';
import Spinner from './Spinner.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapGetters } from 'vuex';

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
        ...mapGetters(['activeDeviceId']),
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
