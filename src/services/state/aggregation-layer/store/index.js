
import mutations from './aggregation-layer.mutations'
import actions from './aggregation-layer.actions'
import getters from './aggregation-layer.getters'

export default {
  namespaced: true,
  state: {
    total: 0,
    next: null,
    previous: null,
    pageSize: 25,
    rows: [],
    selectedLayer: null
  },
  mutations,
  actions,
  getters
}
