import { mutationTypes } from '@/services/constants'

export default {

  /**
   * Set if device is touchable on app state
   *
   * @param {state} state
   * @param {boolean} authenticated
   */
  [mutationTypes.SET_DEVICE_TOUCH] (state, touch) {
    state.isTouch = touch
  },

  /**
   * Set loading screen visibility
   *
   * @param {state} state
   * @param {boolean} toShow
   */
  [mutationTypes.SET_LOADING_VISIBILITY] (state, toShow) {
    state.isLoading = toShow
  }
}

