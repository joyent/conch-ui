<template>
    <div class="item-table">
        <table class="table is-fullwidth">
            <tbody>
                <tr class="table-title">
                    <td class="has-text-centered">
                        {{ title }}
                    </td>
                </tr>
                <tr
                    class="user"
                    :class="{ 'is-selected': isItemSelected(item) }"
                    v-for="item in data"
                    :key="item"
                >
                    <td v-if="isItemSelected(item)">
                        <span class="username is-italic has-text-grey">
                            {{ item }}
                        </span>
                        <span class="has-text-info is-italic">
                            adding
                        </span>
                    </td>
                    <td v-else>
                        <span class="username">
                            {{ item }}
                        </span>
                        <i
                            class="material-icons add-user"
                            @click="selectItem(item)"
                        >
                            add
                        </i>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            selectedUsers: [],
        };
    },
    methods: {
        deselectItem(user) {
            const index = this.selectedUsers.indexOf(user);

            this.selectedUsers.splice(index, 1);
        },
        isItemSelected(user) {
            return this.selectedUsers.indexOf(user) !== -1 ? true : false;
        },
        selectItem(user) {
            this.selectedUsers.push(user);
        },
    },
};
</script>
