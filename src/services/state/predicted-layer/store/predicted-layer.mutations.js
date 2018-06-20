import defaultState from './default-state'
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
  [mutationTypes.PREDICTED_LAYER_SELECT_LAYER] (state, layer) {
    state.selectedLayer = layer
  },
  [mutationTypes.PREDICTED_LAYER_RESET] (state) { // eslint-disable-line
    state = defaultState
  }
}
