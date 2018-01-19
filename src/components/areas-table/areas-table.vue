<template>
  <div class="areas-panel d-flex flex-column align-items-center justify-content-end">
    <el-table
      class="areas-table"
      height="600"
      v-if="!loading"
      :data="rows"
      @current-change="selectArea"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="Name"
        width="300" />
      <el-table-column
        prop="nrOfAreas"
        label="Files" />
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
    })
  },
  mounted() {
    this.getAggregationLayers({page: 1})
  },
  methods: {
    ...mapActions('aggregationLayer', {
      getAggregationLayersAction: actionTypes.AGGREGATION_LAYER_GET,
      selectAggregationLayer: actionTypes.AGGREGATION_LAYER_SELECT
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
    },
    selectPage(page) {
      this.getAggregationLayers({ page })
    }
  }
}
</script>

<style scoped lang="scss">
  .areas-panel {
    position: relative;
    min-width: 400px;
    min-height: 400px;
    max-height: 700px;
  }

  .areas-table {
    margin: 20px 0 20px;
    overflow: scroll;
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
