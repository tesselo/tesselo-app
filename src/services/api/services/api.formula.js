import endpoints from '@/services/api/api.endpoints'
import client from '@/services/api/api.client'
import { formatFormulaResults, formatFormulaResult } from '@/services/api/api.models'
import * as Sentry from "@sentry/vue"

export default {

  /**
   * Gets formulas
   *
   * @param {any} [axiosInstance=client]
   * @param {Object} options
   * @param {Number} options.pageSize
   * @param {Number} options.page
   * @returns
   */
  get (options, axiosInstance = client) {
    const optionKey = Object.keys(options)[0]
    const optionValue = options[optionKey]
    let queryParam

    if (options.page) {
      queryParam = 'page'
    } else if (options.pageSize) {
      queryParam = 'page_size'
    } else {
      Sentry.captureMessage(`Get Formulas API: query parameter "${queryParam}" is invalid.`)
    }

    return axiosInstance[endpoints.formula.list.method](endpoints.formula.list.url + `?${queryParam}=` + optionValue)
      .then((response) => {
        return Promise.resolve({
          ...response.data,
          results: formatFormulaResults(response.data.results)
        })
      })
  },

  /**
   * Gets formula by ID
   *
   * @param {any} [axiosInstance=client]
   * @param {Number} id
   * @returns
   */
  getById (id, axiosInstance = client) {
    return axiosInstance[endpoints.formula.list.method](endpoints.formula.list.url + '/' + id)
      .then((response) => {
        return Promise.resolve(formatFormulaResult(response.data))
      })
  },
}