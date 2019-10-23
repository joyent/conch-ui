<template>
    <div class="organizations-tab">
        <!-- <div class="columns">
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
                                placeholder="Search Organizations"
                            />
                            <span class="icon is-small is-left">
                                <i class="material-icons">search</i>
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
                            <th>
                                <a
                                    class="table-header-filter name"
                                    :class="{ 'has-text-white': sortBy === 'name' }"
                                    @click="sort()"
                                >
                                    Name
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="sortBy === 'name' && !reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="sortBy === 'name' && reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th>
                                <a
                                    class="table-header-filter role"
                                    :class="{ 'has-text-white': sortBy === 'role' }"
                                    @click="sort()"
                                >
                                    Role
                                    <i
                                        class="fas fa-angle-down"
                                        v-if="sortBy === 'role' && !reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                    <i
                                        class="fas fa-angle-up"
                                        v-else-if="sortBy === 'role' && reversedSort"
                                        style="margin-left: 10px;"
                                    ></i>
                                </a>
                            </th>
                            <th></th>
                        </thead>
                        <tfoot v-if="filteredOrganizations.length > 10">
                            <th>Name</th>
                            <th>Role</th>
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
                                        @click="removeOrganization(organization)"
                                    ></i>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <RemoveItemModal
            v-if="removingOrganization"
            :build="build"
            :item="user"
            item-type="user"
        /> -->
    </div>
</template>

<script>
export default {

};
</script>
