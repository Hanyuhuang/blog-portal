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

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(iviewArea)
Vue.use(mavonEditor)

Vue.prototype.$axios = axios;
Vue.prototype.$USER_URL = 'http://localhost:8081';
Vue.prototype.$ARTICLE_URL = 'http://localhost:8082';
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
