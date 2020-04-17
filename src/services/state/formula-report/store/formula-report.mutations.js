import hash from 'object-hash'

import { mutationTypes } from '@/services/constants'

export default {
  [mutationTypes.FORMULA_REPORT_SET] (state, { layer, formula, moment, predictedLayer, count, previous, next, results, page }) {
    state.key = hash({ layer, formula, moment })
    state.layer = layer
    state.formula = formula
    state.moment = moment
    state.predictedLayer = predictedLayer
    state.total = count
    state.previous = previous
    state.next = next
    state.rows = results
    state.currentPage = page
  }
}
