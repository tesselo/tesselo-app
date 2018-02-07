import hash from 'object-hash'
import Vue from 'vue'

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

    state.selectedReport = reportKey

    Vue.set(state.reports, reportKey, {
      layer,
      formula,
      moment,
      results: response,
      finished: response.reduce((accumulator, reportItem) => reportItem.status === 'Finished' && accumulator, true)
    })
    // state.reports[reportKey] = {
    //   layer,
    //   formula,
    //   moment,
    //   results: response,
    //   finished: response.reduce((accumulator, reportItem) => reportItem.status === 'Finished' && accumulator, true)
    // }

  },
  [mutationTypes.REPORT_SET_SELECTED_MULTIPLE_REPORT]  (state, key) {
    state.selectedReport = key
  },
  [mutationTypes.REPORT_SAVE_SELECTED_MULTIPLE_REPORT] (state) {
    Vue.set(state.savedReports, state.selectedReport, state.reports[state.selectedReport])

    // save in localstorage
    const stored = JSON.parse(window.localStorage.getItem('savedReports')) || {}
    stored[state.selectedReport] = state.reports[state.selectedReport]
    window.localStorage.setItem('savedReports', JSON.stringify(stored))
  }
}

