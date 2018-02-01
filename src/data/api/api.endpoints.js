import { getPresentSentinelBands } from '@/services/util.js'


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
    vector: (id) => `https://tesselo.com/api/vtiles/${id}/{z}/{x}/{y}.pbf`,
    algebra: (formula, moment) => {
      if (!formula || !moment) {
        return ''
      }

      const presentBands = getPresentSentinelBands(formula.formula)
      
      const bandsParam = presentBands.map(band => band.search + '=' + moment.rasterlayerLookup[band.rasterlayerName]).join(',')
      
      let formulaParam = encodeURIComponent(formula.formula.replace(/\s/g,''))

      let colorMapParam = {
        continuous: true,
        range: [-1,1],
        from: [165,0,38],
        to:[0,104,55],
        over:[249,247,174]
      }

      
      colorMapParam = encodeURIComponent(JSON.stringify(colorMapParam))
      
      return `https://tesselo.com/api/algebra/{z}/{x}/{y}.png?layers=${bandsParam}&formula=${formulaParam}&colormap=${colorMapParam}`
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
  }
}
