// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css';
import axios from 'axios'
import iviewArea from 'iview-area';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import qs from 'qs'

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(iviewArea)
Vue.use(mavonEditor)

axios.defaults.withCredentials = true
Vue.prototype.$user = sessionStorage.getItem("user");
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$BASE_URL = 'http://212.64.122.153:8090';
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
