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
          :sm="12"
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
          :sm="12"
          class="header-row">
          <el-date-picker
            v-model="monthrange"
            type="monthrange"
            start-placeholder="Start month"
            end-placeholder="End month" />
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :sm="10"
          class="header-row">
          <el-button-group>
            <el-button
              v-for="item in sorts"
              :key="item.name"
              :label="item.name"
              :type="item.selected ? 'primary' : 'default'"
              size="mini"
              @click="sort(item)">
              {{ item.name }}
              <i
                v-if="item.descending"
                class="el-icon-arrow-down"/>
              <i
                v-else
                class="el-icon-arrow-up"/>
            </el-button>
          </el-button-group>
          <el-button
            :loading="printing"
            :disabled="printing"
            class="export-button"
            icon="el-icon-printer"
            size="mini"
            @click="print" />
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
        <el-col
          v-if="has_data"
          :sm="8">
          <el-pagination
            v-if="total"
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
          :datasets="datasets" />
        <bar-chart
          v-else
          :labels="labels"
          :datasets="datasets" />
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

import moment from 'moment'
import html2canvas from 'html2canvas'
import 'es6-promise/auto'
import jsPDF from 'jspdf'

import { mapState, mapActions } from 'vuex'
import { actionTypes } from '@/services/constants'
import BarChart from '@/components/bar-chart/bar-chart'
import LineChart from '@/components/line-chart/line-chart'
import AoiItem from './components/aoi-item/aoi-item'
import { debounce } from 'lodash'


export default {
  name: 'Report',
  components: {
    BarChart,
    LineChart,
    AoiItem
  },
  data () {
    return {
      search: '',
      monthrange: '',
      radio: 12,
      currentPage: 1,
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
      sorts: [
        {name: 'Name', descending: true, query: 'aggregationarea__name', selected: true},
        {name: 'Average', descending: true, query: 'valuecountresult__stats_avg', selected: false},
        {name: 'Date', descending: true, query: 'composite__min_date', selected: false},
      ],
      loading: true,
      printing: false,
      chartCanvas: null,
      headerCanvas: null
    }
  },
  computed: {
    ...mapState({
      selectedFormula: state => state.formula.selectedFormula,
      selectedFormulaRow: state => state.formula.row,
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      formulaReport: state => state.formulaReport.rows,
      total: state => state.formulaReport.total,
      original_rows: state => state.formulaReport.rows,
      next: state => state.formulaReport.next,
      previous: state => state.formulaReport.previous,
      has_data: state => Boolean(state.formulaReport.rows.length)
    }),
    rows(){
      return this.original_rows.filter(dat => !isNaN(parseFloat(dat.avg)))
    },
    labels() {
      if (this.has_data) {
        if (this.showTrend){
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
        if (this.showTrend) {
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
      // Get sort item and query string.
      const item = this.sorts.filter(item => item.selected)[0]
      var query = item.query
      // Invert sort direction if requested.
      if (!item.descending){
        query = '-' + item.query
      }
      // Add date sorting as default to name sorting.
      if (item.name == 'Name') {
        query += ',composite__min_date'
      }
      return query
    },
    pageSize(){
      return parseInt(this.radio)
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
    }
  },
  mounted: function(){
    // Get aggregation data.
    this.getFormulaReport({
      layer: {id: this.$route.params.layer},
      formula: {id: this.$route.params.formula},
      page: this.currentPage,
      pageSize: this.pageSize
    })
    .then(() => {
      this.loading = false
    })
    .catch(() => {
      this.loading = false
    })
    // Get meta info for the
    if (!this.selectedLayer){
      this.getAggregationLayerIDAction(this.$route.params.layer)
    }
    if (!this.selectedFormula){
      this.getFormulaIDAction(this.$route.params.formula)
      .then(() => {
        this.selectFormula(this.selectedFormulaRow)
      })
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
    query: debounce(
      function () {
        this.loading = true
        const tat = this
        this.getFormulaReport({
          layer: {id: this.selectedLayer.id},
          formula: {id: this.selectedFormula.id},
          moment: '',
          ordering: this.sortBy,
          search: this.search,
          date_after: this.monthrange ? moment(this.monthrange[0]).format('YYYY-MM-DD') : '',
          date_before: this.monthrange ? moment(this.monthrange[1]).endOf('month').format('YYYY-MM-DD') : '',
          page: this.currentPage,
          pageSize: this.pageSize
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
    sort(item){
      // Unselect the button siblings.
      this.sorts = this.sorts.map((dat) => {
        if (dat.name != item.name) {
          dat.selected = false
        }
        return dat
      })
      // Change order direction if item is already selected.
      if (item.selected) {
        item.descending = !item.descending
      } else {
        item.selected = true
      }
      this.query()
    },
    print() {
      this.printing = true
      html2canvas(document.querySelector(".header-chart")).then(chartCanvas => {
        // Set chart canvas.
        this.chartCanvas = chartCanvas
        html2canvas(document.querySelector(".header-row")).then(headerCanvas => {
          // Set header canvas.
          this.headerCanvas = headerCanvas
          // Trigger map canvas retrieval, this will trigger "print" events from
          // each map item.
          this.$refs.aois.forEach(aoi => aoi.getCanvas())
        })
      });
    },
    printCallback(){
      const done = this.$refs.aois.filter(aoi => Boolean(aoi.canvasData))
      if (done.length == this.$refs.aois.length) {
        // Config variables.
        const format = 'PNG'
        const pdf_margin = 10

        // Compute pdf height.
        const height = Math.max(
          this.headerCanvas.height + this.chartCanvas.height,
          this.$refs.aois[0].canvasData.header.height + this.$refs.aois[0].canvasData.map.height
        )

        // Create pdf object.
        var doc = jsPDF({
          orientation: this.headerCanvas.width > this.headerCanvas.height ? 'landscape': 'portrait',
          unit: 'pt',
          format: [this.chartCanvas.width, height],
        });

        // Add title.
        doc.addImage(this.headerCanvas.toDataURL(), format, pdf_margin, pdf_margin)

        // Add chart.
        doc.addImage(this.chartCanvas.toDataURL(), format, pdf_margin, pdf_margin + this.headerCanvas.height)

        this.$refs.aois.forEach((aoi) => {
          doc.addPage()
          // Adding aoi header and numbers.
          doc.addImage(aoi.canvasData.header.toDataURL(), format, pdf_margin, pdf_margin)
          doc.addImage(aoi.canvasData.table.toDataURL(), format, pdf_margin, pdf_margin + aoi.canvasData.header.height)
          // Add captured map image.
          doc.addImage(aoi.canvasData.map.toDataURL(), format, pdf_margin + aoi.canvasData.table.width, pdf_margin + aoi.canvasData.header.height)
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
</style>
