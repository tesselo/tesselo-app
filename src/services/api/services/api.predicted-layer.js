import endpoints from '@/services/api/api.endpoints'
import client from '@/services/api/api.client'
import { predictedLayerResults, predictedLayerResult } from '@/services/api/api.models'

export default {

  /**
   * Gets predictedLayer, coloquially known as predicted layers.
   *
   * @param {any} [axiosInstance=client]
   * @param {Object} options
   * @param {Number} options.page
   * @returns
   */
  get (options, axiosInstance = client) {
    let url = endpoints.predictedLayer.list.url + '?page=' + options.page

    // if (options.year) {
    //   url += `&year=${options.year}`
    // }

    // if (options.areaId) {
    //   url += `&aggregationlayer=${options.areaId}`
    // }

    return axiosInstance[endpoints.predictedLayer.list.method](encodeURI(url))
      .then((response) => {
        return Promise.resolve({
          ...response.data,
          results: predictedLayerResults(response.data.results)
        })
      })
  },
  /**
   * Gets predictedLayer by ID.
   *
   * @param {any} [axiosInstance=client]
   * @param {Object} options (ID)
   * @returns
   */
  getById (options, axiosInstance = client) {
    let url = endpoints.predictedLayer.list.url + '/' + options
    return axiosInstance[endpoints.predictedLayer.list.method](encodeURI(url))
      .then((response) => {
        return Promise.resolve(predictedLayerResult(response.data))
      })
  }
}
