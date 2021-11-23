<template>
  <div class="report-history-panel d-flex flex-column align-items-center justify-content-end">
    <el-table
      :data="rows"
      :row-class-name="tableRowClassName"
      class="report-history-table"
      size="small"
      style="width: 100%"
      @current-change="selectReport"
    >
      <el-table-column
        prop="layer.name"
        label="Area" />
      <el-table-column
        prop="layer.aggregationAreas.length"
        label="Zones" />
      <el-table-column
        prop="formula.acronym"
        label="Formula" />
      <el-table-column
        prop="moment.name"
        label="Date" />
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { actionTypes } from '@/services/constants'

// import {
//   Table as ElTable,
//   TableColumn as ElTableColumn
// } from 'element-plus'

export default {
  name: 'ReportHistory',
  // components: {
  //   ElTable,
  //   ElTableColumn
  // },
  computed: {
    ...mapState({
      rows: state => {
        const reports = state.report.savedReports
        return Object.keys(state.report.savedReports).map((key) => ({
          key,
          layer: reports[key].layer,
          formula: reports[key].formula,
          moment: reports[key].moment
        }))
      },
      selectedReport: state => state.report.selectedReport
    })
  },
  methods: {
    ...mapActions('report', {
      selectReportAction: actionTypes.REPORT_SELECT_MULTIPLE_REGION
    }),
    ...mapActions('aggregationLayer', {
      selectLayer: actionTypes.AGGREGATION_LAYER_SELECT
    }),
    ...mapActions('formula', {
      selectFormula: actionTypes.FORMULA_SELECT
    }),
    ...mapActions('time', {
      selectMoment: actionTypes.TIME_SELECT_MOMENT
    }),
    selectReport(report) {
      this.selectLayer(report.layer)
      this.selectFormula(report.formula)
      this.selectMoment(report.moment)
      this.selectReportAction(report.key)
      this.$emit('select', report)
    },
    tableRowClassName(data) {
      if (this.selectReportAction && this.selectedReport === data.key) {
        return 'selected'
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .report-history-panel {
    position: relative;
    min-width: 600px;
    min-height: 400px;
    max-height: 700px;
  }

  .report-history-table {
    margin: 20px 0 20px;
    overflow: auto;
  }
</style>
