import endpoints from '@/data/api/api.endpoints'
import client from '@/data/api/api.client'

export default {
 
  /**
   * Gets formulas
   * 
   * @param {any} [axiosInstance=client] 
   * @param {Object} options
   * @param {Number} options.page
   * @param {String} options.search
   * @returns 
   */
  getComposites (options, axiosInstance = client) {
    return axiosInstance[endpoints.formula.list.method](endpoints.formula.list.url, options)
      .then((response) => {
        console.log('getComposites')
        return Promise.resolve(response.data)
      })
  }
}