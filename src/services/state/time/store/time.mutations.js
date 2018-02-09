import defaultState from './default-state'
import { mutationTypes } from '@/services/constants'

export default {
  [mutationTypes.TIME_SET_LIST] (state, list) {
    state.list = list
  },
  [mutationTypes.TIME_SET_SELECTED_MOMENT] (state, moment) {
    state.selectedMoment = moment
  },
  
  [mutationTypes.TIME_RESET] (state) { // eslint-disable-line
    state = defaultState
  }
}