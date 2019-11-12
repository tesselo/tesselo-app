import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/home/home'
import Login from '@/views/login/login'
import Logout from '@/views/logout/logout'
import Report from '@/views/report/report'
import AggLayer from '@/views/aggregationlayer/aggregationlayer'
import AggArea from '@/views/aggregationarea/aggregationarea'

Vue.use(Router)

const router = new Router({
  base: process.env.ROUTER_BASE,
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuthentication: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/report/:layer/:formula',
      name: 'Report',
      component: Report
    },
    {
      path: '/areas',
      name: 'ListAggregationLayer',
      component: AggLayer
    },
    {
      path: '/areas/new',
      name: 'CreateAggregationLayer',
      component: AggLayer
    },
    {
      path: '/areas/:layer',
      name: 'EditAggregationLayer',
      component: AggLayer
    },
    {
      path: '/areas/:layer/area',
      name: 'ListAggregationLayerAreas',
      component: AggArea
    },
    {
      path: '/areas/:layer/area/:area',
      name: 'EditAggregationLayerAreas',
      component: AggArea
    },
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
