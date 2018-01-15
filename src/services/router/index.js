import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/home/home'
import Login from '@/views/login/login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
