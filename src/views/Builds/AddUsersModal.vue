<template>
    <transition name="fade">
        <div
            class="add-items-modal modal"
            :class="{ 'is-active': isActive }"
            v-if="!isSuccess"
        >
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-card">
                <div class="modal-card-head">
                    <p class="modal-card-title is-uppercase">
                        Add Members
                    </p>
                    <i class="material-icons close" @click="closeModal()">
                        close
                    </i>
                </div>
                <div class="modal-card-body">
                    <table class="table is-fullwidth">
                        <tbody>
                            <tr>
                                <td class="search-input" colspan="3">
                                    <p class="control has-icons-left">
                                        <input
                                            class="input is-marginless search"
                                            type="text"
                                            placeholder="Search..."
                                            v-model="searchText"
                                        />
                                        <span class="icon">
                                            <i class="material-icons">search</i>
                                        </span>
                                    </p>
                                </td>
                            </tr>
                            <tr
                                class="row item"
                                :class="{
                                    'is-selected': isUserSelected(user.id),
                                }"
                                v-for="user in filteredUsers"
                                :key="user.id"
                            >
                                <template v-if="isUserSelected(user.id)">
                                    <td class="item-name">
                                        <span class="name has-text-grey-light">
                                            {{ user.name }}
                                        </span>
                                    </td>
                                    <td class="role-select">
                                        <div class="select role">
                                            <select
                                                @change="
                                                    updateRole(user.id, $event)
                                                "
                                            >
                                                <option
                                                    value="admin"
                                                    :selected="
                                                        user.role === 'admin'
                                                    "
                                                >
                                                    Admin
                                                </option>
                                                <option
                                                    value="rw"
                                                    :selected="
                                                        user.role === 'rw'
                                                    "
                                                >
                                                    Read &#47; Write
                                                </option>
                                                <option
                                                    value="ro"
                                                    :selected="
                                                        user.role === 'ro'
                                                    "
                                                >
                                                    Read Only
                                                </option>
                                            </select>
                                        </div>
                                    </td>
                                    <td class="action">
                                        <i
                                            class="material-icons has-text-success add-item"
                                            v-if="showRemoveIcon !== user.id"
                                            @mouseover="
                                                showRemoveIcon = user.id
                                            "
                                        >
                                            check
                                        </i>
                                        <i
                                            class="material-icons has-text-danger remove-item"
                                            v-if="showRemoveIcon === user.id"
                                            @click="removeMember(user.id)"
                                            @mouseleave="showRemoveIcon = ''"
                                        >
                                            close
                                        </i>
                                    </td>
                                </template>
                                <template v-else>
                                    <td class="item-name">
                                        <span>
                                            {{ user.name }}
                                        </span>
                                    </td>
                                    <td class="action">
                                        <i
                                            class="material-icons has-text-success add-item"
                                            @click="addMember(user)"
                                        >
                                            add
                                        </i>
                                    </td>
                                </template>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <footer class="modal-card-foot">
                    <div class="buttons is-marginless">
                        <a
                            class="button is-outlined is-danger"
                            @click="closeModal()"
                            :disabled="isLoading"
                        >
                            Cancel
                        </a>
                        <a
                            class="button is-capitalized is-success"
                            :class="{ 'is-loading': isLoading }"
                            @click="addMembers()"
                        >
                            Add Members
                        </a>
                    </div>
                </footer>
            </div>
        </div>
        <div
            class="add-items-success-modal modal"
            :class="{ 'is-active': isActive }"
            v-else
        >
            <div class="modal-background" @click="closeModal()"></div>
            <div class="modal-card">
                <header class="modal-card-head is-success">
                    <p class="modal-card-title">Success!</p>
                    <i class="material-icons close" @click="closeModal()">
                        close
                    </i>
                </header>
                <section class="modal-card-body">
                    <p>
                        {{ selectedUsers.length }} users have been successfully
                        added.
                    </p>
                    <br />
                    <a class="button is-success" @click="closeModal()">
                        Close
                    </a>
                </section>
            </div>
        </div>
    </transition>
</template>

<script>
import search from 'fuzzysearch';
import { EventBus } from '@src/eventBus.js';
import { getUsers } from '@api/users.js';
import { mapActions, mapState } from 'vuex';
import { addUserToBuild, getBuildUsers } from '@api/builds.js';

export default {
    data() {
        return {
            isActive: true,
            isLoading: false,
            isSuccess: false,
            searchText: '',
            selectedUsers: [],
            showRemoveIcon: '',
        };
    },
    methods: {
        ...mapActions(['setCurrentBuildUsers', 'setUsers']),
        async addMembers() {
            this.isLoading = true;
            const buildId = this.currentBuild.id;

            await this.selectedUsers.forEach(user => {
                addUserToBuild(buildId, user.id, user.role);
            });

            this.isSuccess = true;
            this.isLoading = false;
            EventBus.$emit('users-added-to-build');
        },
        addMember(user) {
            const role = { role: 'ro' };
            this.selectedUsers.push(Object.assign(user, role));
        },
        closeModal() {
            this.isActive = false;
            this.isSuccess = false;
            EventBus.$emit('close-modal:add-item');
        },
        isUserSelected(userId) {
            return (
                this.selectedUsers.map(user => user.id).indexOf(userId) !== -1
            );
        },
        removeMember(userId) {
            const index = this.selectedUsers
                .map(user => user.id)
                .indexOf(userId);

            this.selectedUsers.splice(index, 1);
        },
        updateRole(userId, event) {
            if (event && event.target && event.target.value) {
                const selectedUsers = this.selectedUsers;

                for (let i = 0; i < selectedUsers.length; i++) {
                    const modifiedUser = selectedUsers[i];

                    if (modifiedUser.id === userId) {
                        this.selectedUsers[i].role = event.target.value;

                        break;
                    }
                }
            }
        },
    },
    computed: {
        ...mapState(['currentBuild', 'currentBuildUsers', 'users']),
        filteredUsers() {
            return this.users.reduce((acc, user) => {
                const index = this.currentBuildUsers
                    .map(buildUser => buildUser.id)
                    .indexOf(user.id);

                if (index === -1) {
                    if (this.searchText) {
                        const searchText = this.searchText.toLowerCase();
                        const name = user.name.toLowerCase();

                        if (search(searchText, name)) {
                            acc.push(user);
                        }
                    } else {
                        acc.push(user);
                    }
                }

                return acc;
            }, []);
        },
    },
    created() {
        if (!this.users) {
            getUsers().then(response => {
                this.setUsers(response.data);
            });
        }

        if (!this.currentBuildUsers) {
            getBuildUsers(this.currentBuild.id).then(response => {
                this.setCurrentBuildUsers(response.data);
            });
        }
    },
};
</script>
