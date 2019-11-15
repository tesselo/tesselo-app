import endpoints from '@/services/api/api.endpoints'
import client from '@/services/api/api.client'


export default {

  get (options, axiosInstance = client) {
    const url = `${endpoints.aggregationArea.list.url}?page=${options.page}&aggregationlayer=${options.aggregationLayer}`

    return axiosInstance[endpoints.aggregationArea.list.method](url)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },

  getById (pk, axiosInstance = client) {
    return axiosInstance[endpoints.aggregationArea.list.method](endpoints.aggregationArea.list.url + '/' + pk)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },

  edit(data, axiosInstance = client) {
    return axiosInstance[endpoints.aggregationArea.edit.method](endpoints.aggregationArea.edit.url + '/' + data.id, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },

  save(data, axiosInstance = client) {
    return axiosInstance[endpoints.aggregationArea.save.method](endpoints.aggregationArea.save.url, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },

  delete(data, axiosInstance = client) {
    return axiosInstance[endpoints.aggregationArea.delete.method](endpoints.aggregationArea.delete.url + '/' + data.id, data)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }
}
