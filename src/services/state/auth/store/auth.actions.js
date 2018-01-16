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
   * Login
   *
   * @param {any} context
   */
  [actionTypes.AUTH_LOGOUT] (context) {
    return APIAdapter.services.auth.logout()
      .then(() => {
        context.commit(mutationTypes.AUTH_REMOVE_AUTHENTICATION, true)
        router.push({ name: 'Login' })
      })
  },
}
