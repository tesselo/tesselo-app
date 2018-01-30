import { mutationTypes } from '@/services/constants'

export default {
  [mutationTypes.TIME_SET_COMPOSITES_LIST] (state, list) {
    state.compositesList = list
  },
  [mutationTypes.TIME_SET_UNIQUES_LIST] (state, list) {
    state.uniquesList = list
  },
  [mutationTypes.TIME_SET_SELECTED_MOMENT] (state, moment) {
    state.selectedMoment = moment
  }
}