import defaultState from './time.state'
import { mutationTypes } from '@/services/constants'

export default {
  [mutationTypes.TIME_SET_LIST] (state, list) {
    state.list = list
  },
  [mutationTypes.TIME_SET_SELECTED_MOMENT_ID] (state, moment) {
    console.log('setting active moment id', moment)
    state.selectedMomentId = moment
  },
  [mutationTypes.TIME_SET_SELECTED_MOMENT] (state, moment) {
    console.log('setting active moment', moment)
    state.selectedMoment = moment
  },
  [mutationTypes.TIME_SET_ACTIVE_MONTH] (state, month) {
    console.log('setting active month', month)
    state.activeMonth = month
  },
  [mutationTypes.TIME_SET_ACTIVE_YEAR] (state, year) {
    console.log('setting active year', year)
    state.activeYear = year
  },
  [mutationTypes.TIME_RESET] (state) { // eslint-disable-line
    state = defaultState
  }
}
