import endpoints from '@/data/api/api.endpoints'
import client from '@/data/api/api.client'
import { formatAggregationAreaResults } from '@/data/api/api.models'

export default {
 
  /**
   * Gets aggregationLayer, coloquially known as user's areas.
   * 
   * @param {any} [axiosInstance=client] 
   * @param {Object} options
   * @param {Number} options.page
   * @param {String} options.search
   * @returns 
   */
  get (options, axiosInstance = client) {
    return axiosInstance[endpoints.aggregationLayer.list.method](endpoints.aggregationLayer.list.url + '?page=' + options.page)
      .then((response) => {
        return Promise.resolve({
          ...response.data,
          results: formatAggregationAreaResults(response.data.results)
        })
      })
  }
}