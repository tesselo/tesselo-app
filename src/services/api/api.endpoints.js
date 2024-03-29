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
   * Other
   * ---------------------------------- */
  aggregationLayer: {
    list: {
      url: '/aggregationlayer',
      method: 'get'
    },
    edit: {
      url: '/aggregationlayer',
      method: 'put'
    },
    save: {
      url: '/aggregationlayer',
      method: 'post'
    },
    delete: {
      url: '/aggregationlayer',
      method: 'delete'
    },
    getUploadLink: {
      url_base: '/aggregationlayer',
      url_tail: '/upload',
      method: 'post'
    },
    parseLayer: {
      url_base: '/aggregationlayer',
      url_tail: '/parse',
      method: 'post'
    },
  },
  aggregationArea: {
    list: {
      url: '/aggregationarea',
      method: 'get'
    },
    edit: {
      url: '/aggregationarea',
      method: 'put'
    },
    save: {
      url: '/aggregationarea',
      method: 'post'
    },
    delete: {
      url: '/aggregationarea',
      method: 'delete'
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
      const moment_url_type = moment.type == 'unique' ? 'scene' : 'composite'
      const pk = moment.type == 'unique' ? moment.sentineltile_id : moment.id
      return `${process.env.API_URL}formula/${formula.id}/${moment_url_type}/${pk}/{z}/{x}/{y}.png`
    },
    predicted: (predictedLayer) => {
      if(!predictedLayer) {
        return ''
      }
      return `${process.env.API_URL}predictedlayer/${predictedLayer.id}/{z}/{x}/{y}.png`
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
