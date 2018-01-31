import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'

export default {
  [actionTypes.TIME_GET_LIST] (context, options) {
    let apiCall

    if (['Monthly', 'Weekly'].indexOf(options.params.interval) !== -1) {
      apiCall = APIAdapter.services.time.getComposites
    } else {
      apiCall = APIAdapter.services.time.getUniques
    }

    
    return apiCall(options.params)
      .then((response) => {
        context.commit(mutationTypes.TIME_SET_LIST, response.results)

        if (response.results.length) {
          if (options.autoSelect == 'first' && response.results[0]) {
            context.commit(mutationTypes.TIME_SET_SELECTED_MOMENT, response.results[0])
          } else if (options.autoSelect == 'last' && response.results[response.results.length - 1]) {
            context.commit(mutationTypes.TIME_SET_SELECTED_MOMENT, response.results[response.results.length - 1])
          }
        }
      })
  },
  [actionTypes.TIME_SELECT_MOMENT] (context, moment) {
    context.commit(mutationTypes.TIME_SET_SELECTED_MOMENT, moment)
  }
}