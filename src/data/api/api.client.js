/**
 * @file API adapter using Axios library
 */

import axios from 'axios'
import { baseUrl } from '@/services/util'
import store from '@/services/store'

// Create axios instance
const axiosInstance = axios.create({
  baseURL: baseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

axiosInstance.interceptors.request.use(function (config) {
  try {
    if (store.getters['auth/isAuthenticated']) {
      config.headers.Authorization = 'Token ' + store.getters['auth/token']
    }
  } catch(e) {
    console.log(e)
  }

  return config
})
/**
 * RESPONSE INTERCEPTORS
 */
axiosInstance.interceptors.response.use(undefined,
  error => {
    return Promise.reject(error.response)
  }
)

export default axiosInstance
