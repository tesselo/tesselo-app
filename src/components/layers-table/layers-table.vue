<template>
  <div class="layers-panel d-flex flex-column align-items-center justify-content-end">
    <el-table
      v-if="!loading"
      :data="rows"
      :row-class-name="tableRowClassName"
      class="layers-table"
      max-height="500"
      size="small"
      style="width: 100%"
      @current-change="selectLayer">
      <el-table-column
        prop="acronym"
        width="200"
        label="Name" />
      <el-table-column
        prop="formula"
        label="Formula"
        width="320" />
      <el-table-column
        class="number"
        prop="minVal"
        width="50"
        label="Min" />
      <el-table-column
        class="number"
        prop="maxVal"
        width="50"
        label="Max" />
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
  name: 'LayersTable',
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
      total: state => state.formula.total,
      pageSize: state => state.formula.pageSize,
      rows: state => state.formula.rows,
      next: state => state.formula.next,
      previous: state => state.formula.previous,
      selectedFormula: state => state.formula.selectedFormula,
      currentPage: state => state.formula.currentPage
    })
  },
  beforeMount() {
    if (this.rows.length === 0) {
      this.getFormulas({ page: this.currentPage })
    }
  },
  methods: {
    ...mapActions('formula', {
      getFormulasAction: actionTypes.FORMULA_GET,
      selectFormula: actionTypes.FORMULA_SELECT
    }),
    getFormulas(options) {
      this.loading = true
      this.getFormulasAction(options)
        .then(() => {
          this.loading = false
        })
    },
    selectLayer(area) {
      this.selectFormula(area)
      this.$router.replace({query: {...this.$route.query,layer: area.id}})
      this.$emit('select', area)
    },
    selectPage(page) {
      this.getFormulas({ page })
    },
    tableRowClassName(data) {
      if (this.selectedFormula && data.row.id == this.selectedFormula.id) {
        return 'selected'
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .layers-panel {
    position: relative;
    min-height: 400px;
    max-height: 100%;
    max-width: 100%;
  }

  .layers-table {
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
