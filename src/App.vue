<template>
    <div id="app">
        <SignIn v-if="this.$route.path === '/'" />
        <PasswordReset v-else-if="this.$route.path === '/password-reset'" />
        <div class="signed-in" v-else>
            <router-view name="sidebar" />
            <div class="page">
                <router-view name="navbar" />
                <router-view class="page-content" :key="$route.fullPath" />
            </div>
        </div>
    </div>
</template>

<script>
import PasswordReset from './views/PasswordReset/PasswordReset.vue';
import SignIn from './views/SignIn/SignIn.vue';

export default {
    components: { PasswordReset, SignIn },
};
</script>
