<template>
  <div class="areas-panel d-flex flex-column align-items-center justify-content-end">
    <el-table
      v-if="!loading"
      :data="rows"
      :row-class-name="tableRowClassName"
      class="areas-table"
      max-height="500"
      size="small"
      style="width: 100%"
      @current-change="selectArea">
      <el-table-column
        prop="name"
        label="Name"
        width="300" />
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

import 'element-plus/theme-chalk/el-table.css'
import 'element-plus/theme-chalk/el-table-column.css'
import 'element-plus/theme-chalk/el-pagination.css'
import 'element-plus/theme-chalk/el-icon.css'

// import {
//   Table as ElTable,
//   TableColumn as ElTableColumn,
//   Pagination as ElPagination
// } from 'element-plus'

export default {
  name: 'AggregationAreasTable',
  // components: {
  //   ElTable,
  //   ElTableColumn,
  //   ElPagination
  // },
  data() {
    return {
      loading: false
    }
  },
  emits: ['select'],
  computed: {
    ...mapState({
      selectedLayer: state => state.aggregationLayer.selectedLayer,
      total: state => state.aggregationArea.total,
      pageSize: state => state.aggregationArea.pageSize,
      rows: state => state.aggregationArea.rows,
      next: state => state.aggregationArea.next,
      previous: state => state.aggregationArea.previous,
      selectedArea: state => state.aggregationArea.selectedArea,
      currentPage: state => state.aggregationArea.currentPage
    })
  },
  watch: {
    selectedLayer() {
      this.getAggregationAreas({
        aggregationLayer: this.selectedLayer.id,
        page: this.currentPage
      })
    }
  },
  mounted() {
    // Get selected layer if not set or not the right one.
    if (!this.selectedLayer || this.selectedLayer.id != this.$route.params.layer) {
      this.getAggregationLayerIDAction(this.$route.params.layer)
    } else {
      this.getAggregationAreas({
        aggregationLayer: this.selectedLayer.id,
        page: this.currentPage
      })
    }
  },
  methods: {
    ...mapActions('aggregationArea', {
      getAggregationAreasAction: actionTypes.AGGREGATION_AREA_GET,
      selectAggregationArea: actionTypes.AGGREGATION_AREA_SELECT
    }),
    getAggregationAreas(options) {
      this.loading = true
      this.getAggregationAreasAction(options)
        .then(() => {
          this.loading = false
        })
    },
    selectArea(area) {
      this.selectAggregationArea(area)
      this.$emit('select', area)
    },
    selectPage(page) {
      this.getAggregationAreas({
        page: page,
        aggregationLayer: this.selectedLayer.id
      })
    },
    tableRowClassName(data) {
      if (this.selectedArea && data.row.id == this.selectedArea .id) {
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
