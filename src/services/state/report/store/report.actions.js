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
  [actionTypes.REPORT_GET_MULTIPLE_REGION] (context, { layer, formula, moment }) {
    const presentSentinelBands = getPresentSentinelBands(formula.formula)

    let areaFormulaBands = {}
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
        console.log(response)
        context.commit(mutationTypes.REPORT_SET_MULTIPLE_REGION, {
          layer,
          formula,
          moment,  
          response
        })
      })

  }
}
