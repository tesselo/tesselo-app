
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import vMediaQuery from 'v-media-query'
import { sync } from 'vuex-router-sync'
import VueHead from 'vue-head'
import VeeValidate from 'vee-validate'

import '@/theme/main.scss'
import App from '@/views/app/app'
import router from '@/services/router'
import store from '@/services/store'

Vue.use(Router)
Vue.router = router

Vue.use(Vuex)
sync(store, router)

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

Vue.use(VueHead)

Vue.use(VeeValidate)

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  head: {
    title: {
      inner: 'Tesselo'
    }
  }
})
