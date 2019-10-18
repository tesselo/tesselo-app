import defaultState from './time.state'
import { mutationTypes } from '@/services/constants'

export default {
  [mutationTypes.TIME_SET_LIST] (state, list) {
    state.list = list
  },
  [mutationTypes.TIME_SET_SELECTED_MOMENT_ID] (state, moment) {
    state.selectedMomentId = moment
  },
  [mutationTypes.TIME_SET_SELECTED_MOMENT] (state, moment) {
    state.selectedMoment = moment
  },
  [mutationTypes.TIME_SET_ACTIVE_MONTH] (state, month) {
    state.activeMonth = month
  },
  [mutationTypes.TIME_SET_ACTIVE_YEAR] (state, year) {
    state.activeYear = year
  },
  [mutationTypes.TIME_SET_CURRENT_TIME_TYPE] (state, ttype) {
    state.currentTimeType = ttype
  },
  [mutationTypes.TIME_RESET] (state) { // eslint-disable-line
    state = defaultState
  }
}
