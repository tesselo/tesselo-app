
// Require compiled modernizr.js before application loads.
require('@/services/modernizr')

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue, { createApp, h, configureCompat } from 'vue'
import Vuex from 'vuex'
import { createWebHistory, createRouter } from 'vue-router'
import vMediaQuery from 'v-media-query'
import { sync } from 'vuex-router-sync'
import VueHead from 'vue-head'
import DeviceInfo from '@/plugins/device-info'
import { Field, Form, extend } from 'vee-validate'
//import { required, min } from '@vee-validate/dist/rules'
import * as Sentry from '@sentry/vue'
import { Integrations } from '@sentry/tracing'

import '@/theme/main.scss'
import App from '@/views/app/app'
import router from '@/services/router'
import store from '@/services/store'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/en'
import './validators'
//import { createRouter, createWebHistory } from 'vue-router'

// var router = createRouter({
//   history: createWebHistory(),
//   routes: routes
// })
configureCompat({ WATCH_ARRAY: false, RENDER_FUNCTION: false })

const app = createApp({
  //component: {App},
  //template: '<App/>',
  // head: {
  //     title: {
  //       inner: 'Tesselo'
  //     }
  //   },
  render: () => h(App)
})

// el: '#app',
// router,
// store,
// components: { App },
// template: '<App/>',
// head: {
//   title: {
//     inner: 'Tesselo'
//   }
// }
// })

//const app = createApp(App)



app.use(router)
app.use(store)

//Vue.router = router

app.use(ElementPlus)
//app.use(Vuex)
app.use(DeviceInfo)
//sync(store, router)

app.use(vMediaQuery, {
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

//app.use(VueHead)

// Validation config.
// extend('required', {
//   ...required,
//   message: 'The {_field_} field is required.'
// })
// extend('min', {
//   ...min,
//   message: 'The input must be at least {length} characters long.'
// })

// isRequired (value) {
//   console.log(value)
//   //return value ? true : `The ${value} field is required`;
// },

app.component('Field', Field)
app.component('Form', Form)

app.config.errorHandler = function (err, vm, info) {
  console.log('Vue error handler: ', err, vm, info);
};
app.config.warnHandler = function (err, vm, info) {
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

app.mount("#app")