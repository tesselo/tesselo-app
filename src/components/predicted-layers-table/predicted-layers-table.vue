<template>
  <div class="predicted-layers-panel d-flex flex-column align-items-center justify-content-end">
    <el-table
      v-if="!loading"
      :data="rows"
      :row-class-name="tableRowClassName"
      class="predicted-layers-table"
      max-height="500"
      size="small"
      style="width: 100%"
      @current-change="selectLayer">
      <el-table-column
        prop="classifierName"
        label="Classifier"
        min-width="350"
        show-overflow-tooltip />
      <el-table-column
        prop="classifierType"
        label="Classifier Type"
        min-width="250"
        show-overflow-tooltip/>
      <el-table-column
        prop="sourceName"
        label="Date"
        min-width="140"
        show-overflow-tooltip/>
    </el-table>
    <div
      v-if="loading"
      class="spinner-wrapper">
      <div class="spinner twilight" />
    </div>
    <el-pagination
      v-if="rows.length"
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
  name: 'PredictedLayerTable',
  components: {
    ElTable,
    ElTableColumn,
    ElPagination
  },
  data() {
    return {
      loading: false,
      filteredRows: []
    }
  },
  computed: {
    ...mapState({
      total: state => state.predictedLayer.total,
      pageSize: state => state.predictedLayer.pageSize,
      rows: state => state.predictedLayer.rows,
      next: state => state.predictedLayer.next,
      previous: state => state.predictedLayer.previous,
      selectedLayer: state => state.predictedLayer.selectedLayer,
      areaSelectedLayer : state => state.aggregationLayer.selectedLayer,
      currentPage: state => state.predictedLayer.currentPage,
    }),
    ...mapState('time', {
      selectedYear: state => state.selectedMoment && state.selectedMoment.year
    })
  },

  watch: {
    selectedYear () {
      this.getPredictedLayers({ page: this.currentPage })
    }
  },

  beforeMount() {
    this.getPredictedLayers({ page: this.currentPage })
  },

  methods: {
    ...mapActions('predictedLayer', {
      getPredictedLayersAction: actionTypes.PREDICTED_LAYER_GET,
      selectPredictedLayer: actionTypes.PREDICTED_LAYER_SELECT
    }),
    ...mapActions('map', {
      setMapBounds: actionTypes.MAP_SET_BOUNDS
    }),

    filterRows () {
      if (this.selectedYear) {
        // Filter predirected layers based on selected Year
        this.filteredRows = this.rows.filter(
          entry => {
            return entry.sourceName.includes(this.selectedYear) &&
            entry.aggregationLayerName === this.areaSelectedLayer.name
          }
        )
      } else {
        if(!this.areaSelectedLayer){
          this.filteredRows = this.rows;
        }
      }
    },

    getPredictedLayers(options) {
      this.loading = true
      this.getPredictedLayersAction(options)
        .then(() => {
          this.loading = false
        })
    },
    selectLayer(layer) {
      if(this.selectedLayer && layer.id === this.selectedLayer.id) {
        this.$router.replace({query: {...this.$route.query,player: layer.id}})
        this.selectPredictedLayer()
        this.$emit('select')
      } else {
        this.$router.replace({query: {...this.$route.query,player: layer.id}})
        this.selectPredictedLayer(layer)
        this.$emit('select', layer)
      }
    },
    selectPage(page) {
      this.getPredictedLayers({ page })
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
  .predicted-layers-panel {
    position: relative;
    min-height: 400px;
    max-height: 100%;
    max-width: 100%;
  }

  .predicted-layers-table {
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
