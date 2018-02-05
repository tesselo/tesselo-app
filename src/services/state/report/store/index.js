
import mutations from './report.mutations'
import actions from './report.actions'

export default {
  namespaced: true,
  state: {
    reports: {}
  },
  mutations,
  actions
}
