<template>
    <div id="app" v-if="this.$route.path === '/'">
        <SignIn/>
    </div>
    <div id="app" v-else>
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

export default {
    components: {
        Layout,
        SignIn,
    },
};
</script>

