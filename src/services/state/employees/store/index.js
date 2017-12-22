
import mutations from './employees.mutations'
import actions from './employees.actions'
import getters from './employees.getters'

export default {
  namespaced: true,
  state: {
    employees: [],
    loading: false,
  },
  mutations,
  actions,
  getters
}
