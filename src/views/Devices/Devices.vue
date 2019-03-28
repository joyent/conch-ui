<template>
    <div class="devices">
        <PageHeader
            :title="`${currentWorkspaceName} workspace devices`"
            :subtitle="'Search and filter workspace devices'"
        />
        <section class="info-tiles">
            <div class="tile is-ancestor has-text-right">
                <div class="tile is-parent">
                    <article class="tile is-child">
                        <section class="section" v-if="isEmpty(workspaceDevices) || isEmpty(hardwareProductLookup)">
                            <Spinner/>
                        </section>
                        <div class="columns" v-else>
                            <div class="column is-4">
                                 <DevicesPanel
                                    :hardware-product-lookup="hardwareProductLookup"
                                    :workspace-devices="workspaceDevices"
                                />
                            </div>
                            <div class="column is-6 container" v-if="activeDeviceId">
                                <div class="div" style="position: -webkit-sticky; position: sticky; top: 0;">
                                    <div class="box has-text-left">
                                        <div class="subtitle">
                                            Device {{ activeDeviceId }}
                                        </div>
                                    </div>
                                    <DeviceInspector/>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import PageHeader from '@views/components/PageHeader.vue';
import Spinner from '@views/components/Spinner.vue';
import DeviceInspector from '@views/DeviceInspector/DeviceInspector.vue';
import DevicesPanel from './DevicesPanel.vue';
import isEmpty from 'lodash/isEmpty';
import keyBy from 'lodash/keyBy';
import { EventBus } from '@src/eventBus.js';
import { mapActions, mapGetters, mapState } from 'vuex';
import { getHardwareProduct } from '@api/hardwareProduct.js';
import { getWorkspaceDevices } from '@views/shared/utils';

export default {
    components: {
        DeviceInspector,
        DevicesPanel,
        PageHeader,
        Spinner,
    },
    data() {
        return {
            hardwareProductLookup: null,
            showDeviceInRack: false,
            workspaceDevices: null,
        };
    },
    methods: {
        ...mapActions([
            'clearActiveDevice',
            'clearActiveRoom',
            'clearRackLayout',
            'setHardwareProducts',
        ]),
        clearActiveData() {
            this.clearActiveDevice();
            this.clearActiveRoom();
            this.clearRackLayout();
        },
        isEmpty,
        setHardwareProductLookup() {
            if (!isEmpty(this.hardwareProducts)) {
                this.hardwareProductLookup = this.hardwareProducts;
            } else {
                getHardwareProduct().then(response => {
                    const hardwareProducts = keyBy(response.data, 'id');
                    this.hardwareProductLookup = hardwareProducts;
                    this.setHardwareProducts(hardwareProducts);
                });
            }
        },
        setWorkspaceDevices() {
            getWorkspaceDevices(this.currentWorkspaceId)
                .then(response => {
                    this.workspaceDevices = response;
                });
        },
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
            'currentWorkspaceId',
            'currentWorkspaceName',
        ]),
        ...mapState([
            'hardwareProducts',
        ]),
    },
    created() {
        const route = this.$route.path;
        const routePrefix = route.substring(0, route.indexOf('/device'));
        let activeDeviceId = this.activeDeviceId;

        if (!activeDeviceId && this.$route.params && this.$route.params.deviceId) {
            activeDeviceId = this.$route.params.deviceId;
        }

        let [_, queryS] = route.split('?');
        queryS ? (queryS = `?${queryS}`) : (queryS = '');

        if (activeDeviceId) {
            this.$router.push({ path: `${routePrefix}/device/${activeDeviceId}${queryS}` });
        } else {
            this.$router.push({ path: `${routePrefix}/device` });
        }

        this.setHardwareProductLookup();
        this.setWorkspaceDevices();
    },
    mounted() {
        EventBus.$on('changeWorkspace:devices', () => {
            this.setHardwareProductLookup();
            this.setWorkspaceDevices();
        });

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
