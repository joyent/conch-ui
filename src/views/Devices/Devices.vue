<template>
    <div class="device-browser">
        <article class="message is-danger" v-if="showError">
            <div class="message-header">
                <p>Invalid Serial Number</p>
                <button
                    class="delete"
                    aria-label="delete"
                    @click="showError = false"
                ></button>
            </div>
        </article>
        <div class="field has-addons">
            <div class="control has-icons-left device-search">
                <input
                    type="text"
                    class="input search"
                    placeholder="Enter Device Serial Number..."
                    v-model.trim="serialNumber"
                    @keyup.enter="searchDevice()"
                />
                <span class="icon is-small is-left">
                    <i class="material-icons">search</i>
                </span>
            </div>
            <div class="control">
                <a
                    class="button is-info search"
                    :class="{ 'is-loading': isLoading }"
                    @click="searchDevice()"
                >
                    Search
                </a>
            </div>
        </div>
        <div class="columns">
            <div class="column is-12">
                <div class="device-details" v-if="!isEmpty(activeDevice)">
                    <div class="box has-text-centered serial-number">
                        <div class="subtitle has-text-white">
                            {{ activeDevice.serial_number }}
                        </div>
                    </div>
                    <DeviceInspector />
                </div>
                <div class="empty-state" v-else>
                    <p class="empty-state-heading">Search for a Device</p>
                    <img
                        src="../../assets/artificial-intelligence.svg"
                        width="500"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DeviceInspector from '@views/DeviceInspector/DeviceInspector.vue';
import isEmpty from 'lodash/isEmpty';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapState } from 'vuex';
import { getDeviceDetails } from '@api/devices.js';

export default {
    components: { DeviceInspector },
    data() {
        return {
            isLoading: false,
            serialNumber: '',
            showDeviceInRack: false,
            showError: false,
        };
    },
    methods: {
        ...mapActions([
            'clearActiveDevice',
            'clearActiveRoomName',
            'clearRackLayout',
            'setActiveDevice',
        ]),
        clearActiveData() {
            this.clearActiveDevice();
            this.clearActiveRoomName();
            this.clearRackLayout();
        },
        isEmpty,
        async getDevice(identifier) {
            try {
                await getDeviceDetails(identifier)
                    .then(response => {
                        const device = response.data;
                        this.setActiveDevice(device);
                        this.isLoading = false;
                    })
                    .catch(error => {
                        this.isLoading = false;

                        if (error.status === 404) {
                            this.showError = true;
                        }
                    });
            } catch (error) {
                this.showError = true;
            }
        },
        searchDevice() {
            const serialNumber = this.serialNumber;

            if (serialNumber) {
                this.isLoading = true;

                getDeviceDetails(serialNumber)
                    .then(response => {
                        const device = response.data;
                        this.setActiveDevice(device);

                        this.$router.push({
                            name: 'device',
                            params: {
                                deviceId: device.id,
                            },
                        });

                        this.isLoading = false;
                    })
                    .catch(error => {
                        this.isLoading = false;

                        if (error.status === 404) {
                            this.showError = true;
                        }
                    });
            } else {
                this.showError = true;
            }
        },
    },
    computed: {
        ...mapState(['activeDevice']),
    },
    mounted() {
        if (this.$route.params && this.$route.params.deviceId) {
            if (!this.activeDevice || !this.activeDevice.id) {
                this.getDevice(this.$route.params.deviceId);
            }
        }

        EventBus.$on('showDeviceInRack', () => {
            this.showDeviceInRack = true;
        });
    },
    destroyed() {
        if (!this.showDeviceInRack) {
            this.clearActiveData();
        }
    },
};
</script>
