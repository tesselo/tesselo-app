import defaultState from './default-state'
import { mutationTypes } from '@/services/constants'

export default {
  [mutationTypes.MAP_SET_BOUNDS] (state, bounds) {
    state.bounds = bounds
  },
  [mutationTypes.MAP_RESET] (state) {
    state = defaultState
  }
}

