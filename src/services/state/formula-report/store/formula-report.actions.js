import { actionTypes, mutationTypes } from "@/services/constants";
import APIAdapter from "@/services/api";

export default {
  /**
   *
   * GET FORMULA REPORT
   */
  [actionTypes.FORMULA_REPORT_GET](
    context,
    {
      layer,
      formula,
      moment,
      predictedLayer,
      ordering,
      search,
      dateAfter,
      dateBefore,
      page,
      pageSize,
      minPercentageCovered,
      aggregationArea,
    }
  ) {
    return APIAdapter.services.formulaReport
      .get({
        layer,
        formula,
        moment,
        predictedLayer,
        ordering,
        search,
        dateAfter,
        dateBefore,
        page,
        pageSize,
        minPercentageCovered,
        aggregationArea,
      })
      .then((response) => {
        context.commit(mutationTypes.FORMULA_REPORT_SET, {
          layer,
          formula,
          moment,
          predictedLayer,
          ...response,
          page: page,
        });
      });
  },
};
