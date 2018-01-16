import endpoints from '@/data/api/api.endpoints'
import client from '@/data/api/api.client'

export default {
  login (user, axiosInstance = client) {
    return axiosInstance[endpoints.auth.login.method](endpoints.auth.login.url, user)
      .then((response) => {
        return Promise.resolve(response.data)
      }).catch((error) => {
        /* istanbul ignore next */
        return Promise.reject(error)
      })
  },
  logout (axiosInstance = client) {
    return axiosInstance[endpoints.auth.logout.method](endpoints.auth.logout.url)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }
}