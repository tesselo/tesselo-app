import defaultState from './bookmark.state'
import Vue from 'vue'

import { mutationTypes } from '@/services/constants'

export default {
  /**
   * Sets bookmark folders received
   *
   * @param {any} state
   * @param {any} report
   */
  [mutationTypes.BOOKMARK_SET] (state, response) {
    Vue.set(state.bookmark, response)
  },

  /**
   * Reset state
   *
   * @param {any} state
   */
  [mutationTypes.BOOKMARK_RESET] (state) {  // eslint-disable-line
    state = defaultState
    window.localStorage.removeItem('savedBookmark')
  }
}
