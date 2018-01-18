import { mutationTypes } from '@/services/constants'

export default {
  /**
   * Sets aggregation layers
   * 
   * @param {any} state 
   * @param {any} { count, next, previous, results} 
   */
  [mutationTypes.AGGREGATION_LAYER_SET_LAYERS] (state, { count, next, previous, results}) {
    state.total = count
    state.previous = previous
    state.next = next
    state.rows = results
  }
}

