import mutations from './formula.mutations'
import actions from './formula.actions'

export default {
  namespaced: true,
  state: {
    total: 0,
    next: null,
    previous: null,
    pageSize: 10,
    rows: [],
    selectedFormula: null,
    currentPage: 1
  },
  mutations,
  actions
}
