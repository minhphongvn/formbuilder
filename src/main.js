import Vue from 'vue'
import App from './App'
import './interceptor/interceptor';
import vuetify from './plugins/vuetify';
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
  store,
  created() {
    store.dispatch('getUserInfo')
  },
  render: h => h(App)
}).$mount('#app')
