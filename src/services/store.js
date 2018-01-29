import Vue from 'vue'
import Vuex from 'vuex'

import app from '@/services/state/app/store'
import auth from '@/services/state/auth/store'
import aggregationLayer from '@/services/state/aggregation-layer/store'
import formula from '@/services/state/formula/store'
import map from '@/services/state/map/store'

const debug = process.env.NODE_ENV === 'development'

Vue.use(Vuex)

export const storeOptions = {
  modules: {
    app,
    auth,
    aggregationLayer,
    map,
    formula
  },
  strict: debug
}

export default new Vuex.Store(storeOptions)
