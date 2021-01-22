import Vue from 'vue'
import App from './App'
import './interceptor';
import vuetify from './plugins/vuetify';
import router from './router';
import api from './api';
import store from './store';
import VTitle from 'v-tooltip';
import Cookies from 'vue-cookies';

Vue.config.productionTip = false;
Vue.prototype.$axios = api;
Vue.use(VTitle, {
  defaultHtml: false,
});
Vue.use(Cookies);

new Vue({
  vuetify,
  router,
  store,
  created() {
    store.dispatch('getUserInfo')
  },
  render: h => h(App)
}).$mount('#app')
