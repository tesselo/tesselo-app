import endpoints from '@/data/api/api.endpoints'
import client from '@/data/api/api.client'

export default {
  get({ layer, formula, moment, ordering, search, date_after, date_before }, axiosInstance = client) {
    return axiosInstance[endpoints.formulaReport.getFormulaReport.method](endpoints.formulaReport.getFormulaReport.url, {
      params: {
        formula: formula.id,
        aggregationlayer: layer.id,
        composite: moment ? moment.id : '',
        search: search,
        ordering: ordering,
        date_after: date_after,
        date_before: date_before
      }
    })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },
}
