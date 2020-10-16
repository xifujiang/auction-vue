import Vue from 'vue';
import App from './App';
import router from './router';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
axios.defaults.baseURL = 'http://localhost:8443/api';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-from-urlencoded';

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

Vue.use(iView);
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next();
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
