import hash from 'object-hash'

import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'
import { getPresentSentinelBands } from '@/services/util'

export default {
  /**
   * 
   * 
   * @param {any} context 
   * @param {any} { layer, formula, moment} 
   */
  [actionTypes.REPORT_GET_MULTIPLE_REGION] (context, { layer, formula, moment, loadFromMemory }) {
    console.log('REPORT_GET_MULTIPLE_REGION');

    const objectKey = hash({ layer, formula, moment })

    // if (context.state.reports[objectKey] && loadFromMemory) {
    //   context.commit(mutationTypes.REPORT_SET_SELECTED_MULTIPLE_REPORT, objectKey)
    //   return Promise.resolve()
    // }
    

    let areaFormulaBands = {}

    const presentSentinelBands = getPresentSentinelBands(formula.formula)
    presentSentinelBands.forEach((band) => {
      areaFormulaBands[band.search] = moment.rasterlayerLookup[band.rasterlayerName]
    })

    const areas = layer.aggregationAreas.map((area) => {
      return {
        'aggregationarea': area,
        'layer_names': areaFormulaBands,
        'formula': formula.formula.replace(/\s/g,'')
      }
    })

    return APIAdapter.services.report.getMultipleRegions(areas)
      .then((response) => {
        context.commit(mutationTypes.REPORT_SET_MULTIPLE_REGION, {
          layer,
          formula,
          moment,  
          response
        })
      })

  }
}
