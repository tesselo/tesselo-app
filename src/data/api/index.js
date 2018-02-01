import endpoints from '@/data/api/api.endpoints'
import client from '@/data/api/api.client'

import auth from '@/data/api/services/api.auth.js'
import aggregationLayer from '@/data/api/services/api.aggregation-layer.js'
import formula from '@/data/api/services/api.formula.js'
import time from '@/data/api/services/api.time.js'

/**
 * Adapter between server API and client application
 * @class APIAdapter
 */
class APIAdapter {
  constructor () {
    if (!APIAdapter.instance) {
      APIAdapter.instance = this
    }
    return APIAdapter.instance
  }

  // Axios instance
  client = client

  // Endpoints defined in api.endpoints.js file
  endpoints = endpoints

  // Services for each of the API requests
  /* eslint-disable */
  services = {
    auth,
    aggregationLayer,
    formula,
    time
  }
}

const instance = new APIAdapter()
Object.freeze(instance)

export default instance
