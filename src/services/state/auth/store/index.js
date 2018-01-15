import mutations from './auth.mutations'
import actions from './auth.actions'
import getters from './auth.getters'

export const authMutations = mutations

export default {
  namespaced: true,
  state: {
    fetchUserInfo: false,
    authenticated: false,
    user: {
      id: '',
      email: null,
      token: null,
    }
  },
  mutations,
  actions,
  getters
}
