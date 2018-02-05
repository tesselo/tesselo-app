import hash from 'object-hash'

import { mutationTypes } from '@/services/constants'

export default {
  /**
   * Sets multiple region report
   * 
   * @param {any} state 
   * @param {any} report
   */
  [mutationTypes.REPORT_SET_MULTIPLE_REGION] (state, { layer, formula, moment, response }) {
    const reportKey = hash({ layer, formula, moment })

    state.reports[reportKey] = {
      layer,
      formula,
      moment,
      report: response
    }
    state.selectedReport = reportKey
  },
  [mutationTypes.REPORT_SET_SELECTED_MULTIPLE_REPORT]  (state, key) {
    state.selectedReport = key
  }
}

