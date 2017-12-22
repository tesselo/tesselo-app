import endpoints from '@/data/api/api.endpoints'
import client from '@/data/api/api.client'

export default {
  getEmployees (axiosInstance = client) {
    return axiosInstance[endpoints.getEmployees.method](endpoints.getEmployees.url, {})
      .then((response) => {
        return Promise.resolve(response.data)
      }).catch((error) => {
        /* istanbul ignore next */
        return Promise.reject(error)
      })
  }
}