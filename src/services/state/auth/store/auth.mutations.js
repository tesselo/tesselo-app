// import mutation types from file
// - https://vuex.vuejs.org/en/mutations.html#using-constants-for-mutation-types
import { mutationTypes } from '@/services/constants'

export default {
  [mutationTypes.AUTH_SET_AUTHENTICATION] (state, options) {
    console.log('auth store auth_set_authentication mutation', state, options)
  }
}

