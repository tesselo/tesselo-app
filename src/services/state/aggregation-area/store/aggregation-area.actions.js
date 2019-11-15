import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/services/api'


export default {
  [actionTypes.AGGREGATION_AREA_GET] (context, options) {
    return APIAdapter.services.aggregationArea.get(options)
      .then((response) => {
        context.commit(mutationTypes.AGGREGATION_AREA_SET_AREAS, {
          ...response,
          page: options.page
        })
      })
  },

  [actionTypes.AGGREGATION_AREA_GET_ID] (context, options) {
    return APIAdapter.services.aggregationArea.getById(options)
      .then((response) => {
        context.commit(mutationTypes.AGGREGATION_AREA_SELECT_AREA, response)
      })
  },

  [actionTypes.AGGREGATION_AREA_SELECT] (context, area) {
    context.commit(mutationTypes.AGGREGATION_AREA_SELECT_AREA, area)
  },

  [actionTypes.AGGREGATION_AREA_RESET] (context) {
    context.commit(mutationTypes.AGGREGATION_AREA_RESET)
  },

  [actionTypes.AGGREGATION_AREA_SAVE](context, options) {
    return APIAdapter.services.aggregationArea.save(options).then((response) => {
      context.commit(mutationTypes.AGGREGATION_AREA_SELECT_AREA, response)
    })
  },

  [actionTypes.AGGREGATION_AREA_EDIT](context, options) {
    return APIAdapter.services.aggregationArea.edit(options).then((response) => {
      context.commit(mutationTypes.AGGREGATION_AREA_SELECT_AREA, response)
    })
  },

  [actionTypes.AGGREGATION_AREA_DELETE](context, options) {
    return APIAdapter.services.aggregationArea.delete(options).then(() => {
      context.commit(mutationTypes.AGGREGATION_AREA_RESET)
    })
  }
}
