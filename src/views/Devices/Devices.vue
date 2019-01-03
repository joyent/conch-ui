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
import { mapGetters, mapActions } from 'vuex';
import { get } from '../../api/hardwareProduct.js';
import { getDevices } from '../../api/workspaces.js';
import keyBy from 'lodash/keyBy';

export default {
    components: {
        DeviceInspector,
        DevicesPanel,
        PageHeader,
        Spinner,
    },
    methods: {
        ...mapActions([
            'clearActiveDevice',
        ]),
    },
    data() {
        return {
            workspaceDevices: [],
            hardWareProductLookup: {},
        };
    },
    computed: {
        ...mapGetters([
            'activeDeviceId',
            'currentWorkspaceId',
            'currentWorkspaceName',
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

        getDevices(this.currentWorkspaceId)
            .then(response => {
                let devices = response.data;
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

                this.workspaceDevices =  devices;
            });

        get().then(response => {
            let hardwareProducts = response.data;
            this.hardWareProductLookup = keyBy(hardwareProducts, 'id');
        });
    },
};
</script>
