<template>
    <div class="overview-tab">
        <div class="level">
            <div class="level-left">
                <div class="level-item tags">{{ deviceTags }}</div>
            </div>
            <div class="level-right" v-if="activeDevice.location">
                <div class="level-item">
                    <div class="button is-small is-link is-rounded" @click="showDeviceInRack">Show Device in Rack</div>
                </div>
            </div>
        </div>
        <section class="info-tiles">
            <div class="tile is-ancestor has-text-centered">

            </div>
        </section>
    </div>
</template>

<script>
export default {
    props: {
        activeDevice: {
            required: true,
        },
        activeDeviceId: {
            required: true,
        },
        deviceSettings: {
            required: true,
        },
    },
    data() {
        return {
            deviceTags: [],
        };
    },
    methods: {
        showDeviceInRack() {

        },
    },
};
</script>
