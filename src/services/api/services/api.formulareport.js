import endpoints from '@/services/api/api.endpoints'
import client from '@/services/api/api.client'

export default {
  get({ layer, formula, moment, ordering, search, date_after, date_before, page, pageSize }, axiosInstance = client) {
    return axiosInstance[endpoints.formulaReport.getFormulaReport.method](endpoints.formulaReport.getFormulaReport.url, {
      params: {
        formula: formula.id,
        aggregationlayer: layer.id,
        composite: moment ? moment.id : '',
        search: search,
        ordering: ordering,
        date_after: date_after,
        date_before: date_before,
        page: page,
        page_size: pageSize
      }
    })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },
}
