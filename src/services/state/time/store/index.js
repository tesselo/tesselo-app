
import mutations from './time.mutations'
import actions from './time.actions'
import getters from './time.getters'

export default {
  namespaced: true,
  state: {
    compositesList: null,
    uniquesList: null,
    selectedMoment: null
  },
  mutations,
  actions,
  getters
}
