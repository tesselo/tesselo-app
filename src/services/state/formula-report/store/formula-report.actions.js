import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/services/api'

export default {
  /**
   *
   * GET FORMULA REPORT
   */
  [actionTypes.FORMULA_REPORT_GET](context, { layer, formula, moment, ordering, search, date_after, date_before, page, pageSize }) {
    return APIAdapter.services.formulaReport.get({layer, formula, moment, ordering, search, date_after, date_before, page, pageSize})
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
