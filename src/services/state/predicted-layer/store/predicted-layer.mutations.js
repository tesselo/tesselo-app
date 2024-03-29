import { mutationTypes } from '@/services/constants'

export default {
  /**
   * Sets predicted layers
   *
   * @param {any} state
   * @param {any} { count, next, previous, results}
   */
  [mutationTypes.PREDICTED_LAYER_SET_LAYERS] (state, { count, next, previous, results, page }) {
    state.total = count
    state.previous = previous
    state.next = next
    state.rows = results
    state.currentPage = page
  },

  /**
   * Sets predicted layer with ID
   *
   * @param {any} state
   * @param {any} result
   */
  [mutationTypes.PREDICTED_LAYER_SET_ID_LAYER] (state, result) {
    state.row = result
  },

  [mutationTypes.PREDICTED_LAYER_SELECT_LAYER] (state, layer) {
    state.selectedLayer = layer
  },
  [mutationTypes.PREDICTED_LAYER_SET_RESET] (state) {
    state.total = 0
    state.previous = null
    state.next = null
    state.rows = []
    state.row = null
    state.currentPage = 1
    state.selectedLayer = null
  }
}
