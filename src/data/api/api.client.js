import axios from 'axios'
import { baseUrl } from '@/services/util'
import store from '@/services/store'
import { actionTypes } from '@/services/constants'

const axiosInstance = axios.create({
  baseURL: baseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

axiosInstance.interceptors.request.use(function (config) {
  if (store.getters['auth/isAuthenticated']) {
    config.headers.Authorization = 'Token ' + store.getters['auth/token']
  }

  return config
})

axiosInstance.interceptors.response.use(undefined,
  (error) => {
    if (error.response.status === 401) {
      store.dispatch(`auth/${actionTypes.AUTH_LOGOUT}`, {
        useApi: false
      })
    }
    return Promise.reject(error.response)
  }
)

export default axiosInstance
