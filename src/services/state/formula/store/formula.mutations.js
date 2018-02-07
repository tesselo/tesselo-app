import defaultState from './default-state'
import { mutationTypes } from '@/services/constants'

export default {
  /**
   * Sets available formulas
   * 
   * @param {any} state 
   * @param {any} { count, next, previous, results} 
   */
  [mutationTypes.FORMULA_SET_FORMULAS] (state, { count, next, previous, results, page }) {
    state.total = count
    state.previous = previous
    state.next = next
    state.rows = results
    state.currentPage = page
  },
  /**
   * Sets selected formula
   * 
   * @param {any} state 
   * @param {any} formula 
   */
  [mutationTypes.FORMULA_SELECT_FORMULA] (state, formula) {
    state.selectedFormula = formula
  },
  [mutationTypes.FORMULA_RESET] (state) {
    state = { ...defaultState }
  }
}

