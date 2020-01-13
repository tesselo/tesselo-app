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
      localStorage.removeItem('auth')
      if (!window.location.href.includes('/login')) {
        window.location.href = process.env.ROUTER_BASE + '/logout'
      }
    }
    return Promise.reject(error.response)
  }
)

export default axiosInstance
