<template>
    <Spinner v-if="!workspaceId" />
    <aside class="menu" v-else>
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
                    data-tooltip="Status"
                >
                    <i class="fas fa-lg fa-satellite-dish"></i>
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
                    data-tooltip="Browse"
                >
                    <i class="fas fa-lg fa-search"></i>
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
                    data-tooltip="Devices"
                >
                    <i class="fas fa-lg fa-server"></i>
                    <span>Devices</span>
                </router-link>
            </li>
        </ul>
        <p v-if="currentUser.is_admin" class="menu-label">Conch Admin</p>
        <ul class="menu-list" v-if="currentUser.is_admin">
            <li class="nav-item">
                <router-link
                    :to="{ name: 'tokens' }"
                    active-class="is-active"
                    data-tooltip="Tokens"
                >
                    <i class="fas fa-lg fa-key"></i>
                    <span>Tokens</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link
                    :to="{ name: 'user-management' }"
                    active-class="is-active"
                    data-tooltip="Users"
                >
                    <i class="fas fa-lg fa-users"></i>
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
                    data-tooltip="Profile"
                >
                    <i class="fas fa-lg fa-user"></i>
                    <span>Profile</span>
                </router-link>
            </li>
            <li class="nav-item">
                <a class="sign-out" @click="signOut()" data-tooltip="Log Out">
                    <i class="fas fa-lg fa-sign-out-alt"></i>
                    <span>Log Out</span>
                </a>
            </li>
        </ul>
        <!-- <br />
        <div class="box conch-versions">
            <p class="heading">Conch Versions</p>
            <div class="tags-container">
                <div class="tags has-addons">
                    <div class="tag is-primary">API</div>
                    <div class="tag is-dark">{{ conchVersion }}</div>
                </div>
                <div class="tags has-addons">
                    <div class="tag is-primary">UI</div>
                    <div class="tag is-dark">{{ conchUIVersion }}</div>
                </div>
            </div>
        </div> -->
    </aside>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import Spinner from '@src/views/components/Spinner.vue';
import { getApiVersion } from '@api/conchApiVersion.js';
import { logout } from '@api/authentication.js';
import { mapGetters, mapState } from 'vuex';

export default {
    components: {
        Spinner,
    },
    data() {
        return {
            conchVersion: '',
            conchUIVersion: '',
        };
    },
    methods: {
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
        this.conchUIVersion = CONCH.GLOBALS.conchUIVersion;

        getApiVersion().then(response => {
            this.conchVersion = response.data.version;
        });
    },
};
</script>
