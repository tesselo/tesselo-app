import defaultState from './map.state'
import { mutationTypes } from '@/services/constants'

export default {
  [mutationTypes.MAP_SET_ZOOM] (state, zoom) {
    state.zoom = zoom
  },
  [mutationTypes.MAP_SET_CENTER] (state, center) {
    state.center = center
  },
  [mutationTypes.MAP_SET_HOME_BOUNDS] (state, bounds) {
    state.homeBounds = bounds
  },
  [mutationTypes.MAP_SET_BASELAYER] (state, baselayer) {
    state.baselayer = baselayer
  },
  [mutationTypes.MAP_SET_L_OPACITY] (state, opacity) {
    state.lOpacity = opacity
  },
  [mutationTypes.MAP_SET_P_OPACITY] (state, opacity) {
    state.pOpacity = opacity
  },
  [mutationTypes.MAP_RESET] (state) {  // eslint-disable-line
    state = defaultState
  }
}
