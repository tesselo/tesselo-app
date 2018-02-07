import endpoints from '@/data/api/api.endpoints'
import client from '@/data/api/api.client'

import { formatCompositesList, formatUniquesList } from '@/data/api/api.models'

export default {
 
  /**
   * Get Composites
   */
  getComposites (options, axiosInstance = client) {
    return axiosInstance[endpoints.time.listComposites.method](endpoints.time.listComposites.url, {
      params: {
        ...options,
        official: true,
        active: true
      }
    })
    .then((response) => {
      return Promise.resolve({
        results: formatCompositesList(response.data.results, {
          yearToRemove: options.year
        })
      })
    })
  },
  getUniques (options, axiosInstance = client) {
    ('getUniques', options)
    return axiosInstance[endpoints.time.listUniques.method](endpoints.time.listUniques.url, {
      params: {
        ...options,
        official: true,
        active: true,
        page_size: 300
      }
    })
    .then((response) => {
      return Promise.resolve({
        results: formatUniquesList(response.data.results, {
          yearToRemove: options.year
        })
      })
    })
  }
}