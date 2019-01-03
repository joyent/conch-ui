<template>
    <div class="validation-tab">
        <Spinner v-if="validationStates == null && validations == null" />
        <table class="table is-narrow is-marginless is-fullwidth" v-else>
            <thead>
                <tr>
                    <th></th>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr :class="{ 'is-selected': revealDetails }" @click="revealDetails = !revealDetails" style="cursor: pointer;">
                    <td>
                        <div class="icon">
                            <i class="fas fa-caret-down" v-if="revealDetails"></i>
                            <i class="fas fa-caret-right" v-else></i>
                        </div>
                    </td>
                    <td class="has-text-centered">
                        <!-- <span class="tag" :class="" v-for="(status, index) in counts" :key="index">

                        </span> -->
                    </td>
                    <td>{{ validation.name }}</td>
                    <td>
                        <span v-if="validation.description" v-html="validation.description"></span>
                        <span class="has-text-grey" v-else>No Description</span>
                    </td>
                </tr>
                <tr v-if="revealDetails">
                    <td></td>
                    <td colspan="3">
                        <div class="content">
                            <table class="table is-narrow is-marginless is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Order</th>
                                        <th>Results</th>
                                        <th>Message</th>
                                        <th>Hint</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr :class="{ 'has-backgroud-warning has-text-dard': result.status !== 'pass' }" v-for="(result, index) in resultsByOrder" :key="index">
                                        <td>{{ result.order + 1 }}</td>
                                        <td>{{ result.status }}</td>
                                        <td>{{ result.message }}</td>
                                        <td v-if="result.hint">{{ result.hint }}</td>
                                        <td v-else>
                                            <span class="has-text-grey">No Hint</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th></th>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script>
import sortBy from 'lodash/sortBy';
import countBy from 'lodash/countBy';
import groupBy from 'lodash/groupBy';
import Spinner from '../components/Spinner.vue';
import { getDeviceValidations } from './api.js';
import { get } from '../../api/validations.js';
import { mapState, mapGetters } from 'vuex';

export default {
    components: {
        Spinner,
    },
    data() {
        return {
            results: [],
            revealDetails: false,
            validationStates: [],
            validations: [],
        };
    },
    computed: {
        // TODO: Need to translate resultsToCountTags
        ...mapGetters([
            'activeDeviceId',
        ]),
        ...mapState([
            'activeDevice',
        ]),
        resultsByOrder() {
            return sortBy(this.results, 'order');
        },
        groupedValidationStateResults() {
            return this.validationStates.map(states => {
                states.map(state => {
                    groupBy(state.results, 'validation_id');
                });
            });
        },
        idToValidation() {
            return this.validations.map(vs => {
                let map = vs.reduce((acc, v) => {
                    acc[v.id] = v;
                    return acc;
                }, {});

                return id => map[id];
            });
        },
    },
    created() {
        this.validationStates = getDeviceValidations(this.activeDeviceId);
        this.validations = get();
    },
};
</script>
