// import mutation types from file
// - https://vuex.vuejs.org/en/mutations.html#using-constants-for-mutation-types
import { mutationTypes } from '@/services/constants'

export default {
  /**
   * Sets the authentication state after login
   *
   * @param {any} state
   * @param {Object} user
   * @param {String} user.username
   * @param {String} user.token
   * @param {String} user.expires
   */
  [mutationTypes.AUTH_SET_AUTHENTICATION] (state, { username, token, expires, is_staff, profile }) {
    state.username = username
    state.token = token
    state.expires = expires
    state.authenticated = true
    state.is_staff = is_staff
    state.profile = profile

    window.localStorage.setItem('auth', JSON.stringify({
      username,
      token,
      expires,
      is_staff,
      profile,
      authenticated: true
    }))
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
    state.is_staff = false
    state.profile = {}
    localStorage.removeItem('auth')
  }
}
