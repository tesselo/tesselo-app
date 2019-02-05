import defaultState from './map.state'
import { mutationTypes } from '@/services/constants'

export default {
  [mutationTypes.MAP_SET_BOUNDS] (state, bounds) {
    state.bounds = bounds
  },
  [mutationTypes.MAP_RESET] (state) {  // eslint-disable-line
    state = defaultState
  }
}

