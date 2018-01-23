
import mutations from './map.mutations'
import actions from './map.actions'
import getters from './map.getters'

export default {
  namespaced: true,
  state: {
    bounds: null
  },
  mutations,
  actions,
  getters
}
