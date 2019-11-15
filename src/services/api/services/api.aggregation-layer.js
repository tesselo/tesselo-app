import endpoints from '@/services/api/api.endpoints'
import client from '@/services/api/api.client'
import { formatAggregationLayerResults, formatAggregationLayerResult } from '@/services/api/api.models'

export default {

  get (options, axiosInstance = client) {
    return axiosInstance[endpoints.aggregationLayer.list.method](endpoints.aggregationLayer.list.url + '?page=' + options.page)
      .then((response) => {
        return Promise.resolve({
          ...response.data,
          results: formatAggregationLayerResults(response.data.results)
        })
      })
  },

  getById (options, axiosInstance = client) {
    return axiosInstance[endpoints.aggregationLayer.list.method](endpoints.aggregationLayer.list.url + '/' + options)
      .then((response) => {
        return Promise.resolve( formatAggregationLayerResult(response.data))
      })
  },

  edit(data, axiosInstance = client) {
    return axiosInstance[endpoints.aggregationLayer.edit.method](endpoints.aggregationLayer.edit.url + '/' + data.id, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },

  save(data, axiosInstance = client) {
    return axiosInstance[endpoints.aggregationLayer.save.method](endpoints.aggregationLayer.save.url, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },

  delete(data, axiosInstance = client) {
    return axiosInstance[endpoints.aggregationLayer.delete.method](endpoints.aggregationLayer.delete.url + '/' + data.id, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },

  getUploadLink(data, axiosInstance = client) {
    const url = `${endpoints.aggregationLayer.getUploadLink.url_base}/${data.pk}${endpoints.aggregationLayer.getUploadLink.url_tail}`
    return axiosInstance[endpoints.aggregationLayer.getUploadLink.method](url, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },
  parseLayer(data, axiosInstance = client) {
    const url = `${endpoints.aggregationLayer.parseLayer.url_base}/${data.pk}${endpoints.aggregationLayer.parseLayer.url_tail}`
    return axiosInstance[endpoints.aggregationLayer.parseLayer.method](url, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }
}
