import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import loansDetails from '@/components/loansDetails'
import CCloans from '@/components/CCloans'
import swiper from '@/components/swiper'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      name: 'loansDetails',
      component: loansDetails
    },
    {
      path: '/CCloans',
      name: 'CCloans',
      component: CCloans
    },
    {
      path: '/swiper',
      name: 'swiper',
      component: swiper
    }
  ]
})
