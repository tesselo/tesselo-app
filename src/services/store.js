import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import app from '@/services/state/app/store'
import auth from '@/services/state/auth/store'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['auth']
})

const debug = process.env.NODE_ENV === 'development'

Vue.use(Vuex)

export const storeOptions = {
  modules: {
    app,
    auth
  },
  strict: debug,
  plugins: [vuexLocal.plugin]
}

export default new Vuex.Store(storeOptions)
