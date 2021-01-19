import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
import api from './api';
import store from './store';
import VTitle from 'v-tooltip';

Vue.config.productionTip = false;
Vue.prototype.$axios = api;
Vue.use(VTitle);

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
