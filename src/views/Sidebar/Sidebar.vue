<template>
    <aside class="menu" :class="{ loading: isEmpty(this.currentUser) }">
        <Spinner v-if="isEmpty(this.currentUser)" />
        <div
            v-else
            class="sidebar"
            style="display: flex; flex-direction: column; height: 100%"
        >
            <div class="brand">
                <img
                    class="brand-icon"
                    src="../../assets/brand.png"
                    width="150px"
                    @click="navigateDashboard()"
                />
            </div>
            <ul
                class="menu-list"
                style="display: flex; flex-direction: column; flex-grow: 1"
            >
                <li class="nav-item">
                    <router-link
                        :to="{
                            name: 'dashboard',
                        }"
                        active-class="is-active"
                    >
                        <i class="material-icons">dashboard</i>
                        <span>Dashboard</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link
                        :to="{ name: 'datacenter' }"
                        active-class="is-active"
                    >
                        <i class="material-icons">search</i>
                        <span>Browse</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link
                        :to="{ name: 'devices' }"
                        active-class="is-active"
                    >
                        <i class="material-icons">dns</i>
                        <span>Devices</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link
                        :to="{ name: 'builds' }"
                        active-class="is-active"
                    >
                        <i class="material-icons">layers</i>
                        <span>Builds</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link
                        :to="{ name: 'organizations' }"
                        active-class="is-active"
                    >
                        <i class="material-icons">recent_actors</i>
                        <span>Organizations</span>
                    </router-link> </li
                ><li class="nav-item">
                    <router-link
                        :to="{ name: 'hardware-products' }"
                        active-class="is-active"
                    >
                        <i class="material-icons">memory</i>
                        <span>Hardware</span>
                    </router-link>
                </li>
                <li class="nav-item" v-if="currentUser.is_admin">
                    <router-link
                        :to="{ name: 'tokens' }"
                        active-class="is-active"
                    >
                        <i class="material-icons">vpn_key</i>
                        <span>Tokens</span>
                    </router-link>
                </li>
                <li class="nav-item" v-if="currentUser.is_admin">
                    <router-link
                        :to="{ name: 'user-management' }"
                        active-class="is-active"
                    >
                        <i class="material-icons">group</i>
                        <span>Users</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link
                        :to="{
                            name: 'profile',
                            params: { id: currentUser.id },
                        }"
                        active-class="is-active"
                    >
                        <i class="material-icons">account_circle</i>
                        <span>Profile</span>
                    </router-link>
                </li>
                <div style="flex-grow: 1"></div>
                <li class="nav-item">
                    <a class="sign-out" @click="signOut()">
                        <i class="material-icons">exit_to_app</i>
                        <span>Sign Out</span>
                    </a>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import Spinner from '@src/views/components/Spinner.vue';
import { EventBus } from '@src/eventBus.js';
import { logout } from '@api/authentication.js';
import * as Users from '@api/users.js';
import { mapActions, mapState } from 'vuex';

export default {
    components: {
        Spinner,
    },
    methods: {
        ...mapActions(['setCurrentUser']),
        getCurrentUser() {
            Users.getCurrentUser().then(response => {
                this.setCurrentUser(response.data);
            });
        },
        isEmpty,
        navigateDashboard() {
            this.$router.push({ name: 'dashboard' });
        },
        signOut() {
            logout().then(() => {
                this.$router.push({ name: 'signIn' });
            });
        },
    },
    computed: {
        ...mapState(['currentUser']),
    },
    created() {
        if (isEmpty(this.currentUser)) {
            this.getCurrentUser();
        }
    },
    mounted() {
        EventBus.$on(
            ['build-created', 'organization-created', 'organization-deleted'],
            () => {
                this.getCurrentUser();
            }
        );
    },
};
</script>
