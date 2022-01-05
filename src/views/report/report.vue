<template>
  <el-row class="report-container">
    <el-col
      :xs="{span: 22, offset: 1}"
      :sm="{span: 20, offset: 2}"
      :md="{span: 16, offset: 4}"
      :lg="{span: 12, offset: 6}">
      <el-row>
        <el-col
          :span="24"
          class="header-row">
          <h2>
            <span v-if="selectedLayer">{{ selectedLayer.name }}</span>
            <span v-if="showTrend && rows && !predictedArea">| {{ trendAreaName }}</span>
            <span v-if="selectedFormula && !predicted && !predictedArea">| {{ selectedFormula.acronym }}</span>
            <span v-if="selectedPredictedLayer">| {{ selectedPredictedLayer.nameToShow }}</span>
            <span v-if="predictedArea">{{ definePredictedAreaName }}</span>
            <span
              v-if="selectedFormula && !predicted && !predictedArea"
              class="formula-name-header">
              {{ selectedFormula.name }}
            </span>
          </h2>
        </el-col>
      </el-row>
      <el-row
        v-if="!reportArea && !predictedArea"
        :gutter="10">
        <el-col
          :sm="13"
          class="header-row">
          <el-input
            v-model="search"
            :placeholder="pageData.placeHolders.search"
            :disabled="loading"
            clearable>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="query"/>
          </el-input>
        </el-col>
        <el-col
          :sm="11"
          class="header-row">
          <el-date-picker
            v-model="monthrange"
            :start-placeholder="pageData.placeHolders.startMonth"
            :end-placeholder="pageData.placeHolders.endMonth"
            :disabled="loading"
            type="monthrange"/>
        </el-col>
      </el-row>
      <el-row v-else-if="reportArea">
        <el-divider />
      </el-row>
      <el-row v-if="!predictedArea">
        <el-col
          :sm="predicted ? 6 : 8"
          :lg="predicted ? 6 : 10"
          :xl="predicted ? 6 : 7">
          <el-radio-group
            v-model="currentSort"
            :disabled="disableWhenHaveOnlyOneArea || classSortValue !== '' || !has_data || loading"
            size="mini">
            <el-tooltip
              v-for="item in sorts"
              :key="item.hoverContent"
              :content="item.hoverContent"
              :visible-arrow="true"
              :open-delay="pageData.openDelay"
              effect="dark"
              placement="bottom">
              <el-radio-button
                :key="item.name"
                :label="item.name"/>
            </el-tooltip>
          </el-radio-group>
        </el-col>
        <el-col
          v-if="!predicted && !predictedArea"
          :sm="4"
          :lg="5"
          :xl="3">
          <el-tooltip
            :content="pageData.hoverInfo.selectFormula"
            :visible-arrow="true"
            :open-delay="pageData.openDelay"
            effect="dark"
            placement="bottom">
            <el-select
              v-model="layerFilterValue"
              :loading="selectLoading"
              :disabled="!has_data || loading"
              size="mini">
              <el-tooltip
                v-for="item in selectformulaRows"
                :key="item.id"
                :visible-arrow="false"
                :content="item.name"
                :open-delay="pageData.openDelay"
                effect="dark"
                placement="right">
                <el-option
                  :value="item.id"
                  :label="item.acronym"
                  class="created" />
              </el-tooltip>
            </el-select>
          </el-tooltip>
        </el-col>
        <el-col
          v-if="predicted"
          :sm="predicted ? 6 : 5"
          :lg="5"
          :xl="predicted? 5 : 4">
          <el-select
            v-if="selectedPredictedLayer"
            v-model="classSortValue"
            :placeholder="pageData.placeHolders.sortByclass"
            :disabled="disableWhenHaveOnlyOneArea || !has_data || loading"
            size="mini"
            clearable>
            <!-- The created class below is a hack due to global form css override from bookmarks in app.vue -->
            <el-option
              v-for="item in selectedPredictedLayerRow.legend"
              :value="item.expression"
              :key="item.expression"
              :label="item.name"
              class="created">
              <span
                :style="{backgroundColor: item.color, borderColor: item.color}"
                class="class-sort-marker"/>
              <span class="class-sort-label">{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col
          :sm="predicted ? 6 : 4"
          :lg="predicted ? 7 : 5"
          :xl="predicted ? 7 : 4">
          <el-button-group>
            <el-tooltip
              :content="ascDesc ? pageData.hoverInfo.sortAscending : pageData.hoverInfo.sortDescending"
              :visible-arrow="true"
              :open-delay="pageData.openDelay"
              effect="dark"
              placement="bottom">
              <el-button
                :icon="ascDesc ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                :disabled="disableWhenHaveOnlyOneArea || !has_data || loading"
                type="default"
                size="mini"
                @click="ascDescToggle"/>
            </el-tooltip>
            <el-tooltip
              :content="percentageSort ? pageData.hoverInfo.sortByAbsoluteValue : pageData.hoverInfo.sortByPercentage"
              :visible-arrow="true"
              :open-delay="pageData.openDelay"
              effect="dark"
              placement="bottom">
              <el-button
                v-if="predicted"
                :disabled="disableWhenHaveOnlyOneArea || classSortValue === '' || !has_data || loading"
                :type="percentageSort ? 'primary' : 'default'"
                size="mini"
                icon="el-icon-pie-chart"
                @click="percentageSortToggle"/>
            </el-tooltip>
            <el-tooltip
              :content="pageData.hoverInfo.printReport"
              :visible-arrow="true"
              :open-delay="pageData.openDelay"
              effect="dark"
              placement="bottom">
              <el-button
                v-if="!predicted"
                :loading="printing"
                :disabled="printing || loading || !has_data || loading"
                icon="el-icon-printer"
                size="mini"
                @click="print" />
            </el-tooltip>
          </el-button-group>
        </el-col>
        <el-col
          v-if="report || reportArea"
          :sm="4"
          :xl="4">
          <el-tooltip
            :content="pageData.hoverInfo.maxPercentageCloudCover"
            :visible-arrow="true"
            :open-delay="pageData.openDelay"
            effect="dark"
            placement="bottom">
            <el-input-number
              v-model="maxCloudCoverPercentage"
              :step="10"
              :min="0"
              :max="100"
              :disabled="!has_data || loading"
              size="mini"
              placeholder="%"/>
          </el-tooltip>
        </el-col>
        <el-col
          :sm="6"
          :xl="predicted ? 4 : 5">
          <el-tooltip
            :content="pageData.hoverInfo.itemsPerPage"
            :visible-arrow="true"
            :open-delay="pageData.openDelay"
            effect="dark"
            placement="bottom">
            <el-radio-group
              v-model="radio"
              :disabled="disableWhenHaveOnlyOneArea || !has_data || total <= radio || loading"
              size="mini">
              <el-radio-button label="12" />
              <el-radio-button label="24" />
              <el-radio-button label="36" />
            </el-radio-group>
          </el-tooltip>
        </el-col>
        <el-col>
          <el-pagination
            v-if="has_data && total"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
            style="float: right"
            layout="prev, pager, next"
            @current-change="selectPage" />
        </el-col>
      </el-row>
      <el-divider />
      <el-row
        v-loading="loading"
        v-if="has_data"
        class="header-chart">
        <line-chart
          v-if="showTrend && !reportArea"
          :labels="labels"
          :datasets="datasets"/>
        <line-chart
          v-else-if="reportArea"
          :labels="chartMonths"
          :datasets="chartData"
          :report-type="reportArea"/>
        <horizontal-bar-chart
          v-if="!showTrend && !loading"
          :labels="labels"
          :datasets="datasets"
          :stacked="predicted || predictedArea"
          :by-class="horizontalBarByclass"/>
      </el-row>
      <el-row
        v-if="has_data && !loading"
        class="aoi-item-list">
        <aoi-item
          v-for="entry in rows"
          ref="aois"
          :key="entry.key"
          :agg="entry"
          :formula="selectedFormula"
          :trend="showTrend"
          :predicted-layer="selectedPredictedLayer"
          @printed="printCallback" />
      </el-row>
      <div
        v-loading="loading"
        v-if="!has_data">
        <h2 v-if="loading">Loading</h2>
        <h2 v-else>No Data</h2>
      </div>
    </el-col>
    <el-tooltip
      :content="pageData.hoverInfo.closeReport"
      :visible-arrow="true"
      :open-delay="pageData.openDelay"
      effect="dark"
      placement="bottom">
      <el-button
        icon="el-icon-close"
        class="report-close"
        @click="closeReport"/>
    </el-tooltip>
  </el-row>
</template>

<script>
import 'element-ui/lib/theme-chalk/table.css'
import 'element-ui/lib/theme-chalk/form.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/col.css'
import 'element-ui/lib/theme-chalk/row.css'
import 'element-ui/lib/theme-chalk/date-picker.css'
import 'element-ui/lib/theme-chalk/time-picker.css'
import 'element-ui/lib/theme-chalk/pagination.css'
import 'element-ui/lib/theme-chalk/divider.css'
import 'element-ui/lib/theme-chalk/radio.css'
import 'element-ui/lib/theme-chalk/radio-button.css'
import 'element-ui/lib/theme-chalk/radio-group.css'
import 'element-ui/lib/theme-chalk/loading.css'
import 'element-ui/lib/theme-chalk/input-number.css'
import 'element-ui/lib/theme-chalk/switch.css'

import moment from 'moment'
import html2canvas from 'html2canvas'
import 'es6-promise/auto'
import jsPDF from 'jspdf'

import { mapState, mapActions } from 'vuex'
import { actionTypes, routeTypes } from '@/services/constants'
import HorizontalBarChart from '@/components/charts/bar-chart/bar-chart'
import LineChart from '@/components/charts/line-chart/line-chart'
import AoiItem from './components/aoi-item/aoi-item'
import _ from 'lodash'
import { OpenSans } from '@/assets/fonts/OpenSans-Light-normal.js'
import { Tooltip } from 'element-ui'
import months from '@/utils/months'
import chartColors from '@/utils/chart-colors'
import errorHandler from '@/utils/errorHandler'
import * as Sentry from "@sentry/vue"

export default {
  name: 'Report',
  components: {
    HorizontalBarChart,
    LineChart,
    AoiItem,
    Tooltip,
  },
  data () {
    return {
      search: '',
      monthrange: '',
      maxCloudCoverPercentage: 80,
      radio: 12,
      currentPage: 1,
      classSortValue: '',
      layerFilterValue: '',
      currentSort: '',
      ascDesc: false,
      percentageSort: false,
      isFirstCall: true,
      header: {
        name: '',
        description: '',
      },
      pageData: {
        placeHolders: {
          sortByclass: 'Sort by Class',
          startMonth: 'Start Month',
          endMonth: 'End Month',
          search: 'Search',
        },
        hoverInfo: {
          sortAscending: 'Sort Ascending',
          sortDescending: 'Sort Descending',
          sortByAbsoluteValue: 'Sort by Absolute Value',
          sortByPercentage: 'Sort by Percentage',
          printReport: 'Print Report',
          maxPercentageCloudCover: 'Max. Percentage Cloud Cover',
          itemsPerPage: 'Items per Page',
          sortByName: 'Sort by Name',
          sortByAverage: 'Sort by Average',
          sortByDate: 'Sort by Date',
          closeReport: 'Close Report',
          selectFormula: 'Select Formula',
        },
        openDelay: 750,
      },
      pickerOptions: {
        shortcuts: [{
          text: 'This month',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()])
          }
        }, {
          text: 'This year',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: 'Last 6 months',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 6)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      loading: true,
      selectLoading: true,
      printing: false,
      horizontalBarByclass: false,
      months: months,
      chartData: [],
      chartColors: {
        colors: chartColors,
        defaultColor: 'red'
      },
      updateReportAreaChart: false,
      disableWhenHaveOnlyOneArea: false,
      prevClassSortValue: '',
      diferentClassSortValue: false,
    }
  },
  computed: {
    ...mapState({
      selectedFormula: state => state.formula.selectedFormula,
      selectedFormulaRow: state => state.formula.row,
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      formulaReport: state => state.formulaReport.rows,
      predictedLayer: state => state.predictedLayer,
      selectedPredictedLayerRow: state => state.predictedLayer.row,
      selectedPredictedLayer: state => state.predictedLayer.selectedLayer,
      total: state => state.formulaReport.total,
      next: state => state.formulaReport.next,
      previous: state => state.formulaReport.previous,
      formulaRows: state => state.formula.rows,
      reportChartData: state => state.formulaReport.chartData,
      reportChartYears: state => state.formulaReport.chartYears,
      selectedMomentId: state => state.time.selectedMomentId,
      rgbMiniMap: state => state.formula.rgbMiniMap,
    }),
    chartMonths() {
      return this.months.map(item => item.completed)
    },
    selectformulaRows(){
      return this.formulaRows.filter(item => item.acronym != "RGB")
    },
    has_data(){
      const report_items_loaded = Boolean(this.formulaReport.length)
      if(this.predicted || this.predictedArea) {
        return report_items_loaded && Boolean(this.selectedPredictedLayer)
      } else {
        return report_items_loaded
      }
    },
    sorts(){
      const name = {name: 'Name', query: 'aggregationarea__name', hoverContent: this.pageData.hoverInfo.sortByName}
      const avg = {name: 'Average', query: 'stats_avg', hoverContent: this.pageData.hoverInfo.sortByAverage}
      const date = {name: 'Date', query: 'min_date', hoverContent: this.pageData.hoverInfo.sortByDate}

      if (this.predicted || this.predictedArea) {
        return [name]
      } else if (this.reportArea) {
        return [avg, date]
      } else {
        return [name, avg, date]
      }
    },
    rows(){
      return this.formulaReport.filter(dat => !isNaN(parseFloat(dat.avg)))
    },
    labels() {
      // Generate labels for bar and line graph
      if (this.has_data) {
        // When predicted (Predicted Report) and have more than 1 info block
        if (this.predicted && this.rows.length > 1 ) {
          return this.rows.map(reportItem => reportItem.name)
        // When have more than 1 info block and isn't report area
        } else if (this.showTrend && !this.reportArea){
          return this.rows.map(reportItem => `${moment(reportItem.min_date).format('YYYY-MM')}`)
        // When is predicted area (Predicted Area Report) or just have 1 info block
        } else if (this.predictedArea || this.rows.length === 1) {
          return this.selectedPredictedLayerRow.legend.map(entry => entry.name)
        } else {
          return this.rows.map(reportItem => `${reportItem.name} ${reportItem.min_date ? `| ${moment(reportItem.min_date).format('MMMM YYYY')}` : ''}`)
        }
      }
    },
    showTrend() {
      // Show trend if the area is unique and has at least two observations.
      if (this.has_data) {
        let unique = [...new Set(this.rows.map(item => item.aggregationarea))]
        return unique.length == 1 && this.rows.length > 1
      }
    },
    trendAreaName() {
      if (this.showTrend) {
        return this.rows[0].name
      }
    },
    datasets() {
      // Generate data for bar and line graph
      if (this.has_data) {
        if (this.predicted && this.rows.length > 1 ) {
          this.setHorizontalBarByClass(this.rows.length)
          // Create data for horizontal chart bar by area
          return this.selectedPredictedLayerRow.legend.map((entry) => {
            const data = this.rows.map(agg => entry['expression'] in agg.value ? agg.value[entry['expression']] : 0)
            return {
              data: data,
              label: entry['name'],
              backgroundColor: entry['color'],
              borderColor: entry['color'],
              fill: false,
              spanGaps: true,
            }
          })
        } else if (this.showTrend && !this.reportArea) {
          return [
            {
              data: this.rows.map(reportItem => reportItem.avg),
              label: 'Average',
              backgroundColor: '#aac343',
              borderColor: '#aac343',
              fill: false,
              spanGaps: true,
            }
          ]
        } else if (this.predictedArea || this.rows.length === 1) {
          this.setHorizontalBarByClass(this.rows.length)
          // Create data for horizontal chart bar by class
          return this.selectedPredictedLayerRow.legend.map((entry, idx, arr) => {
            const data = []
            this.rows.map(agg => {
              arr.forEach((val, arrIdx) => {
                idx === arrIdx ? data.push(entry['expression'] in agg.value ? Math.round(agg.value[entry['expression']]) : 0) : data.push(0)
              })
            })
            return {
              data: data,
              label: entry['name'],
              backgroundColor: entry['color'],
              borderColor: entry['color'],
              fill: false,
              spanGaps: true,
            }
          })
        } else {
          return [
            {
              data: this.rows.map(reportItem => reportItem.avg.toFixed(5)),
              label: 'Average',
              backgroundColor: '#aac343',
              fill: false,
            }
          ]
        }
      }
    },
    sortBy(){
      let query
      if (this.classSortValue) {
        const query_base = this.percentageSort ? 'value_percentage' : 'value'
        query = `${this.ascDesc ? '-' : ''}${query_base}__${this.classSortValue}`
      } else {
        // Get sort item and query string.
        const item = this.sorts.filter(item => item.name == this.currentSort)[0]
        query = `${this.ascDesc ? '-' : ''}${item.query}`
        // Add date sorting as default to name sorting.
        if (item.name == 'Name') {
          query += ',min_date'
        }
      }
      return query
    },
    // Function to get id formula selected to query
    selectedFormulaValue() {
      return this.layerFilterValue ? {id: this.layerFilterValue} : (this.selectedFormula ? {id: this.selectedFormula.id} : {id: ''})
    },
    pageSize(){
      return parseInt(this.radio)
    },
    predicted(){
      return this.$route.name == routeTypes.REPORT_PREDICTED
    },
    predictedArea(){
      return this.$route.name == routeTypes.REPORT_PREDICTED_AREA
    },
    report(){
      return this.$route.name == routeTypes.REPORT
    },
    reportArea(){
      return this.$route.name == routeTypes.REPORT_AREA
    },
    // Define name in header when predicted area
    definePredictedAreaName(){
      return this.formulaReport.length > 0 ? `| ${this.formulaReport[0].name}` : '';
    },
  },
  watch: {
    monthrange(){
      this.query()
    },
    search(){
      this.query()
    },
    pageSize(){
      this.query()
    },
    maxCloudCoverPercentage() {
      this.updateReportAreaChart = true
      this.query()
    },
    currentSort() {
      if (!this.isFirstCall) {
        this.query()
      }
    },
    classSortValue() {
      this.query()
    },
    ascDesc() {
      this.query()
    },
    percentageSort() {
      this.query()
    },
    layerFilterValue(){
      if (!this.isFirstCall) {
        this.updateReportAreaChart = true
        this.query()
      }
    }
  },
  mounted: function(){
    // Set up aggregation data query parameters.
    var query = {
      layer: {id: this.$route.params.layer},
      page: this.currentPage,
      pageSize: this.pageSize,
      aggregationArea: this.$route.params.area,
      minPercentageCovered: this.maxCloudCoverPercentage < 100 ? (100 - this.maxCloudCoverPercentage) / 100 : ''
    }
    if(this.predicted || this.predictedArea) {
      query.predictedLayer = {id: this.$route.params.predictedLayer}
      if ((this.$route.query.selectedMomentId != this.selectedMomentId && _.isUndefined(this.$route.query.selectedMomentId)) || 
         (this.$route.query.rgbMiniMapId != this.rgbMiniMap.id && _.isUndefined(this.$route.query.rgbMiniMapId))) {
        this.$router.replace({
          query: {
            selectedMomentId: this.selectedMomentId || this.$route.query.selectedMomentId,
            rgbMiniMapId: this.rgbMiniMap.id || this.$route.query.rgbMiniMapId,
        }}).catch(errorHandler.routerError)
      }
    } else {
      query.formula = this.selectedFormula ? {id: this.selectedFormula.id} : {id: this.$route.params.formula}
    }

    // Initialize current sort radio group button
    this.currentSort = this.reportArea ? 'Date' : 'Name'

    // Get available formulas list to create dropdown to search by formula
    if(!this.predicted && !this.predictedArea) {
      this.getFormulasAction({pageSize: 50})
      .then(() => {
        this.selectLoading = false
        this.fillSelect()
      })
    }

    // Get aggregation data.
    this.getFormulaReport(query)
    .then(() => {
      this.defineSelectedFormula()
      this.loading = false
      this.isFirstCall = false
    })
    .catch(() => {
      this.loading = false
      this.isFirstCall = false
    })

    // Call to create report area graph with time series by year of the area
    if (this.reportArea) {
      query.pageSize = 100;
      this.getFormulaReportChartData(query)
      .then(() => {
        this.createReportAreaReport()
      })
    }

    // Get the layer data.
    if(this.predicted || this.predictedArea) {
      if (!this.selectedPredictedLayer){
        this.getPredictedLayersIDAction(this.$route.params.predictedLayer)
        .then(() => {
          this.selectPredictedLayer(this.selectedPredictedLayerRow)
        })
      }
    } else {
      if (!this.selectedFormula){
        this.getFormulaIDAction(this.$route.params.formula)
        .then(() => {
          this.selectFormula(this.selectedFormulaRow)
        })
      }
    }

    if (!this.selectedLayer){
      this.getAggregationLayerIDAction(this.$route.params.layer)
    }
  },
  methods: {
    ...mapActions('formulaReport', {
      getFormulaReport: actionTypes.FORMULA_REPORT_GET,
      getFormulaReportChartData: actionTypes.FORMULA_REPORT_CHART_GET,
    }),
    ...mapActions('aggregationLayer', {
      getAggregationLayerIDAction: actionTypes.AGGREGATION_LAYER_GET_ID,
      selectAggregationLayer: actionTypes.AGGREGATION_LAYER_SELECT,
    }),
    ...mapActions('formula', {
      getFormulasAction: actionTypes.FORMULA_GET,
      getFormulaIDAction: actionTypes.FORMULA_GET_ID,
      selectFormula: actionTypes.FORMULA_SELECT,
    }),
    ...mapActions('predictedLayer', {
      getPredictedLayersIDAction: actionTypes.PREDICTED_LAYER_GET_ID,
      selectPredictedLayer: actionTypes.PREDICTED_LAYER_SELECT,
    }),
    query: _.debounce(
      function () {
        this.loading = true
        const that = this
        const query = {
          layer: {id: this.selectedLayer.id},
          aggregationArea: this.$route.params.area,
          formula: !this.predicted && !this.predictedArea ? this.selectedFormulaValue : '',
          moment: '',
          predictedLayer: this.selectedPredictedLayer ? {id: this.selectedPredictedLayer.id} : '',
          ordering: this.sortBy,
          search: this.search,
          dateAfter: this.monthrange ? moment(this.monthrange[0]).format('YYYY-MM-DD') : '',
          dateBefore: this.monthrange ? moment(this.monthrange[1]).endOf('month').format('YYYY-MM-DD') : '',
          page: this.definePageForQuery(),
          pageSize: this.pageSize,
          minPercentageCovered: this.maxCloudCoverPercentage < 100 ? (100 - this.maxCloudCoverPercentage) / 100 : '',
        }
        // Call to update report data
        this.getFormulaReport(query)
        .then(() => {
          that.defineSelectedFormula()
          that.loading = false
        })
        .catch(() => {
          that.loading = false
        })

        // Call to update report area graph with time series by year of the area
        // Validates if is report area and if formula in report was changed
        if (this.reportArea && this.updateReportAreaChart) {
          query.page = 1
          query.pageSize = 100

          this.getFormulaReportChartData(query)
          .then(() => {
            this.createReportAreaReport()
            this.updateReportAreaChart = false
          })
        }
      },
      800
    ),
    closeReport() {
      this.$router.push({
          name: routeTypes.HOME,
        }).catch(errorHandler.routerError)
    },
    // This allows to decide which page we request in a wacth event change
    definePageForQuery(){
      if(this.report || this.reportArea) {
        // Validates if the selected formula is the same as the new one
        if (this.selectedFormula.id !== this.selectedFormulaValue.id) {
          this.currentPage = 1
        }
      } else {
        // In predicted report, validates if previous class is different than new one
        // In predicted area report will be always first page
        this.diferentClassSortValue = this.prevClassSortValue !== this.classSortValue
        // Assigns new class value
        this.prevClassSortValue = this.classSortValue

        if (this.diferentClassSortValue) {
          this.currentPage = 1
        }
      }

      return this.currentPage
    },
    // Update selected formula (ex: NDVI, SLIM, etc) when changed in dropdown select. This allow map legend update in mini-maps
    defineSelectedFormula() {
      const formulaInfo = this.formulaRows.filter(item => {
        return item.id == this.layerFilterValue
      })[0]

      this.selectFormula(formulaInfo || this.selectedFormula)
    },
    // Create time series data by year for chart when in report area
    createReportAreaReport() {
      // Map for available years in specific area
      this.chartData = this.reportChartYears.map((year, idx) => {
        const that = this
        const color = _.get(this.chartColors.colors, idx, this.chartColors.defaultColor)
        // If default color is used means that color array hasn't enough colors and this warns sentry
        if (color === 'red') Sentry.captureMessage('We used all provisioned colors for area report chart');
        return {
          label: `${year} - Average`,
          // Go throught all year months
          data: this.months.map((month) => {
                  // Go throught all available area data and verify for each month and year if has average value
                  const area = that.reportChartData.find(entry => entry.month === month['completed'] && entry.year === year)
                  return area ? area.avg : null
                }),
          backgroundColor: color,
          borderColor: color,
          fill: false,
          spanGaps: true,
          pointRadius: 4,
        }
      })
    },
    // Define if is horizontal chart bar by class or by area
    setHorizontalBarByClass(size){
      if (size === 1) {
        this.horizontalBarByclass = true
        this.disableWhenHaveOnlyOneArea = true
      } else {
        this.horizontalBarByclass = false
        this.disableWhenHaveOnlyOneArea = false
      }
    },
    // Fill dropdown select with choosed formula in map
    fillSelect () {
      this.layerFilterValue = this.selectedFormula ? this.selectedFormula.id : parseInt(this.$route.params.formula)
    },
    selectPage(page){
      this.currentPage = page
      this.query()
    },
    ascDescToggle() {
      this.ascDesc = !this.ascDesc
    },
    percentageSortToggle() {
      this.percentageSort = !this.percentageSort
    },
    print() {
      this.printing = true
      html2canvas(document.querySelector(".header-chart")).then(chartCanvas => {
        // Set chart canvas.
        this.chartCanvas = chartCanvas
        // Trigger map canvas retrieval, this will trigger "print" events from
        // each map item.
        this.$refs.aois.forEach(aoi => aoi.getCanvas())
      });
    },
    printCallback(){
      const done = this.$refs.aois.filter(aoi => Boolean(aoi.canvasData))
      if (done.length == this.$refs.aois.length && this.printing) {
        // Config variables.
        const format = 'PNG'
        const pdf_margin = 10
        const font_size = 20
        const font_size_sm = 15
        const font_size_lg = 25

        // Compute pdf width and height.
        const HEADER = font_size_lg + 3 * pdf_margin
        const height = HEADER + this.$refs.aois[0].canvasData.map.height
        const width = this.chartCanvas.width + 2 * pdf_margin

        // Create pdf object.
        var doc = jsPDF({
          orientation: width > height ? 'landscape': 'portrait',
          unit: 'pt',
          format: [width, height],
        });

        // Font settings.
        doc.addFileToVFS('Open-Sans.ttf', OpenSans)
        doc.addFont('Open-Sans.ttf', 'OpenSans', 'normal')
        doc.setFont('OpenSans', 'normal')
        doc.setTextColor('#001A31')  // Navy

        // Add title.
        const headA = `${this.selectedLayer.name} | ${this.header.name}`
        doc.setFontSize(font_size)
        const headAwidth = doc.getTextWidth(headA)
        const spaceWidth = doc.getTextWidth(' ')
        const headB = `${this.header.description}`
        doc.text(
          headA,
          pdf_margin,
          pdf_margin + font_size
        )
        doc.setFontSize(font_size_sm)
        doc.text(
          headB,
          pdf_margin + spaceWidth + headAwidth,
          pdf_margin + font_size
        )
        doc.setFontSize(font_size)

        // Add chart.
        const chart_ratio = this.chartCanvas.width / this.chartCanvas.height
        const chart_height = Math.min(height - font_size - 2 * pdf_margin, this.chartCanvas.height)
        const chart_width = chart_height * chart_ratio
        doc.addImage(
          this.chartCanvas.toDataURL(),
          format,
          pdf_margin,
          2 * pdf_margin + font_size,
          chart_width,
          chart_height
        )

        // Add aoi pages.
        this.$refs.aois.forEach((aoi) => {
          doc.addPage()
          // Adding aoi header and numbers.
          const headC = `${aoi.canvasData.name}`
          doc.setFontSize(font_size)
          doc.text(
            headC,
            pdf_margin,
            pdf_margin + font_size
          )
          const headC1 = `${aoi.canvasData.date}`
          const headC1widht = doc.getTextWidth(headC1)
          doc.text(
            headC1,
            width - pdf_margin - headC1widht,
            pdf_margin + font_size
          )

          const headD = `${aoi.canvasData.avg}`
          doc.setFontSize(font_size_lg)
          doc.text(
            headD,
            pdf_margin,
            4 * pdf_margin + 2 * font_size
          )

          const headE = `± ${aoi.canvasData.std}`
          const headDwidth = doc.getTextWidth(headD)
          const spaceWidthLg = doc.getTextWidth(' ')
          doc.setFontSize(font_size)
          doc.text(
            headE,
            pdf_margin + headDwidth + spaceWidthLg,
            4 * pdf_margin + 2 * font_size
          )

          const headF = `DataRange\n${aoi.canvasData.min} to ${aoi.canvasData.max}`
          doc.setFontSize(font_size_sm)
          doc.text(
            headF,
            pdf_margin,
            5 * pdf_margin + 3 * font_size
          )

          // Add captured map image.
          doc.addImage(
            aoi.canvasData.map.toDataURL(),
            format,
            width - aoi.canvasData.map.width - pdf_margin,
            2 * pdf_margin + font_size,
            aoi.canvasData.map.width,
            aoi.canvasData.map.height,
          )
          // Add captured legend.
          doc.addImage(
            aoi.canvasData.legend.toDataURL(),
            format,
            width - 2 * pdf_margin - aoi.canvasData.legend.width,
            height - 2 * pdf_margin - aoi.canvasData.legend.height,
            aoi.canvasData.legend.width,
            aoi.canvasData.legend.height,
          )
        })
        doc.save('tesselo_export.pdf')
        this.printing = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.report-container {
  padding-top: 30px;
  height: inherit;

  .report-close {
    font-size: 33px;
    color: rgba(0,0,0,0.2);
    float: right;
    margin-top: -35px;
    border: 0px solid;
    padding: 0px;
    margin: -22px 20px 0px 0;

    &:hover{
      background-color: #ffffff;
      border-color: #ffffff;
    }

    &:focus{
      background-color: #ffffff;
      border-color: #ffffff;
    }

    .el-icon-close{
      font-weight: 700;
    }
  }
}
.header-row{
  overflow-wrap: break-word;
}
.formula-name-header {
  font-size: 14px;
}
.aoi-item-list {
  &:last-child {
    margin-bottom: 20px;
  }
}
.class-sort-label {
  padding-left: 10px;
}
.class-sort-marker {
  width: 30px;
  margin-top: 7px;
  height: 20px;
  border-radius: 5px;
  float: left;
}
.el-input-number {
  width: 94px;
}
.el-col.el-col-24 {
  padding-bottom: 10px;
}
</style>