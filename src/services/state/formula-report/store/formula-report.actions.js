import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'

export default {
  /**
   *
   * GET FORMULA REPORT
   */
  [actionTypes.FORMULA_REPORT_GET](context, { layer, formula, moment, ordering, search, date_after, date_before, page }) {
    return APIAdapter.services.formulaReport.get({layer, formula, moment, ordering, search, date_after, date_before, page})
      .then((response) => {
        context.commit(mutationTypes.FORMULA_REPORT_SET, {
          layer,
          formula,
          moment,
          ...response,
          page: page
        }
      )
    })
  }
}
