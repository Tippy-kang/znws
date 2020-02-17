// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/css/global.scss'
import '@/assets/css/element-reset.scss'

import "@/assets/font/iconfont/iconfont.css" //iconfont图标
import "@/assets/font/iconfont/iconfont.js" //iconfont图标

import Vue from 'vue'
import App from './App'
import router from './router'

import Vuex from 'vuex'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/display.css'

import PublicFun from '@/assets/js/publicFun.js' //公共方法
import tools from './utils/moment.js' 
import http from '@/api/http.js'

import "@/assets/js/directives.js" //Vue指令


import svgIcon from '@/components/common/svgIcon.vue'

import pubcomponents from "@/assets/js/pubcomponents.js";

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(pubcomponents);

Vue.use(PublicFun);
// Vue.prototype.$http = axios;
Vue.prototype.$http = http
Vue.prototype.$tools = tools

Vue.component('svg-icon', svgIcon)


//重定向router
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.clear()
    localStorage.clear()

    sessionStorage.removeItem('personal');
  }
  let data = sessionStorage.getItem("personal");
  if (!data && to.path !== '/login') {
    next({path: '/login'});
  } else if (data && to.path === '/') {
    next({path: '/'});
  } else {
    next();
  }
});


new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
