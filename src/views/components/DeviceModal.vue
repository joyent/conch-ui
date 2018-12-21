<template>
    <div class="modal" style="align-items: start;">
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-card" style="margin-top: 5vh">
            <header class="modal-card-head">
                <p class="modal-card-title has-text-left">
                    Device {{ activeDeviceId }}
                </p>
                <button class="delete" aria-label="close" @click="closeModal"></button>
            </header>
            <section class="modal-card-body">
                <DeviceInspector :active-device-id="activeDeviceId" />
            </section>
            <footer class="modal-card-foot is-right"></footer>
        </div>
    </div>
</template>

<script>
import DeviceInspector from '../DeviceInspector/DeviceInspector.vue';

export default {
    props: {
        activeDeviceId: {
            required: true,
        },
    },
    components: {
        DeviceInspector,
    },
    data() {
        return {
        };
    },
    methods: {
        closeModal() {

        },
    },
};
</script>
