import { getColorMapParam, getPresentSentinelBands } from '@/services/util.js'

export default {
  /* -------------------------------------
   * AUTH
   * ---------------------------------- */
  auth: {
    login: {
      url: '/token-auth/',
      method: 'post'
    },
    logout: {
      url: '/token-logout/',
      method: 'post'
    }
  },
  /* -------------------------------------
   * AUTH
   * ---------------------------------- */
  aggregationLayer: {
    list: {
      url: '/aggregationlayer',
      method: 'get'
    }
  },
  formula: {
    list: {
      url: '/formula',
      method: 'get'
    }
  },
  map: {
    vector: (id) => `${process.env.API_URL}vtiles/${id}/{z}/{x}/{y}.pbf`,
    algebra: (formula, moment) => {
      if (!formula || !moment) {
        return ''
      }
      // Catch RGB mode.
      if (formula.acronym === 'RGB') {
        const bandsParam = [
          'r=' + moment.rasterlayerLookup['B04.jp2'],
          'g=' + moment.rasterlayerLookup['B03.jp2'],
          'b=' + moment.rasterlayerLookup['B02.jp2']
        ].join(',')
        return `${process.env.API_URL}algebra/{z}/{x}/{y}.png?layers=${bandsParam}&scale=10,3e3`
      } else {
        const presentBands = getPresentSentinelBands(formula.formula)

        const bandsParam = presentBands.map(band => band.search + '=' + moment.rasterlayerLookup[band.rasterlayerName]).join(',')

        const formulaParam = encodeURIComponent(formula.formula.replace(/\s/g,''))

        const colorMapParam = getColorMapParam(formula)

        return `${process.env.API_URL}algebra/{z}/{x}/{y}.png?layers=${bandsParam}&formula=${formulaParam}&colormap=${colorMapParam}`
      }
    }
  },
  time: {
    listComposites: {
      url: '/composite',
      method: 'get'
    },
    listUniques: {
      url: '/sentineltileaggregationlayer',
      method: 'get'
    }
  },
  report: {
    getRegionReport: {
      url: '/valuecountresult',
      method: 'get'
    },
    createRegionReport: {
      url: '/valuecountresult',
      method: 'post'
    }
  }
}
