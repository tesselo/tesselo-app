import endpoints from '@/services/api/api.endpoints'
import client from '@/services/api/api.client'
import moment from 'moment'

import { formatCompositesList, formatUniquesList } from '@/services/api/api.models'

export default {

  /**
   * Get Composites
   */
  getComposites (options, axiosInstance = client) {
    return axiosInstance[endpoints.time.listComposites.method](endpoints.time.listComposites.url, {
      params: {
        ...options,
        active: true,
        min_date_before: moment().format('YYYY-MM-DD')
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
  getCompositeById (id, axiosInstance = client) {
    return axiosInstance[endpoints.time.listComposites.method](endpoints.time.listComposites.url + '/' + id)
    .then((response) => {
      return Promise.resolve({
        results: formatCompositesList([response.data])
      })
    })
  },
  getUniques (options, axiosInstance = client) {
    return axiosInstance[endpoints.time.listUniques.method](endpoints.time.listUniques.url, {
      params: {
        ...options,
        active: true,
        page_size: 600
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
