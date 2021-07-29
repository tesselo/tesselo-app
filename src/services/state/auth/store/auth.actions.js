import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/services/api'
import _ from 'lodash'

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
        let timeDimensionTypes = _.get(response.profile, 'timeDimensionsTypes', ["Monthly"])

        if(timeDimensionTypes.length > 1) {
          // Capital letter in every time dimension type
          timeDimensionTypes = timeDimensionTypes.split(",").map(item => item.charAt(0).toUpperCase() + item.substr(1))
        }

        response.profile.timeDimensionsTypes = timeDimensionTypes
        response.profile.showBookmarks = JSON.parse(_.get(response.profile, 'showBookmarks', false))

        context.commit(mutationTypes.AUTH_SET_AUTHENTICATION, {
          username: user.username,
          ...response
        })
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
  [actionTypes.AUTH_LOGOUT] (context) {
    function resetAuth() {
      context.commit(mutationTypes.AUTH_REMOVE_AUTHENTICATION)
      context.commit(mutationTypes.RESET_STORE, null, { root: true })
    }
    APIAdapter.services.auth.logout().then(resetAuth, resetAuth)
  },
  [actionTypes.AUTH_START] (context) {
    const auth = JSON.parse(window.localStorage.getItem('auth'))

    if (auth) {
      context.commit(mutationTypes.AUTH_SET_AUTHENTICATION, auth)
    }
    return
  }
}
