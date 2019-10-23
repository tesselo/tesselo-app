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
        return `${process.env.API_URL}algebra/{z}/{x}/{y}.png?layers=${bandsParam}&scale=0,1e4&alpha&enhance_brightness=3.0&enhance_sharpness=1.2&enhance_color=1.9&enhance_contrast=1.5`
      } else {
        const presentBands = getPresentSentinelBands(formula.formula)

        const bandsParam = presentBands.map(band => band.search + '=' + moment.rasterlayerLookup[band.rasterlayerName]).join(',')

        const formulaParam = encodeURIComponent(formula.formula.replace(/\s/g,''))

        const colorMapParam = getColorMapParam(formula)

        return `${process.env.API_URL}algebra/{z}/{x}/{y}.png?layers=${bandsParam}&formula=${formulaParam}&colormap=${colorMapParam}`
      }
    },
    predicted: (predictedLayer) => {
      if(!predictedLayer) {
        return ''
      }
      const rasterlayer_id = predictedLayer.rasterlayer
      return `${process.env.API_URL}tile/${rasterlayer_id}/{z}/{x}/{y}.png`
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
  },
  formulaReport: {
    getFormulaReport: {
      url: '/reportaggregation',
      method: 'get'
    }
  },
  predictedLayer: {
    list: {
      url: '/predictedlayer',
      method: 'get'
    }
  },
  bookmarkFolder:{
    getBookmarkFolder: {
      url: '/bookmarkfolder',
      method: 'get'
    },
    saveBookmarkFolder: {
      url: '/bookmarkfolder',
      method: 'post'
    },
    editBookmarkFolder: {
      url: '/bookmarkfolder',
      method: 'put'
    },
    deleteBookmarkFolder: {
      url: '/bookmarkfolder',
      method: 'delete'
    },

  },
  bookmark: {
    getBookmark: {
      url: '/bookmark',
      method: 'get'
    },
    saveBookmark: {
      url: '/bookmark',
      method: 'post'
    },
    editBookmark: {
      url: '/bookmark',
      method: 'put'
    },
    deleteBookmark: {
      url: '/bookmark',
      method: 'delete'
    },
  }
}
