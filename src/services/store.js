import Vue from 'vue'
import Vuex from 'vuex'

import app from '@/services/state/app/store'
import auth from '@/services/state/auth/store'
import aggregationLayer from '@/services/state/aggregation-layer/store'
import formula from '@/services/state/formula/store'
import map from '@/services/state/map/store'
import time from '@/services/state/time/store'
import report from '@/services/state/report/store'
import predictedLayer from '@/services/state/predicted-layer/store'
import bookmarkFolder from '@/services/state/bookmark-folder/store'
import bookmark from '@/services/state/bookmark/store'

import { mutationTypes } from '@/services/constants'
import { cloneDeep } from 'lodash'
import appState from '@/services/state/app/store/app.state'
import authState from '@/services/state/auth/store/auth.state'
import aggregationLayerState from '@/services/state/aggregation-layer/store/aggregation-layer.state'
import mapState from '@/services/state/map/store/map.state'
import predictedLayerState from '@/services/state/predicted-layer/store/predicted-layer.state'
import formulaState from '@/services/state/formula/store/formula.state'
import reportState from '@/services/state/report/store/report.state'
import timeState from '@/services/state/time/store/time.state'
import bookmarkFolderState from './state/bookmark-folder/store/bookmark-folder.state';
import bookmarkState from './state/bookmark/store/bookmark.state';

const debug = process.env.NODE_ENV === 'development'

Vue.use(Vuex)

const initialState = {
  app: cloneDeep(appState),
  auth: cloneDeep(authState),
  aggregationLayer: cloneDeep(aggregationLayerState),
  map: cloneDeep(mapState),
  predictedLayer: cloneDeep(predictedLayerState),
  formula: cloneDeep(formulaState),
  report: cloneDeep(reportState),
  time: cloneDeep(timeState),
  bookmarkFolder: cloneDeep(bookmarkFolderState),
  bookmark: cloneDeep(bookmarkState),
}

export const storeOptions = {
  modules: {
    app,
    auth,
    aggregationLayer,
    map,
    formula,
    time,
    report,
    predictedLayer,
    bookmarkFolder,
    bookmark
  },

  mutations: {
    [mutationTypes.RESET_STORE](state) {
      Object.keys(initialState).forEach(key => {
        Object.assign(state[key], initialState[key])
      })
    },
  },

  strict: debug
}

export default new Vuex.Store(storeOptions)
