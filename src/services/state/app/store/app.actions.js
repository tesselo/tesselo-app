// import action and mutation types from file
// - https://vuex.vuejs.org/en/mutations.html#using-constants-for-mutation-types
import { actionTypes, mutationTypes } from '@/services/constants'
import { deviceType } from 'detect-it'

export default {
  /**
   * Detect if device is touch
   *
   * @param {any} context
   */
  [actionTypes.DETECT_DEVICE_TOUCH] (context) {
    context.commit(mutationTypes.SET_DEVICE_TOUCH, deviceType.hasTouch)
  },

  /**
   * Set loading screen for the whole app
   *
   * @param {any} context
   */
  [actionTypes.APP_SET_LOADING] (context, toShow) {
    context.commit(mutationTypes.SET_LOADING_VISIBILITY, toShow)
  }
}
