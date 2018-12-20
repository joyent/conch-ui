<template>
    <div id="app" v-if="this.$route.path === '/'">
        <SignIn/>
    </div>
    <div id="app" v-else>
        <Layout>
            <router-view></router-view>
        </Layout>
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

