<template>
    <div class="devices">
        <PageHeader :title="`${currentWorkspaceName} workspace devices`" :subtitle="'Search and filter workspace devices'" />
        <section class="info-tiles">
            <div class="tile is-ancestor has-text-right">
                <div class="tile is-parent">
                    <article class="tile is-child">
                        <section class="section" v-if="!workspaceDevices.length || hardWareProductLookup == undefined">
                            <Spinner/>
                        </section>
                        <div class="columns" v-else>
                            <div class="column is-4">
                                 <DevicesPanel :hardware-product-lookup="hardWareProductLookup" :workspace-devices="workspaceDevices" />
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
import PageHeader from '../components/PageHeader.vue';
import Spinner from '../components/Spinner.vue';
import DeviceInspector from '../DeviceInspector/DeviceInspector.vue';
import DevicesPanel from './DevicesPanel.vue';
import isEmpty from 'lodash/isEmpty';
import keyBy from 'lodash/keyBy';
import { EventBus } from '../../eventBus.js';
import { mapActions, mapGetters, mapState } from 'vuex';
import { getHardwareProduct } from '../../api/hardwareProduct.js';
import { getDevices } from '../../api/workspaces.js';

export default {
    components: {
        DeviceInspector,
        DevicesPanel,
        PageHeader,
        Spinner,
    },
    data() {
        return {
            workspaceDevices: [],
            hardWareProductLookup: {},
        };
    },
    methods: {
        ...mapActions([
            'clearActiveDevice',
            'setDevicesByWorkspace',
            'setHardwareProducts',
        ]),
        handleHardwareProductLookup() {
            if (!isEmpty(this.hardwareProducts)) {
                this.hardWareProductLookup = this.hardwareProducts;
            } else {
                getHardwareProduct().then(response => {
                    let hardwareProducts = keyBy(response.data, 'id');
                    this.hardWareProductLookup = hardwareProducts;
                    this.setHardwareProducts(hardwareProducts);
                });
            }
        },
        handleActiveDevice(devices) {
            let foundActiveDevice = false;
            let activeDeviceId = this.activeDeviceId;

            devices.sort((a, b) => {
                if (activeDeviceId != null && (activeDeviceId === a.id || activeDeviceId === b.id)) {
                    foundActiveDevice = true;
                }

                return a.id - b.id;
            });

            if (!foundActiveDevice) {
                this.clearActiveDevice();
            }
        },
        handleWorkspaceDevices() {
            let currentWorkspaceId = this.currentWorkspaceId;
            let workspaceDevicesFromState = this.getDevicesByWorkspace(currentWorkspaceId);

            if (workspaceDevicesFromState) {
                this.workspaceDevices = Object.values(workspaceDevicesFromState)[0];
                this.handleActiveDevice(this.workspaceDevices)
            } else {
                getDevices(currentWorkspaceId)
                    .then(response => {
                        let devices = response.data;
                        let workspace = {};
                        this.workspaceDevices = devices;
                        this.handleActiveDevice(this.workspaceDevices);

                        workspace[currentWorkspaceId] = devices;
                        this.setDevicesByWorkspace(workspace);
                    });
            }
        },
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
            'currentWorkspaceId',
            'currentWorkspaceName',
            'getDevicesByWorkspace',
        ]),
        ...mapState([
            'hardwareProducts',
        ]),
    },
    created() {
        const route = this.$route.path;
        const routePrefix = route.substring(0, route.indexOf('/device'));
        const activeDeviceId = this.activeDeviceId;

        let [_, queryS] = route.split('?');
        queryS ? (queryS = `?${queryS}`) : (queryS = '');

        if (activeDeviceId) {
            this.$router.push({ path: `${routePrefix}/device/${activeDeviceId}${queryS}` });
        } else {
            this.$router.push({ path: `${routePrefix}/device` });
        }

        this.handleHardwareProductLookup();
        this.handleWorkspaceDevices();
    },
    mounted() {
        EventBus.$on('changeWorkspace:devices', () => {
            this.handleHardwareProductLookup();
            this.handleWorkspaceDevices();
        });
    },
};
</script>
