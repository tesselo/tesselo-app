import { mutationTypes } from '@/services/constants'

export default {
  /**
   * Sets aggregation layers
   * 
   * @param {any} state 
   * @param {any} { count, next, previous, results} 
   */
  [mutationTypes.FORMULA_SET_FORMULAS] (state, { count, next, previous, results}) {
    state.total = count
    state.previous = previous
    state.next = next
    state.rows = results
  },
  [mutationTypes.FORMULA_SELECT_FORMULA] (state, formula) {
    state.selectedFormula = formula
  }
}

