import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'

export default {
  /**
   *
   * GET FORMULA REPORT
   */
  [actionTypes.FORMULA_REPORT_GET](context, { layer, formula, moment, ordering, search }) {
    return APIAdapter.services.formulaReport.get({layer, formula, moment, ordering, search})
      .then((response) => {
        context.commit(mutationTypes.FORMULA_REPORT_SET, {
          layer,
          formula,
          moment,
          results: response.results
        }
      )
    })
  }
}
