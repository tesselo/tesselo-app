<template>
  <el-row class="report-container">
    <el-col
      :sm="{span: 22, offset: 1}"
      :md="{span: 16, offset: 4}"
      :lg="{span: 12, offset: 6}">
      <el-row>
        <el-col :span="24">
          <h2>
            <span v-if="selectedFormula">{{ selectedFormula.name }}</span> |
            <span v-if="selectedLayer">{{ selectedLayer.name }}</span> |
            <span v-if="selectedMoment">{{ selectedMoment.name }}</span>
          </h2>
        </el-col>
      </el-row>
      <el-row>
        <el-input
          v-model="input_search"
          placeholder="Search"
          clearable
          @keyup.enter="query" >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="query"/>
        </el-input>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            v-model="input_date_after"
            placeholder="Date after"
            suffix-icon="el-icon-date" />
        </el-col>
        <el-col :span="12">
          <el-input
            v-model="input_date_before"
            placeholder="Date before"
            suffix-icon="el-icon-date" />
        </el-col>
      </el-row>

      <el-row>
        <el-radio
          v-model="radio"
          label="aggregationarea__name">
          Name desc
        </el-radio>
        <el-radio
          v-model="radio"
          label="-aggregationarea__name">
          Name asc
        </el-radio>
        <el-radio
          v-model="radio"
          label="valuecountresult__stats_avg">
          Average desc
        </el-radio>
        <el-radio
          v-model="radio"
          label="-valuecountresult__stats_avg">
          Average asc
        </el-radio>
      </el-row>
      <el-row v-if="formulaReport">
        <bar-chart
          :labels="labels"
          :datasets="datasets"
          class="summary-chart" />
      </el-row>
      <el-row v-if="formulaReport">
        <aoi-item
          v-for="entry in formulaReport.results"
          :key="entry.key"
          :agg="entry" />
      </el-row>
      <div v-if="!formulaReport"><h2>No data</h2></div>
    </el-col>
  </el-row>
</template>

<script>
import 'element-ui/lib/theme-chalk/table.css'
import 'element-ui/lib/theme-chalk/form.css'
import 'element-ui/lib/theme-chalk/radio.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/col.css'
import 'element-ui/lib/theme-chalk/row.css'

import { mapState, mapActions } from 'vuex'
import { actionTypes } from '@/services/constants'
import BarChart from '@/components/bar-chart/bar-chart'
import AoiItem from './components/aoi-item/aoi-item'
import { debounce } from 'lodash'


export default {
  name: 'Report',
  components: {
    BarChart,
    AoiItem
  },
  data () {
    return {
      radio: 'aggregationarea__name',
      input_search: '',
      input_date_after: '',
      input_date_before: ''
    }
  },
  computed: {
    ...mapState({
      formulaReport: state => state.formulaReport.formulaReport,
      selectedFormula: state => state.formula.selectedFormula,
      selectedFormulaRow: state => state.formula.row,
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      selectedLayerRow: state => state.aggregationLayer.row,
      selectedMoment: state => state.time.selectedMoment
    }),
    labels() {
      if (this.formulaReport) {
        return this.formulaReport.results.map((reportItem) => reportItem.name)
      } else {
        return null
      }
    },
    datasets() {
      if (this.formulaReport) {
        return [
          {
            data: this.formulaReport.results.map((reportItem) => reportItem.avg),
            label: 'Average',
            backgroundColor: '#aac343'
          }
        ]
      } else {
        return null
      }
    }
  },
  watch: {
    radio(){
      this.query()
    },
    input_search(){
      this.query()
    },
    input_date_after(){
      console.log('changed date after', this.input_date_after)
      this.query()
    },
    input_date_before(){
      console.log('changed date before', this.input_date_before)
      this.query()
    }
  },
  mounted: function(){
    // Get aggregation data.
    this.getFormulaReport({layer: {id: this.$route.params.layer}, formula: {id: this.$route.params.formula}, moment: {id: this.$route.params.composite}})
    // Get meta info for the
    if (!this.selectedLayer){
      this.getAggregationLayerIDAction(this.$route.params.layer)
      .then(() => {
        this.selectAggregationLayer(this.selectedLayerRow)
      })
    }
    if (!this.selectedFormula){
      this.getFormulaIDAction(this.$route.params.formula)
      .then(() => {
        this.selectFormula(this.selectedFormulaRow)
      })
    }
    if (!this.selectedMoment){
      this.getCompositeById(this.$route.params.composite)
    }
  },
  methods: {
    ...mapActions('formulaReport', {
        getFormulaReport: actionTypes.FORMULA_REPORT_GET
    }),
    ...mapActions('aggregationLayer', {
      getAggregationLayerIDAction: actionTypes.AGGREGATION_LAYER_GET_ID,
      selectAggregationLayer: actionTypes.AGGREGATION_LAYER_SELECT
    }),
    ...mapActions('formula', {
      getFormulaIDAction: actionTypes.FORMULA_GET_ID,
      selectFormula: actionTypes.FORMULA_SELECT
    }),
    ...mapActions('time', {
      getCompositeById: actionTypes.TIME_GET_COMPOSITE_MOMENT_BY_ID,
      selectMoment: actionTypes.TIME_SELECT_MOMENT
    }),
    query: debounce(
      function () {
        this.getFormulaReport({
          layer: {id: this.$route.params.layer},
          formula: {id: this.$route.params.formula},
          moment: {id: this.$route.params.composite},
          ordering: this.radio,
          search: this.input_search,
          date_after: this.input_date_after,
          date_before: this.input_date_before
        })
      },
      1000
    )
  }
}
</script>

<style lang="scss" scoped>
.report-container {
  padding-top: 30px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
