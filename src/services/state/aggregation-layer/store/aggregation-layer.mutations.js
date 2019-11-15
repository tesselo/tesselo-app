import { mutationTypes } from '@/services/constants'


export default {
  /**
   * Sets aggregation layers
   *
   * @param {any} state
   * @param {any} { count, next, previous, results}
   */
  [mutationTypes.AGGREGATION_LAYER_SET_LAYERS] (state, { count, next, previous, results, page }) {
    state.total = count
    state.previous = previous
    state.next = next
    state.rows = results
    state.currentPage = page
  },
  [mutationTypes.AGGREGATION_LAYER_SELECT_LAYER] (state, layer) {
    state.selectedLayer = layer
  },
  [mutationTypes.AGGREGATION_LAYER_RESET] (state) { // eslint-disable-line
    state.total = 0
    state.next = null
    state.previous = null
    state.pageSize = 10
    state.rows = []
    state.selectedLayer = null
    state.currentPage = 1
  }
}
