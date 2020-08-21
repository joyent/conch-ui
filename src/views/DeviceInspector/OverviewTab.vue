<template>
    <div class="overview-tab">
        <div class="level">
            <div class="level-left">
                <div class="level-item tags are-medium">
                    <div
                        class="tag"
                        v-for="(tag, index) in deviceTags"
                        :key="index"
                        :class="tag.style"
                    >
                        {{ tag.title }}
                    </div>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                    <button
                        class="button update-phase is-info"
                        @click="updatingPhase = true"
                    >
                        Update Phase
                    </button>
                </div>
                <div class="level-item" v-if="activeDeviceDetails.location">
                    <button
                        class="button show-device-in-rack is-info"
                        @click="showDeviceInRack()"
                    >
                        Show Device in Rack
                    </button>
                </div>
            </div>
        </div>
        <div class="columns" v-if="errorMessage">
            <div class="column is-12">
                <article class="message is-danger">
                    <div class="message-header">
                        <p class="">Error: {{ errorMessage }}</p>
                        <button
                            class="delete"
                            aria-label="delete"
                            @click="errorMessage = ''"
                        ></button>
                    </div>
                </article>
            </div>
        </div>
        <section class="info-tiles">
            <div class="tile is-ancestor has-text-centered">
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <p class="subtitle">Phase</p>
                        <p class="title device-phase is-capitalized">
                            {{ activeDeviceDetails.phase }}
                        </p>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <p class="subtitle" style="margin-bottom: 10px"
                            >Hardware Product</p
                        >
                        <a
                            class="is-size-5 device-phase has-text-white"
                            @click="
                                navigateToHardwareProduct(
                                    activeDeviceDetails.hardware_product_id
                                )
                            "
                        >
                            {{
                                getHardwareProductName(
                                    activeDeviceDetails.hardware_product_id
                                )
                            }}
                        </a>
                    </article>
                </div>
            </div>
            <div class="tile is-ancestor has-text-centered">
                <div class="tile is-parent is-vertical">
                    <article class="tile is-child box last-seen">
                        <p class="subtitle">Last Reported</p>
                        <p class="title" v-if="activeDeviceDetails.last_seen">
                            {{ lastSeen }}
                        </p>
                        <p class="title" v-else>Never</p>
                    </article>
                    <article class="tile is-child box uptime-since">
                        <p class="subtitle">Uptime</p>
                        <p
                            class="title"
                            v-if="activeDeviceDetails.uptime_since"
                        >
                            {{ uptimeSince }}
                        </p>
                        <p class="title" v-else>Unknown</p>
                    </article>
                    <article class="tile is-child box bios-version">
                        <p class="subtitle">BIOS Version</p>
                        <p class="title" v-if="hasBiosVersion">
                            {{ activeDeviceDetails.latest_report.bios_version }}
                        </p>
                        <p class="title" v-else>Unknown</p>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child box">
                        <p class="subtitle">Time for Burn-in</p>
                        <TimeToBurnin />
                    </article>
                </div>
            </div>
        </section>
        <transition name="fade">
            <PhaseUpdateModal
                :item="'device'"
                :item-data="activeDeviceDetails"
                v-if="updatingPhase"
            />
        </transition>
    </div>
</template>

<script>
import moment from 'moment';
import TimeToBurnin from './TimeToBurnin.vue';
import PhaseUpdateModal from '@src/views/components/PhaseUpdateModal.vue';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapGetters, mapState } from 'vuex';
import { getHardwareProducts } from '@api/hardwareProduct.js';

export default {
    components: {
        PhaseUpdateModal,
        TimeToBurnin,
    },
    data() {
        return {
            errorMessage: '',
            hardwareProducts: [],
            updatingPhase: false,
        };
    },
    methods: {
        ...mapActions([
            'setActiveRoomName',
            'setHighlightDeviceId',
            'setShowDeviceInRack',
        ]),
        closeModal() {
            this.updatingPhase = false;
        },
        getHardwareProductName(id) {
            const product = this.hardwareProducts.find(
                product => product.id === id
            );

            if (product) {
                return product.name;
            } else {
                return 'Unknown';
            }
        },
        navigateToHardwareProduct(id) {
            this.$router.push({ name: 'hardware-product', params: { id } });
        },
        setError(error) {
            this.errorMessage =
                (error && error.data && error.data.error) ||
                'An error occurred';
            this.editProduct = false;
            this.isLoading = false;
        },
        showDeviceInRack() {
            const { id } = this.activeDeviceDetails;
            const { az, rack } = this.activeDeviceDetails.location;

            this.setHighlightDeviceId(id);
            this.setActiveRoomName(az);

            EventBus.$emit('closeModal:deviceModal');
            EventBus.$emit('showDeviceInRack');

            this.setShowDeviceInRack(true);

            this.$router.push({
                path: `/datacenter/${az}/rack/${rack}/device?highlightDeviceId=${id}`,
            });
        },
    },
    computed: {
        ...mapGetters(['activeDeviceId']),
        ...mapState(['activeDeviceDetails', 'activeDeviceSettings']),
        deviceTags() {
            const tags = [];
            let health;

            // Todo: Look into loading activeDeviceDetails data faster
            //       If a user clicks through the UI fast, health may
            //       not exist yet
            if (this.activeDeviceDetails.health) {
                health = this.activeDeviceDetails.health.toLowerCase();

                if (health === 'fail') {
                    tags.push({
                        style: 'is-danger health-fail',
                        title: 'Failing Validation',
                    });
                } else if (health === 'pass') {
                    tags.push({
                        style: 'is-info health-pass',
                        title: 'Passing Validation',
                    });
                } else if (health === 'unknown') {
                    tags.push({
                        style: 'is-warning health-unknown',
                        title: 'No Report',
                    });
                }
            }

            if (this.activeDeviceSettings.firmware === 'updating') {
                tags.push({
                    style: 'is-warning firmware-updating',
                    title: 'Firmware Updating',
                });
            }

            if (this.activeDeviceDetails.validated) {
                tags.push({
                    style: 'is-success validated',
                    title: 'Validated',
                });
            }

            if (this.activeDeviceDetails.graduated) {
                tags.push({
                    style: 'is-success graduated',
                    title: 'Graduated',
                });
            }

            if (this.activeDeviceDetails.triton_setup) {
                tags.push({
                    style: 'is-success triton-setup',
                    title: 'Triton Setup',
                });
            }

            return tags;
        },
        hasBiosVersion() {
            return (
                this.activeDeviceDetails.latest_report &&
                this.activeDeviceDetails.latest_report.bios_version
            );
        },
        lastSeen() {
            return moment(this.activeDeviceDetails.last_seen).fromNow();
        },
        uptimeSince() {
            return moment(this.activeDeviceDetails.uptime_since).fromNow(true);
        },
    },
    async mounted() {
        let response;

        try {
            response = await getHardwareProducts();
            this.hardwareProducts = response.data;
        } catch (error) {
            this.setError(error);
        }

        EventBus.$on('closeModal:baseModal', () => {
            this.closeModal();
        });
    },
};
</script>
