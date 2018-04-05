<template>
  <div class="areas-panel d-flex flex-column align-items-center justify-content-end">
    <el-table
      class="areas-table"
      v-if="!loading"
      :data="rows"
      max-height="500"
      @current-change="selectArea"
      size="small"
      :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="Name"
        width="300" />
      <el-table-column
        prop="nrOfAreas"
        label="Zones" />
    </el-table>
    <div
      v-if="loading"
      class="spinner-wrapper">
      <div class="spinner twilight" />
    </div>
    <el-pagination
      v-if="total"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="prev, pager, next"
      @current-change="selectPage" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { actionTypes } from '@/services/constants'

import 'element-ui/lib/theme-chalk/table.css'
import 'element-ui/lib/theme-chalk/table-column.css'
import 'element-ui/lib/theme-chalk/pagination.css'
import 'element-ui/lib/theme-chalk/icon.css'

import {
  Table as ElTable,
  TableColumn as ElTableColumn,
  Pagination as ElPagination
} from 'element-ui'

export default {
  name: 'AreasTable',
  components: {
    ElTable,
    ElTableColumn,
    ElPagination
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState({
      total: state => state.aggregationLayer.total,
      pageSize: state => state.aggregationLayer.pageSize,
      rows: state => state.aggregationLayer.rows,
      next: state => state.aggregationLayer.next,
      previous: state => state.aggregationLayer.previous,
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      currentPage: state => state.aggregationLayer.currentPage
    })
  },
  beforeMount() {
    if (this.rows.length === 0 ){
      this.getAggregationLayers({page: this.currentPage})
    }
  },
  methods: {
    ...mapActions('aggregationLayer', {
      getAggregationLayersAction: actionTypes.AGGREGATION_LAYER_GET,
      selectAggregationLayer: actionTypes.AGGREGATION_LAYER_SELECT
    }),
    ...mapActions('map', {
      setMapBounds: actionTypes.MAP_SET_BOUNDS
    }),
    getAggregationLayers(options) {
      this.loading = true
      this.getAggregationLayersAction(options)
        .then(() => {
          this.loading = false
        })
    },
    selectArea(area) {
      this.selectAggregationLayer(area)
      this.setMapBounds(area.bounds)
      this.$emit('select', area)
    },
    selectPage(page) {
      this.getAggregationLayers({ page })
    },
    tableRowClassName(data) {
      if (this.selectedLayer && data.row.id == this.selectedLayer.id) {
        return 'selected'
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .areas-panel {
    position: relative;
    min-height: 400px;
    max-height: 100%;
    max-width: 100%;
  }

  .areas-table {
    margin: 20px 0 20px;
    overflow: auto;
  }

  .spinner-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateY(-30px);

    width: 30px;
    height: 30px;
  }
</style>
