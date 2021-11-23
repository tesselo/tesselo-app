import axios from 'axios'

import { routeTypes } from "@/services/constants"
import { baseUrl } from '@/services/util'
import router from '@/services/router'


const axiosInstance = axios.create({
  baseURL: baseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
})

axiosInstance.interceptors.response.use(undefined, (error) => {
    if (error.response.status === 401 /*&& router.currentRoute.name != routeTypes.LOGIN*/) {
      router.push({ name: "Logout" })
    }
    return Promise.reject(error.response)
  }
)

export default axiosInstance
