import './styles/main.scss';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import Toasted from 'vue-toasted';

Vue.use(Toasted, {
  className: 'toast-custom',
  containerClass: 'toast-container-custom',
  duration: 3500,
  position: 'top-center',
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
