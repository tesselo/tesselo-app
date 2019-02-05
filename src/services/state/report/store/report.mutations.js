import defaultState from './report.state'
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
  },
  /**
   * Sets the selected report key
   * the report key is created using object-hash of { layer, formula, moment }
   *
   * @param {any} state
   * @param {any} key
   */
  [mutationTypes.REPORT_SET_SELECTED_MULTIPLE_REPORT]  (state, key) {
    state.selectedReport = key
  },
  /**
   * Saves report object to localstorage
   * Sets report object in state.savedReports
   *
   * @param {any} state
   */
  [mutationTypes.REPORT_SAVE_SELECTED_MULTIPLE_REPORT] (state) {
    Vue.set(state.savedReports, state.selectedReport, state.reports[state.selectedReport])

    // save in localstorage
    const stored = JSON.parse(window.localStorage.getItem('savedReports')) || {}
    stored[state.selectedReport] = state.reports[state.selectedReport]
    window.localStorage.setItem('savedReports', JSON.stringify(stored))
  },
  [mutationTypes.REPORT_RESET] (state) {  // eslint-disable-line
    state = defaultState
    window.localStorage.removeItem('savedReports')
  }
}

