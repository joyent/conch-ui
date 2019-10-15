<template>
    <aside
        class="menu"
        :class="{ loading: !this.workspaceId || isEmpty(this.currentUser) }"
    >
        <Spinner v-if="!this.workspaceId || isEmpty(this.currentUser)" />
        <div class="sidebar" v-else>
            <div class="brand">
                <img
                    class="brand-icon"
                    src="../../assets/brand.png"
                    width="150px"
                    @click="navigateHomepage()"
                />
            </div>
            <p class="menu-label">Datacenter Builds</p>
            <ul class="menu-list">
                <li class="nav-item">
                    <router-link
                        :to="{
                            name: 'status',
                            params: { currentWorkspace: this.workspaceId },
                        }"
                        active-class="is-active"
                    >
                        <i class="material-icons">signal_cellular_alt</i>
                        <span>Status</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link
                        :to="{
                            name: 'datacenter',
                            params: { currentWorkspace: this.workspaceId },
                        }"
                        active-class="is-active"
                    >
                        <i class="material-icons">search</i>
                        <span>Browse</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link
                        :to="{
                            name: 'devices',
                            params: { currentWorkspace: this.workspaceId },
                        }"
                        active-class="is-active"
                    >
                        <i class="material-icons">dns</i>
                        <span>Devices</span>
                    </router-link>
                </li>
            </ul>
            <p class="menu-label">Pages</p>
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
                <li class="nav-item">
                    <router-link
                        :to="{
                            name: 'build',
                            params: { buildId: 'a2dbe92ledsa99d' },
                        }"
                        active-class="is-active"
                    >
                        <span>UK-West-1</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link
                        :to="{
                            name: 'build',
                            params: { buildId: 'b2wee92hhdsa99a' },
                        }"
                        active-class="is-active"
                    >
                        <span>US-NORTHWEST-1a</span>
                    </router-link>
                </li>
            </ul>
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
            <ul class="menu-list child-pages" v-if="isOrganizationsExpanded">
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
                        <i class="material-icons">people_alt</i>
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
import { logout } from '@api/authentication.js';
import { getCurrentUser } from '@api/users.js';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    components: {
        Spinner,
    },
    data() {
        return {
            conchVersion: '',
            conchUIVersion: '',
            isBuildsExpanded: false,
            isOrganizationsExpanded: false,
        };
    },
    methods: {
        ...mapActions(['setCurrentUser']),
        isEmpty,
        navigateHomepage() {
            this.$router.push({
                name: 'status',
                params: { currentWorkspace: this.currentWorkspaceId },
            });
        },
        signOut() {
            logout().then(() => {
                this.$router.push({ name: 'signIn' });
            });
        },
    },
    computed: {
        ...mapGetters(['currentWorkspaceId']),
        ...mapState(['currentUser', 'currentWorkspace']),
        workspaceId() {
            let workspaceId = this.currentWorkspaceId;

            if (!workspaceId && !isEmpty(this.currentWorkspace)) {
                workspaceId = this.currentWorkspace.id;
            }

            if (!workspaceId) {
                if (
                    this.$route &&
                    this.$route.params &&
                    this.$route.params.currentWorkspace
                ) {
                    workspaceId = this.$route.params.currentWorkspace;
                }
            }

            return workspaceId;
        },
    },
    created() {
        if (isEmpty(this.currentUser)) {
            getCurrentUser().then(response => {
                this.setCurrentUser(response.data);
            });
        }
    },
};
</script>
