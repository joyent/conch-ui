<template>
    <div class="networking-tab">
        <p class="has-text-centered" v-if="isEmpty(this.nics)">
            No networking details available.
        </p>
        <Spinner v-else-if="isEmpty(ifaces)" />
        <table class="table is-narrow is-fullwidth" v-else>
            <thead>
                <tr>
                    <th
                        v-for="(header, index) in headers"
                        :key="index"
                    >
                        {{ header }}
                    </th>
                </tr>
            </thead>
            <template v-for="(iface, index) in ifaces">
                <tr
                    :class="{ 'is-selected': isRowSelected(index) }"
                    class="row"
                    @click="revealIfaceDetails(index)"
                    style="cursor: pointer;"
                    :key="index"
                >
                    <td>
                        <div class="icon">
                            <i
                                class="fas fa-caret-down"
                                v-if="isRowSelected(index)"
                            ></i>
                            <i class="fas fa-caret-right" v-else></i>
                        </div>
                    </td>
                    <td>{{ iface.state }}</td>
                    <td>{{ iface.id }}</td>
                    <td>{{ iface.ipaddr }}</td>
                    <td>{{ iface.mac }}</td>
                </tr>
                <tr v-if="isRowSelected(index)" :key="`${index}a`">
                    <td></td>
                    <td colspan="4">
                        <div class="content">
                            <table class="table is-narrow is-marginless">
                                <tbody>
                                    <tr>
                                        <td class="has-text-weight-semibold">
                                            Product
                                        </td>
                                        <td>{{ iface.product }}</td>
                                    </tr>
                                    <tr>
                                        <td class="has-text-weight-semibold">
                                            Peer Switch
                                        </td>
                                        <td>{{ iface.peer_switch }}</td>
                                    </tr>
                                    <tr>
                                        <td class="has-text-weight-semibold">
                                            Peer Port
                                        </td>
                                        <td>{{ iface.peer_port }}</td>
                                    </tr>
                                    <tr>
                                        <td class="has-text-weight-semibold">
                                            Peer Mac
                                        </td>
                                        <td>{{ iface.peer_mac }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </template>
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
import Spinner from '@views/components/Spinner.vue';
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
            ifaceDetailsRows: [],
        };
    },
    methods: {
        isEmpty,
        isRowSelected(index) {
            return this.ifaceDetailsRows.indexOf(index) >= 0;
        },
        revealIfaceDetails(index) {
            if (this.ifaceDetailsRows.indexOf(index) === -1) {
                this.ifaceDetailsRows.push(index);
            } else {
                this.ifaceDetailsRows.splice(
                    this.ifaceDetailsRows.indexOf(index), 1
                );
            }
        },
    },
    computed: {
        ...mapState([
            'activeDeviceDetails',
        ]),
        ifaces() {
            return Object.entries(this.nics)
                .sort()
                .map(([id, iface]) => {
                    iface.id = id;
                    return iface;
                });
        },
        nics() {
            return this.activeDeviceDetails.latest_report &&
                   this.activeDeviceDetails.latest_report.interfaces || {};
        },
    },
};
</script>
