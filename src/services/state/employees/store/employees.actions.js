// import action and mutation types from file
// - https://vuex.vuejs.org/en/mutations.html#using-constants-for-mutation-types
import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/data/api'

export default {
  /**
   * Make employees GET request
   *
   * @param {any} context
   */
  [actionTypes.EMPLOYEES_GET_EMPLOYEES] (context) {
    return new Promise((resolve, reject) => {
      APIAdapter.services.employees.getEmployees().then((response) => {
        context.commit(mutationTypes.EMPLOYEES_SET_EMPLOYEES, response);
        resolve(true);
      })
      .catch((error) => reject(error))
    })
  }
}
