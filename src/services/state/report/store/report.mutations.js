import { mutationTypes } from '@/services/constants'

export default {
  /**
   * Sets multiple region report
   * 
   * @param {any} state 
   * @param {any} report
   */
  [mutationTypes.REPORT_SET_MULTIPLE_REGION] (state, report) {
    console.log('mutationTypes.REPORT_SET_MULTIPLE_REGION', report)
  }
}

