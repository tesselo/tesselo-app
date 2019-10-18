import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'

export default {
  [actionTypes.TIME_GET_LIST] (context, options) {
    let apiCall

    if (['Monthly', 'Weekly', 'Custom'].indexOf(options.params.interval) !== -1) {
      apiCall = APIAdapter.services.time.getComposites
    } else {
      apiCall = APIAdapter.services.time.getUniques
    }

    return apiCall(options.params)
      .then((response) => {
        context.commit(mutationTypes.TIME_SET_LIST, response.results)
      })
  },
  [actionTypes.TIME_SELECT_MOMENT_ID] (context, moment) {
    context.commit(mutationTypes.TIME_SET_SELECTED_MOMENT_ID, moment)
  },
  [actionTypes.TIME_SELECT_MOMENT] (context, moment) {
    context.commit(mutationTypes.TIME_SET_SELECTED_MOMENT, moment)
  },
  [actionTypes.TIME_SET_ACTIVE_MONTH] (context, month) {
    context.commit(mutationTypes.TIME_SET_ACTIVE_MONTH, month)
  },
  [actionTypes.TIME_SET_ACTIVE_YEAR] (context, year) {
    context.commit(mutationTypes.TIME_SET_ACTIVE_YEAR, year)
  },
  [actionTypes.TIME_SET_CURRENT_TIME_TYPE] (context, ttype) {
    context.commit(mutationTypes.TIME_SET_CURRENT_TIME_TYPE, ttype)
  },
  [actionTypes.RESET] (context) {
    context.commit(mutationTypes.TIME_RESET)
  }
}
