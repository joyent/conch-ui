<template>
    <div class="organizations-tab">
        <div class="columns">
            <div class="column">
                <div class="members-table is-paddingless">
                    <div class="datatable-header">
                        <span class="heading is-size-6 is-marginless">
                            Organizations
                        </span>
                        <div class="control has-icons-left has-icons-right">
                            <input
                                type="text"
                                class="input search"
                                v-model="searchText"
                                placeholder="Search..."
                            />
                            <span class="icon is-small is-left">
                                <i class="material-icons search">search</i>
                            </span>
                        </div>
                        <i
                            class="material-icons has-text-success"
                            @click="addOrganization()"
                        >
                            add_circle
                        </i>
                    </div>
                    <table class="table is-hoverable is-fullwidth">
                        <thead>
                            <th v-for="header in headers" :key="header">
                                <a
                                    class="table-header-filter is-capitalized"
                                    :class="{
                                        'has-text-white': sortBy === header,
                                    }"
                                    @click="sort()"
                                >
                                    {{ header }}
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="
                                            sortBy === header && !reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="
                                            sortBy === header && reversedSort
                                        "
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th></th>
                        </thead>
                        <tfoot>
                            <th
                                class="is-capitalized"
                                v-for="header in headers"
                                :key="header"
                            >
                                {{ header }}
                            </th>
                        </tfoot>
                        <tbody>
                            <tr
                                class="row"
                                v-for="organization in filteredOrganizations"
                                :key="organization.name"
                            >
                                <td class="name">
                                    <span>{{ organization.name }}</span>
                                </td>
                                <td class="role">
                                    <span>{{ organization.role }}</span>
                                </td>
                                <td class="remove-item has-text-right">
                                    <i
                                        class="fas fa-trash-alt"
                                        @click="
                                            removeOrganization(organization)
                                        "
                                    ></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <RemoveItemModal
            v-if="removeOrganization"
            :item="removingOrganization"
            item-type="organization"
        />
    </div>
</template>

<script>
import search from 'fuzzysearch';
import RemoveItemModal from './RemoveItemModal.vue';
import { EventBus } from '@src/eventBus.js';
import * as Builds from '@api/builds.js';

export default {
    components: {
        RemoveItemModal,
    },
    props: {
        build: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            headers: ['name', 'role'],
            removeOrganization: false,
            removingOrganization: {},
            reversedSort: false,
            searchText: '',
            sortBy: '',
        };
    },
    methods: {
        addOrganization() {

        },
        removeOrganizationFromBuild() {
            const buildId = this.build.id;

            Builds.removeOrganizationFromBuild(
                buildId,
                this.removingOrganization.id
            ).then(() => {
                EventBus.$emit('item-removed');
                this.$parent.getBuildData(buildId);
            });
        },
    },
    computed: {
        filteredOrganizations() {
            let organizations = this.build.organizations;

            if (this.searchText) {
                const searchText = this.searchText.toLowerCase();

                return organizations.reduce((acc, organization) => {
                    const name = organization.name.toLowerCase();

                    if (search(searchText, name)) {
                        acc.push(organization);
                    }

                    return acc;
                }, []);
            }

            return organizations;
        },
    },
    created() {
        EventBus.$on('close-modal:remove-item', () => {
            this.removeOrganization = false;
        });

        EventBus.$on('remove-item:organization', () => {
            this.removeOrganizationFromBuild();
        });
    },
};
</script>
