import state from './default-state'
import mutations from './map.mutations'
import actions from './map.actions'
import getters from './map.getters'

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
