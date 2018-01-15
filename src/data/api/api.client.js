/**
 * @file API adapter using Axios library
 */

import axios from 'axios'
import { baseUrl } from '@/services/util'

// Create axios instance
const axiosInstance = axios.create({
  baseURL: baseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
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
