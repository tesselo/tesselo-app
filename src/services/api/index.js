import endpoints from '@/services/api/api.endpoints'
import client from '@/services/api/api.client'

import auth from '@/services/api/services/api.auth.js'
import aggregationLayer from '@/services/api/services/api.aggregation-layer.js'
import formula from '@/services/api/services/api.formula.js'
import time from '@/services/api/services/api.time.js'
import report from '@/services/api/services/api.report.js'
import predictedLayer from '@/services/api/services/api.predicted-layer.js'
import bookmarkFolder from '@/services/api/services/api.bookmark-folder.js'
import bookmark from '@/services/api/services/api.bookmark.js'
import formulaReport from '@/services/api/services/api.formulareport.js'

/**
 * Adapter between server API and client application
 * @class APIAdapter
 */
class APIAdapter {
  constructor() {
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
    time,
    report,
    formulaReport,
    predictedLayer,
    bookmarkFolder,
    bookmark
  }
}

const instance = new APIAdapter()
Object.freeze(instance)

export default instance
