import Vue from 'vue'
import Vuex from 'vuex'

import app from '@/services/state/app/store'
import auth from '@/services/state/auth/store'

// Track all state mutation errors
// - https://vuex.vuejs.org/en/strict.html
const debug = process.env.NODE_ENV === 'development'

Vue.use(Vuex)

export const storeOptions = {
  modules: {
    app,
    auth
  },
  strict: debug
}

export default new Vuex.Store(storeOptions)
