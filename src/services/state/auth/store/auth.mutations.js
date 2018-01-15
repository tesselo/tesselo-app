// import mutation types from file
// - https://vuex.vuejs.org/en/mutations.html#using-constants-for-mutation-types
import { mutationTypes } from '@/services/constants'

export default {
  /**
   * Sets the authentication state after login
   * 
   * @param {any} state 
   * @param {any} { username, token, expires } 
   */
  [mutationTypes.AUTH_SET_AUTHENTICATION] (state, { username, token, expires }) {
    state.username = username
    state.token = token
    state.expires = expires
    state.authenticated = true
  },
  /**
   * Removes the authentication after logout
   * 
   * @param {any} state 
   */
  [mutationTypes.AUTH_REMOVE_AUTHENTICATION] (state) {
    state.username = null
    state.token = null
    state.expires = null
    state.authenticated = false
  }
}

