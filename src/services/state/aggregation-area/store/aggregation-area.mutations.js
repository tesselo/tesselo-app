import { mutationTypes } from '@/services/constants'


export default {

  [mutationTypes.AGGREGATION_AREA_SET_AREAS] (state, { count, next, previous, results, page }) {
    state.total = count
    state.previous = previous
    state.next = next
    state.rows = results
    state.currentPage = page
  },

  [mutationTypes.AGGREGATION_AREA_SELECT_AREA] (state, area) {
    state.selectedAggregationArea = area
  },

  [mutationTypes.AGGREGATION_AREA_RESET] (state) { // eslint-disable-line
    state.total = 0
    state.next = null
    state.previous = null
    state.pageSize = 10
    state.rows = []
    state.row = null
    state.selectedAggregationArea = null
    state.currentPage = 1
  }
}
