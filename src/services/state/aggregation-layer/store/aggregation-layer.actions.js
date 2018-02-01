import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'


export default {
  /**
   * Trigger API call for aggregation layers
   *
   * @param {any} context
   */
  [actionTypes.AGGREGATION_LAYER_GET] (context, options) {
    return APIAdapter.services.aggregationLayer.get(options)
      .then((response) => {
        context.commit(mutationTypes.AGGREGATION_LAYER_SET_LAYERS, {
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
  [actionTypes.AGGREGATION_LAYER_SELECT] (context, layer) {
    context.commit(mutationTypes.AGGREGATION_LAYER_SELECT_LAYER, layer)
  }
}
