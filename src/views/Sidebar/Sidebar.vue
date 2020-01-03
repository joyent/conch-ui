<template>
    <aside class="menu" :class="{ loading: isEmpty(this.currentUser) }">
        <Spinner v-if="isEmpty(this.currentUser)" />
        <div class="sidebar" v-else>
            <div class="brand">
                <img
                    class="brand-icon"
                    src="../../assets/brand.png"
                    width="150px"
                    @click="navigateDashboard()"
                />
            </div>
            <p class="menu-label">Datacenter Builds</p>
            <ul class="menu-list">
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
            </ul>
            <p class="menu-label" v-if="userHasBuilds || userHasOrganizations">
                Pages
            </p>
            <template v-if="userHasBuilds">
                <ul
                    class="sidenav-dropdown menu-list"
                    :class="{ 'is-expanded': isBuildsExpanded }"
                    @click="isBuildsExpanded = !isBuildsExpanded"
                >
                    <li class="nav-item">
                        <a>
                            <i class="material-icons">layers</i>
                            <span class="name">Builds</span>
                            <span class="icon chevron">
                                <i class="fas fa-chevron-right"></i>
                            </span>
                        </a>
                    </li>
                </ul>
                <ul class="menu-list child-pages" v-if="isBuildsExpanded">
                    <li
                        class="nav-item"
                        v-for="build in currentUser.builds"
                        :key="build.id"
                    >
                        <router-link
                            :to="{
                                name: 'build',
                                params: { buildId: build.id },
                            }"
                            active-class="is-active"
                            :key="`$route.path_${build.id}`"
                        >
                            <span>{{ build.name }}</span>
                        </router-link>
                    </li>
                </ul>
            </template>
            <template v-if="userHasOrganizations">
                <ul
                    class="sidenav-dropdown menu-list"
                    :class="{ 'is-expanded': isOrganizationsExpanded }"
                    @click="isOrganizationsExpanded = !isOrganizationsExpanded"
                >
                    <li class="nav-item">
                        <a>
                            <i class="material-icons">recent_actors</i>
                            <span class="name">Organizations</span>
                            <span class="icon chevron">
                                <i class="fas fa-chevron-right"></i>
                            </span>
                        </a>
                    </li>
                </ul>
                <ul
                    class="menu-list child-pages"
                    v-if="isOrganizationsExpanded"
                >
                    <li
                        class="nav-item"
                        v-for="organization in currentUser.organizations"
                        :key="organization.id"
                    >
                        <router-link
                            :to="{
                                name: 'organization',
                                params: { organizationId: organization.id },
                            }"
                            active-class="is-active"
                            :key="`$route.path_${organization.id}`"
                        >
                            <span>{{ organization.name }}</span>
                        </router-link>
                    </li>
                </ul>
            </template>
            <p v-if="currentUser.is_admin" class="menu-label">Conch Admin</p>
            <ul class="menu-list" v-if="currentUser.is_admin">
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
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link
                        :to="{ name: 'tokens' }"
                        active-class="is-active"
                    >
                        <i class="material-icons">vpn_key</i>
                        <span>Tokens</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link
                        :to="{ name: 'user-management' }"
                        active-class="is-active"
                    >
                        <i class="material-icons">group</i>
                        <span>Users</span>
                    </router-link>
                </li>
            </ul>
            <p class="menu-label">Conch</p>
            <ul class="menu-list">
                <li class="nav-item">
                    <router-link
                        :to="{ name: 'user' }"
                        active-class="is-active"
                    >
                        <i class="material-icons">account_circle</i>
                        <span>Profile</span>
                    </router-link>
                </li>
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
    data() {
        return {
            isBuildsExpanded: false,
            isOrganizationsExpanded: false,
        };
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
        userHasBuilds() {
            const currentUser = this.currentUser;

            if (
                !isEmpty(currentUser) &&
                currentUser.builds &&
                currentUser.builds.length > 0
            ) {
                return true;
            }

            return false;
        },
        userHasOrganizations() {
            const currentUser = this.currentUser;

            if (
                !isEmpty(currentUser) &&
                currentUser.organizations &&
                currentUser.organizations.length > 0
            ) {
                return true;
            }

            return false;
        },
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
