import { actionTypes, mutationTypes } from '@/services/constants'

export default {
  [actionTypes.MAP_SET_BOUNDS] (context, bounds) {
    console.log('setMapBounds')
    context.commit(mutationTypes.MAP_SET_BOUNDS, bounds)
  }
}
