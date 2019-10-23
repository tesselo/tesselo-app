import hash from 'object-hash'

import { mutationTypes } from '@/services/constants'

export default {
  [mutationTypes.FORMULA_REPORT_SET] (state, { layer, formula, moment, results }) {
    state.formulaReport = {
      key: hash({ layer, formula, moment }),
      layer,
      formula,
      moment,
      results
    }
  }
}
