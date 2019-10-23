import endpoints from '@/data/api/api.endpoints'
import client from '@/data/api/api.client'

export default {
  get({ layer, formula, moment, ordering, search }, axiosInstance = client) {
    return axiosInstance[endpoints.formulaReport.getFormulaReport.method](endpoints.formulaReport.getFormulaReport.url, {
      params: {
        formula: formula.id,
        aggregationlayer: layer.id,
        composite: moment.id,
        search: search,
        ordering: ordering
      }
    })
      .then((response) => {
        return Promise.resolve(response.data)
      })
  },
}
