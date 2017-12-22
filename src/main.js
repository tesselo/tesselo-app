
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import vMediaQuery from 'v-media-query'
import { sync } from 'vuex-router-sync'

import '@/theme/main.scss'
import App from '@/views/app/app'
import router from '@/services/router'
import store from '@/services/store'

/* ------------------------------------------------------
 * The official router for Vue.js
 * - http://router.vuejs.org/
 * --------------------------------------------------- */
Vue.use(Router)
Vue.router = router

/* ------------------------------------------------------
 * Load Vuex and sync the router with the vuex store
 * - https://github.com/vuejs/vuex-router-sync
 * --------------------------------------------------- */
Vue.use(Vuex)
sync(store, router)

/* ------------------------------------------------------
 * Plugin adds methods for work with media query in vue
 * - https://github.com/AStaroverov/v-media-query
 * - The following media breakpoints matches bootstrap defaults
 * --------------------------------------------------- */
Vue.use(vMediaQuery, {
  variables: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xsMax: '575px',
    smMax: '767px',
    mdMax: '991px',
    lgMax: '1199px'
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
