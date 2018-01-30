import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/home/home'
import Login from '@/views/login/login'

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
  let auth
  let authenticated

  if (localStorage.getItem('auth')) {
    auth = JSON.parse(localStorage.getItem('auth'))
    authenticated = auth.authenticated
  } else {
    authenticated = false
  }

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
