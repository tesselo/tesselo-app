import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/home/home'
import Login from '@/views/login/login'

import store from '@/services/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuthentication: true
      }
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authenticated = store.getters['auth/isAuthenticated']

  if (to.meta.requiresAuthentication) {
    if (authenticated) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
