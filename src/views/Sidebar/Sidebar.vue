<template>
    <aside class="menu">
        <p class="menu-label">Datacenter Builds</p>
        <ul class="menu-list">
            <li>
                <router-link to="/status" @click="setActiveItem('status')">Status</router-link>
                <router-link to="/datacenter" @click="setActiveItem('datacenter')">Browse</router-link>
                <router-link to="/device" @click="setActiveItem('device')">Devices</router-link>
            </li>
        </ul>
        <p class="menu-label">Conch</p>
        <ul class="menu-list">
            <li>
                <router-link to="/user" @click="setActiveItem('user')">Profile</router-link>
            </li>
            <li>
                <a @click="signOut">Log out</a>
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
import * as ConchApiVersion from '../../api/conchApiVersion.js';
import { logout } from '../../api/authentication.js';

export default {
    data() {
        return {
            activeItem: '',
            conchVersion: '',
            conchUIVersion: '',
        };
    },
    methods: {
        signOut() {
            logout()
                .then(() => {
                    this.$router.push({ path: '/' });
                });
        },
        setActiveItem(item) {
            this.activeItem = activeItem;
        },
    },
    created() {
        this.conchUIVersion = CONCH.GLOBALS.conchUIVersion;

        ConchApiVersion.get()
            .then(response => {
                this.conchVersion = response.data.version;
            });
    }
};
</script>
