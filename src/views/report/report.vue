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
            <span v-if="showTrend && rows">| {{ trendAreaName }}</span>
            <span v-if="selectedFormula">| {{ selectedFormula.acronym }}</span>
            <span v-if="selectedPredictedLayer">| {{ selectedPredictedLayer.nameToShow }}</span>
            <span
              v-if="selectedFormula"
              class="formula-name-header">
              {{ selectedFormula.name }}
            </span>
          </h2>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col
          :sm="13"
          class="header-row">
          <el-input
            v-model="search"
            placeholder="Search"
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
            type="monthrange"
            start-placeholder="Start month"
            end-placeholder="End month" />
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :sm="discrete ? 5: 8">
          <el-radio-group
            v-model="currentSort"
            size="mini">
            <el-radio-button
              v-for="item in sorts"
              :key="item.name"
              :label="item.name"/>
          </el-radio-group>
        </el-col>
        <el-col
          v-if="discrete"
          :sm="4">
          <el-select
            v-if="selectedPredictedLayer"
            v-model="classSortValue"
            placeholder="Sort by class"
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
        <el-col :sm="5">
          <el-button-group>
            <el-button
              type="default"
              size="mini"
              @click="ascDescToggle">
              <i
                v-if="ascDesc"
                class="el-icon-arrow-up"/>
              <i
                v-else
                class="el-icon-arrow-down"/>
            </el-button>
            <el-button
              v-if="discrete"
              :type="percentageSort ? 'primary' : 'default'"
              size="mini"
              @click="percentageSortToggle">
              %
            </el-button>
            <el-button
              :loading="printing"
              :disabled="printing || loading"
              class="export-button"
              icon="el-icon-printer"
              size="mini"
              @click="print" />
          </el-button-group>
        </el-col>
        <el-col :sm="4">
          <el-input-number
            v-model="minPercentageCovered"
            :step="10"
            size="mini"
            placeholder="%"/>
        </el-col>
        <el-col :sm="6">
          <el-radio-group
            v-model="radio"
            size="mini">
            <el-radio-button label="12" />
            <el-radio-button label="24" />
            <el-radio-button label="36" />
          </el-radio-group>
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
          v-if="showTrend"
          :labels="labels"
          :datasets="datasets"/>
        <horizontal-bar-chart
          v-else
          :labels="labels"
          :datasets="datasets"
          :stacked="discrete"/>
      </el-row>
      <el-row
        v-loading="loading"
        v-if="has_data"
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
import { debounce } from 'lodash'
import { OpenSans } from '@/assets/fonts/OpenSans-Light-normal.js'

