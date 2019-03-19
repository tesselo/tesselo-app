import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'


export default {
  /**
   * Trigger API call for predicted layers
   *
   * @param {any} context
   */
  [actionTypes.PREDICTED_LAYER_GET] ({ rootState, commit }, options) {
    const year = rootState.time.selectedMoment && rootState.time.selectedMoment.year
    const areaId = rootState.aggregationLayer.selectedLayer && rootState.aggregationLayer.selectedLayer.id

    if (year) {
      options.year = year
    }

    if (areaId) {
      options.areaId = areaId
    }

    return APIAdapter.services.predictedLayer.get(options)
      .then((response) => {
        commit(mutationTypes.PREDICTED_LAYER_SET_LAYERS, {
          ...response,
          page: options.page
        })
      })
  },
  /**
   * Sets the selected layer
   *
   * @param {any} context
   * @param {any} layer
   */
  [actionTypes.PREDICTED_LAYER_SELECT] (context, layer) {
    context.commit(mutationTypes.PREDICTED_LAYER_SELECT_LAYER, layer)
  },
  [actionTypes.RESET] (context) {
    context.commit(mutationTypes.PREDICTED_LAYER_RESET)
  }
}
