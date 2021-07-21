import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/services/api'


export default {
  /**
   * Trigger API call for formulas
   *
   * @param {any} context
   */
  [actionTypes.FORMULA_GET] (context, options) {
    return APIAdapter.services.formula.get(options)
      .then((response) => {
        // Get the first RGB formula
        const rgbMiniMap = response.results.find(val => val.acronym === "RGB")

        context.commit(mutationTypes.FORMULA_SET_FORMULAS, {
          ...response,
          page: options.page,
          rgbMiniMap: rgbMiniMap
        })
      })
  },

  /**
   * Trigger API call for formula by ID
   *
   * @param {any} context
   */
  [actionTypes.FORMULA_GET_ID] (context, options) {
    return APIAdapter.services.formula.getById(options)
      .then((response) => {
        context.commit(mutationTypes.FORMULA_ID_SET, response)
      })
  },

  /**
   * Sets the selected formula
   *
   * @param {any} context
   * @param {any} formula
   */
  [actionTypes.FORMULA_SELECT] (context, formula) {
    context.commit(mutationTypes.FORMULA_SELECT_FORMULA, formula)
  },
  [actionTypes.RESET] (context) {
    context.commit(mutationTypes.FORMULA_RESET)
  },
}