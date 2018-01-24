<template>
  <div class="layers-panel d-flex flex-column align-items-center justify-content-end">
    <el-table
      class="layers-table"
      v-if="!loading"
      :data="rows"
      max-height="500"
      @current-change="selectLayer"
      size="small"
      :row-class-name="tableRowClassName"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="Name"
        width="300" />
      <el-table-column
        prop="formula"
        label="Formula" />
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
      selectedFormula: state => state.formula.selectedFormula
    })
  },
  beforeMount() {
    this.getFormulas({page: 1})
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
    min-width: 400px;
    min-height: 400px;
    max-height: 700px;
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
