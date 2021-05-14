import endpoints from '@/services/api/api.endpoints'
import client from '@/services/api/api.client'

export default {
  get({ layer, formula, moment, predictedLayer, ordering, search, dateAfter, dateBefore, page, pageSize, minPercentageCovered, aggregationArea }, axiosInstance = client) {
    return axiosInstance[endpoints.formulaReport.getFormulaReport.method](endpoints.formulaReport.getFormulaReport.url, {
      params: {
        formula: formula ? formula.id : '',
        aggregationarea: aggregationArea || '',
        aggregationlayer: layer.id,
        composite: moment ? moment.id : '',
        predictedlayer: predictedLayer ? predictedLayer.id : '',
        search: search,
        ordering: ordering,
        date_after: dateAfter,
        date_before: dateBefore,
        page: page,
        page_size: pageSize,
        min_stats_percentage_covered: minPercentageCovered,
      }
    })
    .then((response) => {
      return Promise.resolve(response.data)
    })
  },
}
