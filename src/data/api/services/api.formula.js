import endpoints from '@/data/api/api.endpoints'
import client from '@/data/api/api.client'
import { formatFormulaResults } from '@/data/api/api.models'

export default {
 
  /**
   * Gets formula
   * 
   * @param {any} [axiosInstance=client] 
   * @param {Object} options
   * @param {Number} options.page
   * @param {String} options.search
   * @returns 
   */
  get (options, axiosInstance = client) {
    return axiosInstance[endpoints.formula.list.method](endpoints.formula.list.url + '?page=' + options.page)
      .then((response) => {
        return Promise.resolve({
          ...response.data,
          results: formatFormulaResults(response.data.results)
        })
      })
  }
}