
import defaultState from './aggregation-layer.state'
import { mutationTypes } from '@/services/constants'

export default {

  [mutationTypes.AGGREGATION_AREA_SET_LAYERS] (state, { count, next, previous, results, page }) {
    state.total = count
    state.previous = previous
    state.next = next
    state.rows = results
    state.currentPage = page
  },

  [mutationTypes.AGGREGATION_AREA_SET_LAYER_ID] (state, result) {
    state.row = result
  },

  [mutationTypes.AGGREGATION_AREA_SELECT_LAYER] (state, layer) {
    state.selectedAggregationArea = layer
  },

  [mutationTypes.AGGREGATION_AREA_RESET] (state) { // eslint-disable-line
    state = defaultState
  }
}
