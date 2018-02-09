import axios from 'axios'
import { baseUrl } from '@/services/util'

const axiosInstance = axios.create({
  baseURL: baseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

axiosInstance.interceptors.request.use(function (config) {
  let auth
  if (localStorage.getItem('auth')) {
    auth = JSON.parse(localStorage.getItem('auth'))

    if (auth.authenticated) {
      config.headers.Authorization = 'Token ' + auth.token
    }
  }

  return config
})

axiosInstance.interceptors.response.use(undefined, (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem('auth')
      window.location.href = '/logout'
    }
    return Promise.reject(error.response)
  }
)

export default axiosInstance
