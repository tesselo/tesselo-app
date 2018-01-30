import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'

export default {
  [actionTypes.TIME_GET_COMPOSITES] (context, options) {
    console.log('actionTypes.TIME_GET_COMPOSITES', options)
    APIAdapter.services.time.getComposites(options)
      .then((response) => {
        console.log(response)
        context.commit(mutationTypes.TIME_SET_COMPOSITES_LIST)
      })
  },
  [actionTypes.TIME_GET_UNIQUES] (context) {
    context.commit(mutationTypes.TIME_SET_UNIQUES_LIST)
  },
  [actionTypes.TIME_SELECT_MOMENT] (context) {
    context.commit(mutationTypes.TIME_SET_SELECTED_MOMENT)
  }
}