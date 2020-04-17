import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/home/home'
import Login from '@/views/login/login'
import Logout from '@/views/logout/logout'
import Report from '@/views/report/report'
import AggLayer from '@/views/aggregationlayer/aggregationlayer'
import AggArea from '@/views/aggregationarea/aggregationarea'

import { routeTypes } from "@/services/constants"

Vue.use(Router)

const router = new Router({
  base: process.env.ROUTER_BASE,
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: routeTypes.LOGIN,
      component: Login,
      meta: {
        requiresAuthentication: false,
        requiresStaff: false
      }
    },
    {
      path: '/logout',
      name: routeTypes.LOGOUT,
      component: Logout,
      meta: {
        requiresAuthentication: false,
        requiresStaff: false
      }
    },
    {
      path: '/',
      name: routeTypes.HOME,
      component: Home,
      meta: {
        requiresAuthentication: true
      }
    },
    {
      path: '/report/:layer/:formula',
      name: routeTypes.REPORT,
      component: Report,
      meta: {
        requiresAuthentication: true,
        requiresStaff: false
      }
    },
    {
      path: '/report/predicted/:layer/:predictedLayer',
      name: routeTypes.REPORT_PREDICTED,
      component: Report,
      meta: {
        requiresAuthentication: true,
        requiresStaff: false
      }
    },
    {
      path: '/areas',
      name: routeTypes.AGGREGATION_LAYER_LIST,
      component: AggLayer,
      meta: {
        requiresAuthentication: true,
        requiresStaff: true
      }
    },
    {
      path: '/areas/new',
      name: routeTypes.AGGREGATION_LAYER_CREATE,
      component: AggLayer,
      meta: {
        requiresAuthentication: true,
        requiresStaff: true
      }
    },
    {
      path: '/areas/:layer',
      name: routeTypes.AGGREGATION_LAYER_EDIT,
      component: AggLayer,
      meta: {
        requiresAuthentication: true,
        requiresStaff: true
      }
    },
    {
      path: '/areas/:layer/area',
      name: routeTypes.AGGREGATION_AREA_LIST,
      component: AggArea,
      meta: {
        requiresAuthentication: true,
        requiresStaff: true
      }
    },
    {
      path: '/areas/:layer/area/new',
      name: routeTypes.AGGREGATION_AREA_CREATE,
      component: AggArea,
      meta: {
        requiresAuthentication: true,
        requiresStaff: true
      }
    },
    {
      path: '/areas/:layer/area/:area',
      name: routeTypes.AGGREGATION_AREA_EDIT,
      component: AggArea,
      meta: {
        requiresAuthentication: true,
        requiresStaff: true
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  // Create auth variables.
  let auth
  let authenticated
  let isStaff

  // Get profile from local storage.
  if (localStorage.getItem('auth')) {
    auth = JSON.parse(localStorage.getItem('auth'))
    authenticated = auth.authenticated
    isStaff = auth.is_staff
  } else {
    authenticated = false
    isStaff = false
  }

  // Fist check authentication, then staff status.
  if (to.meta.requiresAuthentication && !authenticated) {
    next('/login')
  } else if (to.meta.requiresStaff && !isStaff) {
    next('/')
  } else {
    next()
  }
})

export default router
