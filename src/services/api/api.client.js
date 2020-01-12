import axios from 'axios'
import { baseUrl } from '@/services/util'

const axiosInstance = axios.create({
  baseURL: baseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
})

axiosInstance.interceptors.response.use(undefined, (error) => {
    if (error.response.status === 401) {
      // Remove auth storage.
      localStorage.removeItem('auth')
      // Clear auth cookie.
      document.cookie = `auth_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;`
      // Set the logout route.
      if (!window.location.href.includes('/login')) {
        window.location.href = process.env.ROUTER_BASE + '/logout'
      }
    }
    return Promise.reject(error.response)
  }
)

export default axiosInstance
