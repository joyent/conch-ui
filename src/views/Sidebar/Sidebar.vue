<template>
    <aside class="menu">
        <p class="menu-label">Datacenter Builds</p>
        <ul class="menu-list">
            <li>
                <router-link :to="{ name: 'status', params: { currentWorkspace: currentWorkspaceId }}" active-class="is-active">Status</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'datacenter', params: { currentWorkspace: currentWorkspaceId }}" active-class="is-active">Browse</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'devices', params: { currentWorkspace: currentWorkspaceId }}" active-class="is-active">Devices</router-link>
            </li>
        </ul>
        <p class="menu-label">Conch</p>
        <ul class="menu-list">
            <li>
                <router-link :to="{ name: 'user' }" active-class="is-active">Profile</router-link>
            </li>
            <li>
                <a class="sign-out" @click="signOut">Log out</a>
            </li>
        </ul>
        <br />
        <div class="box conch-versions">
            <p class="heading">Conch Versions</p>
            <div class="tags-container">
                <div class="tags has-addons">
                    <div class="tag is-primary">conch-api</div>
                    <div class="tag is-dark">{{ conchVersion }}</div>
                </div>
                <div class="tags has-addons">
                    <div class="tag is-primary">conch-ui</div>
                    <div class="tag is-dark">{{ conchUIVersion }}</div>
                </div>
            </div>
        </div>
    </aside>
</template>

<script>
import { getApiVersion } from '../../api/conchApiVersion.js';
import { logout } from '../../api/authentication.js';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            conchVersion: '',
            conchUIVersion: '',
        };
    },
    computed: {
        ...mapGetters([
            'currentWorkspaceId',
        ]),
    },
    methods: {
        signOut() {
            logout()
                .then(() => {
                    this.$router.push({ name: 'signIn' });
                });
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
