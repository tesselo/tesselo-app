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
          <h2 v-if="selectedLayer">{{ selectedLayer.name }}</h2>
          <h2 v-if="selectedFormula">{{ selectedFormula.name }}</h2>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col
          :sm="14"
          class="header-row">
          <el-input
            v-model="search"
            placeholder="Search"
            clearable
            @keyup.enter="query" >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="query"/>
          </el-input>
        </el-col>
        <el-col
          :sm="10"
          class="header-row">
          <el-date-picker
            v-model="monthrange"
            type="monthrange"
            start-placeholder="Start month"
            end-placeholder="End month" />
        </el-col>
      </el-row>
      <el-row>
        <el-button-group>
          <el-button
            v-for="item in sorts"
            :key="item.name"
            :label="item.name"
            :type="item.selected ? 'primary' : 'default'"
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
      </el-row>
      <el-row v-if="has_data">
        <el-col>
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
      <el-row v-if="has_data">
        <bar-chart
          :labels="labels"
          :datasets="datasets" />
      </el-row>
      <el-row v-if="has_data">
        <aoi-item
          v-for="entry in rows"
          :key="entry.key"
          :agg="entry" />
      </el-row>
      <div v-if="!has_data"><h2>No data</h2></div>
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

import moment from 'moment'

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
      search: '',
      monthrange: '',
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
      ]
    }
  },
  computed: {
    ...mapState({
      selectedFormula: state => state.formula.selectedFormula,
      selectedFormulaRow: state => state.formula.row,
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      selectedLayerRow: state => state.aggregationLayer.row,
      formulaReport: state => state.formulaReport.rows,
      total: state => state.formulaReport.total,
      pageSize: state => state.formulaReport.pageSize,
      rows: state => state.formulaReport.rows,
      next: state => state.formulaReport.next,
      previous: state => state.formulaReport.previous,
      has_data: state => Boolean(state.formulaReport.rows.length)
    }),
    labels() {
      if (this.has_data) {
        return this.rows.map((reportItem) => reportItem.name)
      } else {
        return null
      }
    },
    datasets() {
      if (this.has_data) {
        return [
          {
            data: this.rows.map((reportItem) => reportItem.avg.toFixed(2)),
            label: 'Average',
            backgroundColor: '#aac343'
          }
        ]
      } else {
        return null
      }
    },
    sortBy(){
      var item = this.sorts.filter(item => item.selected)[0]
      if (item.descending){
        return item.query
      } else {
        return '-' + item.query
      }
    }
  },
  watch: {
    monthrange(){
      this.query()
    },
    search(){
      this.query()
    }
  },
  mounted: function(){
    // Get aggregation data.
    this.getFormulaReport({layer: {id: this.$route.params.layer}, formula: {id: this.$route.params.formula}, page: this.currentPage})
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
        this.getFormulaReport({
          layer: {id: this.selectedLayer.id},
          formula: {id: this.selectedFormula.id},
          moment: '',
          ordering: this.sortBy,
          search: this.search,
          date_after: this.monthrange ? moment(this.monthrange[0]).format('YYYY-MM-DD') : '',
          date_before: this.monthrange ? moment(this.monthrange[1]).format('YYYY-MM-DD') : '',
          page: this.currentPage
        })
      },
      1000
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
    }
  }
}
</script>

<style lang="scss" scoped>
.report-container {
  padding-top: 30px;
}
.header-row{
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 10px;
}
</style>
