import state from './auth.state'
import mutations from './auth.mutations'
import actions from './auth.actions'
import getters from './auth.getters'

export const authMutations = mutations

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
