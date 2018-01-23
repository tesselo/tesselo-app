import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import app from '@/services/state/app/store'
import auth from '@/services/state/auth/store'
import aggregationLayer from '@/services/state/aggregation-layer/store'
import map from '@/services/state/map/store'

const debug = process.env.NODE_ENV === 'development'

Vue.use(Vuex)

export const storeOptions = {
  modules: {
    app,
    auth,
    aggregationLayer,
    map
  },
  strict: debug,
  plugins: [createPersistedState({
    paths: ['auth']
  })]
}

export default new Vuex.Store(storeOptions)
