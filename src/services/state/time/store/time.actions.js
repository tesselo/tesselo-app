import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'

export default {
  [actionTypes.TIME_GET_COMPOSITES] (context, options) {
    return APIAdapter.services.time.getComposites(options)
      .then((response) => {
        console.log('actionTypes.TIME_GET_COMPOSITES response', response.results, response.results.length)
        context.commit(mutationTypes.TIME_SET_LIST, response.results)
        context.commit(mutationTypes.TIME_SET_SELECTED_MOMENT, response.results[response.results.length - 1])
      })
  },
  [actionTypes.TIME_GET_UNIQUES] (context, options) {
    return APIAdapter.services.time.getUniques(options)
      .then((response) => {
        console.log('actionTypes.TIME_GET_UNIQUES response', response)
        context.commit(mutationTypes.TIME_SET_LIST, response.results)
        context.commit(mutationTypes.TIME_SET_SELECTED_MOMENT, response.results[response.results.length - 1])
      })
  },
  [actionTypes.TIME_SELECT_MOMENT] (context, moment) {
    context.commit(mutationTypes.TIME_SET_SELECTED_MOMENT, moment)
  }
}