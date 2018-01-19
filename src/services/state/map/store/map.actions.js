import { actionTypes, mutationTypes } from '@/services/constants'

export default {
  [actionTypes.MAP_SET_BOUNDS] (context, bounds) {
    context.commit(mutationTypes.MAP_SET_BOUNDS, bounds)
  }
}
