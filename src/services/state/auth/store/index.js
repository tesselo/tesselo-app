import mutations from './auth.mutations'
import actions from './auth.actions'
import getters from './auth.getters'

export const authMutations = mutations

export default {
  namespaced: true,
  state: {
    username: null,
    token: null,
    expires: null,
    authenticated: false,
    fetchUserInfo: false,
  },
  mutations,
  actions,
  getters
}
