
// Require compiled modernizr.js before application loads.
require('@/services/modernizr')

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import vMediaQuery from 'v-media-query'
import { sync } from 'vuex-router-sync'
import VueHead from 'vue-head'
import DeviceInfo from '@/plugins/device-info'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required, min } from 'vee-validate/dist/rules'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

import '@/theme/main.scss'
import App from '@/views/app/app'
import router from '@/services/router'
import store from '@/services/store'

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, { locale })

Vue.use(Router)
Vue.router = router

Vue.use(Vuex)
Vue.use(DeviceInfo)
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

// Validation config.
extend('required', {
  ...required,
  message: 'The {_field_} field is required.'
})
extend('min', {
  ...min,
  message: 'The input must be at least {length} characters long.'
})

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

Vue.config.errorHandler = function (err, vm, info) {
  console.log('Vue error handler: ', err, vm, info);
};
Vue.config.warnHandler = function (err, vm, info) {
  console.log('Vue warn handler: ', err, vm, info);
};

// Prevent vue spamming in console with "helpful" tips
Vue.config.productionTip = process.env.NODE_ENV == 'production' ? false : true;

Sentry.init({
  Vue,
  dsn: process.env.SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],

  // Capture 100% of transactions for performance monitoring.
  tracesSampleRate: 1.0,
})

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
