import { actionTypes, mutationTypes } from '@/services/constants'
import APIAdapter from '@/services/api'
import months from '@/assets/utils/months'

export default {
  /**
   *
   * GET FORMULA REPORT
   */
  [actionTypes.FORMULA_REPORT_GET](context, { layer, formula, moment, predictedLayer, ordering, search, dateAfter, dateBefore, page, pageSize, minPercentageCovered, aggregationArea }) {
    return APIAdapter.services.formulaReport.get({ layer, formula, moment, predictedLayer, ordering, search, dateAfter, dateBefore, page, pageSize, minPercentageCovered, aggregationArea })
      .then((response) => {
        context.commit(mutationTypes.FORMULA_REPORT_SET, {
          layer,
          formula,
          moment,
          predictedLayer,
          ...response,
          page: page
        }
      )
    })
  },

  /**
   *
   * GET GRAPH INFO FOR REPORT AREA
   */
  [actionTypes.FORMULA_REPORT_CHART_GET](context, { layer, formula, moment, predictedLayer, ordering, search, dateAfter, dateBefore, page, pageSize, minPercentageCovered, aggregationArea }) {
    return APIAdapter.services.formulaReport.get({ layer, formula, moment, predictedLayer, ordering, search, dateAfter, dateBefore, page, pageSize, minPercentageCovered, aggregationArea })
      .then((response) => {
        // Function to convert month number in month name
        function monthName(mon) {
          // Months has an array with all months
          return months.map(item => item.completed)[mon - 1];
        }

        // Create new array only with graph info needed
        const chartData = response.results.map((entry) => {
          return {
            aggregationarea: entry['aggregationarea'],
            avg: entry['avg'] ? Number(entry['avg'].toFixed(2)) : null,
            year: entry['max_date'].slice(0,4),
            month: monthName(Number(entry['max_date'].slice(5,7))),
          }
        })

        // Create new array with available years for chart
        const chartYears = chartData.reduce((acc, current) => {
          const x = acc.find(item => item === current.year)
            return !x ? acc.concat([current.year]) : acc
          },[]).sort()

        context.commit(mutationTypes.FORMULA_REPORT_CHART_SET, { chartData, chartYears })
    })
  }
}