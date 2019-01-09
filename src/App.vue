<template>
    <div id="app" v-if="this.$route.path === '/'">
        <SignIn/>
    </div>
    <div id="app" v-else-if="hasWorkspace">
        <router-view name="navbar"></router-view>
        <div class="section">
            <div class="columns">
                <div class="column is-2">
                    <router-view name="sidebar"></router-view>
                </div>
                <div class="column is-10">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Layout from './views/Layout/Layout.vue';
import SignIn from './views/SignIn/SignIn.vue';
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapState } from 'vuex';
import { isLoggedIn } from './api/authentication';
import { loadAllWorkspaces } from './api/workspaces';

export default {
    components: {
        Layout,
        SignIn,
    },
    methods: {
        ...mapActions([
            'setCurrentWorkspace',
            'setWorkspaces',
        ]),
    },
    computed: {
        ...mapState([
            'currentWorkspace',
        ]),
        hasWorkspace() {
            return !isEmpty(this.currentWorkspace);
        },
    },
    mounted() {
        if (!this.hasWorkspace && isLoggedIn()) {
            loadAllWorkspaces()
                .then(response => {
                    this.setWorkspaces(response.data);
                    this.setCurrentWorkspace(this.$store.getters.loadCurrentWorkspace());
                    return Promise.resolve();
                });
        }
    }
};
</script>

