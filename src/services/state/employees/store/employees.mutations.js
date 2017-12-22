import { mutationTypes } from '@/services/constants'

export default {

  /**
   * set employes
   *
   * @param {state} state
   * @param {boolean} employees
   */
  [mutationTypes.EMPLOYEES_SET_EMPLOYEES] (state, employees) {
    state.employees = employees
  },
}
