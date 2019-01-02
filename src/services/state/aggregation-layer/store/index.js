import state from './aggregation-layer.state'
import mutations from './aggregation-layer.mutations'
import actions from './aggregation-layer.actions'
import getters from './aggregation-layer.getters'

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
