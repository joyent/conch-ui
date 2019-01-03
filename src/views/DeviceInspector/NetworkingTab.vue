<template>
    <div class="networking-tab">
        <Spinner v-if="!hasNics" />
        <table class="table is-narrow-is-fullwidth" v-else>
            <thead>
                <tr>
                    <th v-for="(header, index) in headers" :key="index">
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <div class="networking-row" v-for="(iface, index) in ifaces" :key="index">
                <tr @click="revealDetails = !revealDetails" :class="{ 'is-selected': revealDetails }" style="cursor: pointer;">
                    <td>
                        <div class="icon">
                            <i class="fas fa-caret-down" v-if="revealDetails"></i>
                            <i class="fas fa-caret-right" v-else></i>
                        </div>
                    </td>
                    <td>{{ iface.state }}</td>
                    <td>{{ iface.id }}</td>
                    <td>{{ iface.ipaddr }}</td>
                    <td>{{ iface.mac }}</td>
                </tr>
                <tr v-if="revealDetails">
                    <td></td>
                    <td colspan="4">
                        <div class="content">
                            <table class="table is-narrow is-marginless">
                                <tbody>
                                    <tr>
                                        <td class="has-text-weight-semibold">Product</td>
                                        <td>{{ iface.product }}</td>
                                    </tr>
                                    <tr>
                                        <td class="has-text-weight-semibold">Peer Switch</td>
                                        <td>{{ iface.peer_switch }}</td>
                                    </tr>
                                    <tr>
                                        <td class="has-text-weight-semibold">Peer Port</td>
                                        <td>{{ iface.peer_port }}</td>
                                    </tr>
                                    <tr>
                                        <td class="has-text-weight-semibold">Peer Mac</td>
                                        <td>{{ iface.peer_mac }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </div>
            <tfoot>
                <tr>
                    <th v-for="(header, index) in headers" :key="index">
                        {{ header }}
                    </th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
import Spinner from '../components/Spinner.vue';
import isEmpty from 'lodash/isEmpty';
import { mapState } from 'vuex';

export default {
    components: {
        Spinner,
    },
    data() {
        return {
            headers: [
                '',
                'State',
                'Interface',
                'IP Address',
                'MAC',
            ],
            ifaces: [],
            nics: null,
        };
    },
    computed: {
        ...mapState([
            'activeDevice',
        ]),
        hasNics() {
            return !isEmpty(this.nics);
        }
    },
    created() {
        this.nics = this.activeDevice.latest_report && this.activeDevice.latest_report.interfaces || {};

        this.ifaces = Object.entries(this.nics)
            .sort()
            .map(([id, iface]) => {
                iface.id = id;
                return iface;
            })
    }
};
</script>
