import endpoints from '@/data/api/api.endpoints'
import client from '@/data/api/api.client'
import moment from 'moment'

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
