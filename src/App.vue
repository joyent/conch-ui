<template>
  <div id="app">
    <SignIn v-if="this.$route.path === '/' || isLoggedIn() === false" />
    <PasswordReset v-else-if="this.$route.path === '/password-reset'" />
    <div class="signed-in" v-else>
      <router-view name="sidebar" />
      <div class="page">
        <router-view class="page-content" :key="$route.fullPath" />
      </div>
    </div>
  </div>
</template>

<script>
import PasswordReset from './views/PasswordReset/PasswordReset.vue';
import SignIn from './views/SignIn/SignIn.vue';
import { isLoggedIn } from '@api/authentication.js';

export default {
  components: { PasswordReset, SignIn },
  methods: { isLoggedIn },
  updated() {
    if (!isLoggedIn()) {
      if (this.$route.name === '404') {
        this.$router.push({ name: 'signIn' }).catch(() => {});
      } else {
        if (this.$route.name !== 'signIn') {
          this.$router.push({
            name: 'signIn',
            query: { redirect: this.$route.path },
          });
        }
      }
    }
  },
};
</script>