export default {
  name: 'Report',
  components: {
    HorizontalBarChart,
    LineChart,
    AoiItem
  },
  data () {
    return {
      search: '',
      monthrange: '',
      minPercentageCovered: 0,
      radio: 12,
      currentPage: 1,
      classSortValue: '',
      currentSort: 'Name',
      ascDesc: false,
      percentageSort: false,
      pickerOptions: {
        shortcuts: [{
          text: 'This month',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: 'This year',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: 'Last 6 months',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      loading: true,
      printing: false
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
      original_rows: state => state.formulaReport.rows,
      next: state => state.formulaReport.next,
      previous: state => state.formulaReport.previous,
    }),
    has_data(){
      const report_items_loaded = Boolean(this.formulaReport.length)
      if(this.discrete) {
        return report_items_loaded && Boolean(this.selectedPredictedLayer)
      } else {
        return report_items_loaded
      }
    },
    sorts(){
      const name = {name: 'Name', query: 'aggregationarea__name'}
      const avg = {name: 'Average', query: 'stats_avg'}
      const date = {name: 'Date', query: 'min_date'}
      if (this.discrete) {
        return [name, date]
      } else {
        return [name, avg, date]
      }
    },
    rows(){
      return this.original_rows.filter(dat => !isNaN(parseFloat(dat.avg)))
    },
    labels() {
      if (this.has_data) {
        if (this.discrete) {
          return this.rows.map(reportItem => reportItem.name)
        } else if (this.showTrend){
          return this.rows.map(reportItem => `${moment(reportItem.min_date).format('YYYY-MM')}`)
        } else {
          return this.rows.map(reportItem => `${reportItem.name} | ${moment(reportItem.min_date).format('MMMM YYYY')}`)
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
      if (this.has_data) {
        if (this.discrete) {
          return this.selectedPredictedLayerRow.legend.map((entry) => {
            const data = this.rows.map(agg => {
              return entry['expression'] in agg.value ? agg.value[entry['expression']] : 0
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
        } else if (this.showTrend) {
          return [
            {
              data: this.rows.map(reportItem => reportItem.avg),
              label: 'Average',
              backgroundColor: '#aac343',
              borderColor: '#aac343',
              fill: false,
              spanGaps: true
            }
          ]
        } else {
          return [
            {
              data: this.rows.map(reportItem => reportItem.avg.toFixed(5)),
              label: 'Average',
              backgroundColor: '#aac343'
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
      console.log(query)
      return query
    },
    pageSize(){
      return parseInt(this.radio)
    },
    discrete(){
      return this.$route.name == routeTypes.REPORT_PREDICTED
    }
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
    minPercentageCovered() {
      this.query()
    },
    currentSort() {
      this.query()
    },
    classSortValue() {
      this.query()
    },
    ascDesc() {
      this.query()
    },
    percentageSort() {
      this.query()
    }
  },
  mounted: function(){
    // Set up aggregation data query parameters.
    var query = {
      layer: {id: this.$route.params.layer},
      page: this.currentPage,
      pageSize: this.pageSize,
    }
    if(this.discrete) {
      query.predictedLayer = {id: this.$route.params.predictedLayer}
    } else {
      query.formula = {id: this.$route.params.formula}
    }
    // Get aggregation data.
    this.getFormulaReport(query)
    .then(() => {
      this.loading = false
    })
    .catch(() => {
      this.loading = false
    })
    // Get the layer data.
    if(this.discrete) {
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
    ...mapActions('predictedLayer', {
      getPredictedLayersIDAction: actionTypes.PREDICTED_LAYER_GET_ID,
      selectPredictedLayer: actionTypes.PREDICTED_LAYER_SELECT
    }),
    query: debounce(
      function () {
        this.loading = true
        const tat = this
        this.getFormulaReport({
          layer: {id: this.selectedLayer.id},
          formula: this.selectedFormula ? {id: this.selectedFormula.id} : '',
          moment: '',
          predictedLayer: this.selectedPredictedLayer ? {id: this.selectedPredictedLayer.id} : '',
          ordering: this.sortBy,
          search: this.search,
          dateAfter: this.monthrange ? moment(this.monthrange[0]).format('YYYY-MM-DD') : '',
          dateBefore: this.monthrange ? moment(this.monthrange[1]).endOf('month').format('YYYY-MM-DD') : '',
          page: this.currentPage,
          pageSize: this.pageSize,
          minPercentageCovered: this.minPercentageCovered > 0 ? this.minPercentageCovered / 100 : '',
        })
        .then(() => {
          tat.loading = false
        })
        .catch(() => {
          tat.loading = false
        })
      },
      800
    ),
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
      if (done.length == this.$refs.aois.length) {
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
        doc.setFont('OpenSans')
        doc.setFontType('normal')
        doc.setTextColor('#001A31')  // Navy

        // Add title.
        const headA = `${this.selectedLayer.name} | ${this.selectedFormula.acronym}`
        doc.setFontSize(font_size)
        const headAwidth = doc.getTextWidth(headA)
        const spaceWidth = doc.getTextWidth(' ')
        const headB = `${this.selectedFormula.name}`
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
}
.header-row{
  margin-bottom: 10px;
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
  width: 90px;
}
</style>
