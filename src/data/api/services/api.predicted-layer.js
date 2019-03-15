import endpoints from '@/data/api/api.endpoints'
import client from '@/data/api/api.client'
import { predictedLayerResults } from '@/data/api/api.models'

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

    if (options.year) {
      url += `&year=${options.year}`
    }

    if (options.areaName) {
      url += `&areaName=${options.areaName}`
    }

    return axiosInstance[endpoints.predictedLayer.list.method](encodeURI(url))
      .then((response) => {
        return Promise.resolve({
          ...response.data,
          results: predictedLayerResults(response.data.results)
        })
      })
  }
}
