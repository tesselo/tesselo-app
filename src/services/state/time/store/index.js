
import mutations from './time.mutations'
import actions from './time.actions'
import getters from './time.getters'

export default {
  namespaced: true,
  state: {
    list: null,
    selectedMoment: null
  },
  mutations,
  actions,
  getters
}
