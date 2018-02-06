
import mutations from './report.mutations'
import actions from './report.actions'

export default {
  namespaced: true,
  state: {
    reports: {},
    savedReports: JSON.parse(window.localStorage.getItem('savedReports')) || {},
    selectedReport: null
  },
  mutations,
  actions
}
