// import action and mutation types from file
// - https://vuex.vuejs.org/en/mutations.html#using-constants-for-mutation-types
import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'

export default {
  /**
   * Login
   *
   * @param {any} context
   */
  [actionTypes.AUTH_LOGIN] (context, user) {
    return APIAdapter.services.auth.login(user)
      .then(() => {
        context.commit(mutationTypes.AUTH_SET_AUTHENTICATION, true)
      })
  },

  /**
   * Login
   *
   * @param {any} context
   */
  [actionTypes.AUTH_LOGOUT] (context) {
    context.commit(mutationTypes.AUTH_REMOVE_AUTHENTICATION, true)
  },
}
