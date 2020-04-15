import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/services/api'

export default {
  /**
   *
   * GET FORMULA REPORT
   */
  [actionTypes.FORMULA_REPORT_GET](context, { layer, formula, moment, ordering, search, dateAfter, dateBefore, page, pageSize, minPercentageCovered }) {
    return APIAdapter.services.formulaReport.get({layer, formula, moment, ordering, search, dateAfter, dateBefore, page, pageSize, minPercentageCovered})
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
