import endpoints from '@/services/api/api.endpoints'
import client from '@/services/api/api.client'
import { formatError } from '@/services/api/api.models.js'

export default {
  /**
   * Login
   * 
   * @param {Object} user 
   * @param {String} user.username
   * @param {String} user.password
   * @param {any} [axiosInstance=client] 
   * @returns 
   */
  login (user, axiosInstance = client) {
    return axiosInstance[endpoints.auth.login.method](endpoints.auth.login.url, user)
      .then((response) => {
        return Promise.resolve(response.data)
      })
      .catch((response) => {
        throw formatError(response.data)
      })
  },
  /**
   * Logout
   * 
   * @param {any} [axiosInstance=client] 
   * @returns 
   */
  logout (axiosInstance = client) {
    return axiosInstance[endpoints.auth.logout.method](endpoints.auth.logout.url)
      .then((response) => {
        return Promise.resolve(response.data)
      })
  }
}