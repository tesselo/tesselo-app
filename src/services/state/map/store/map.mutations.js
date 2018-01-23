// import mutation types from file
// - https://vuex.vuejs.org/en/mutations.html#using-constants-for-mutation-types
import { mutationTypes } from '@/services/constants'

export default {
  [mutationTypes.MAP_SET_BOUNDS] (state, bounds) {
    state.bounds = bounds
  }
}

