import { actionTypes, mutationTypes } from '@/services/constants'

export default {
  [actionTypes.MAP_SET_ZOOM] (context, zoom) {
    context.commit(mutationTypes.MAP_SET_ZOOM, zoom)
  },
  [actionTypes.MAP_SET_CENTER] (context, center) {
    context.commit(mutationTypes.MAP_SET_CENTER, center)
  },
  [actionTypes.MAP_SET_HOME_BOUNDS] (context, bounds) {
    context.commit(mutationTypes.MAP_SET_HOME_BOUNDS, bounds)
  },
  [actionTypes.MAP_SET_BASELAYER] (context, baselayer) {
    context.commit(mutationTypes.MAP_SET_BASELAYER, baselayer)
  },
  [actionTypes.MAP_SET_L_OPACITY] (context, opacity) {
    context.commit(mutationTypes.MAP_SET_L_OPACITY, opacity)
  },
  [actionTypes.MAP_SET_P_OPACITY] (context, opacity) {
    context.commit(mutationTypes.MAP_SET_P_OPACITY, opacity)
  },
  [actionTypes.RESET] (context) {
    context.commit(mutationTypes.MAP_RESET)
  }
}
