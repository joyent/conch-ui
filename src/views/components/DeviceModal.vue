<template>
    <div class="modal device-modal" :class="{ 'is-active': isActive }" style="align-items: start;">
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-card" style="margin-top: 5vh">
            <header class="modal-card-head">
                <p class="modal-card-title has-text-left">
                    Device {{ activeDeviceId }}
                </p>
                <button class="delete" aria-label="close" @click="closeModal"></button>
            </header>
            <section class="modal-card-body">
                <DeviceInspector/>
            </section>
            <footer class="modal-card-foot is-right"></footer>
        </div>
    </div>
</template>

<script>
import DeviceInspector from '../DeviceInspector/DeviceInspector.vue';
import { EventBus } from '../../eventBus.js';
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        DeviceInspector,
    },
    data() {
        return {
            isActive: false,
        };
    },
    methods: {
        ...mapActions([
            'clearActiveDevice',
        ]),
        closeModal() {
            EventBus.$emit('closeModal:deviceModal');
            this.clearActiveDevice();
        },
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
        ]),
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
