// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuerouter from 'vue-router'
import Vueonscroll from 'vue-scroll'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import infiniteScroll from 'vue-infinite-scroll'
import phone from './assets/js/phone'
import qs from 'qs'
Vue.config.productionTip = false

Vue.use(phone)
Vue.use(qs)
Vue.use(Vuerouter)
Vue.use(Vueonscroll)
Vue.use(VueAwesomeSwiper)
Vue.use(infiniteScroll)

Vue.prototype.$http = axios

// 请求接口拦截器
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.url = 'http://api.youqian.melonmobile.cn' + config.url
  var token = localStorage.getItem('token')
  config.headers.token = token
  // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

//  注册全局指令 设置 title
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.innerText
    el.remove()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
