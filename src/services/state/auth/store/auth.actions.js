import router from '@/services/router'

import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'

const formatError = (errors) => ({
  nonFieldErrors: errors['non_field_errors']
})

export default {
  /**
   * Login
   *
   * @param {any} context
   * @param {Object} user
   * @param {String} user.username
   * @param {String} user.password
   */
  [actionTypes.AUTH_LOGIN] (context, user) {
    return APIAdapter.services.auth.login(user)
      .then((response) => {
        context.commit(mutationTypes.AUTH_SET_AUTHENTICATION, {
          username: user.username,
          ...response
        })
        router.push({ name: 'Home' })
      })
      .catch((response) => {
        throw formatError(response.data)
      })
  },

  /**
   * Logout
   *
   * @param {any} context
   * @param {Object} options
   * @param {Boolean} options.useApi - whether to make the api call or 
   * not. API isn't used when the action is dispatched from the axios error interceptor.
   */
  async [actionTypes.AUTH_LOGOUT] (context, { useApi = true }) {
    if (useApi) {
      await APIAdapter.services.auth.logout()
    }

    router.push({ name: 'Login' })
    context.commit(mutationTypes.AUTH_REMOVE_AUTHENTICATION)
  }
}
