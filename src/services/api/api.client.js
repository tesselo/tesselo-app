import axios from 'axios'
import { baseUrl } from '@/services/util'

export const COOKIE_AUTH_KEY = 'auth_token'

const axiosInstance = axios.create({
  baseURL: baseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
})

axiosInstance.interceptors.request.use(function (config) {
  let auth
  if (localStorage.getItem('auth')) {
    auth = JSON.parse(localStorage.getItem('auth'))

    if (auth.authenticated) {
      // Set auth token as cookie.
      const expires = new Date(Date.parse(auth.expires)).toUTCString()
      document.cookie = `${COOKIE_AUTH_KEY}=${auth.token};expires=${expires};path=/;`
    }
  }
  return config
})

axiosInstance.interceptors.response.use(undefined, (error) => {
    if (error.response.status === 401) {
      // Remove auth storage.
      localStorage.removeItem('auth')
      // Clear auth cookie.
      document.cookie = `${COOKIE_AUTH_KEY}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;`
      // Set the logout route.
      if (!window.location.href.includes('/login')) {
        window.location.href = process.env.ROUTER_BASE + '/logout'
      }
    }
    return Promise.reject(error.response)
  }
)

export default axiosInstance
