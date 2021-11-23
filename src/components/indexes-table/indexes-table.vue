<template>
  <div class="indexes-panel d-flex flex-column align-items-center justify-content-end">
    <el-table
      v-if="!loading"
      :data="rows"
      :row-class-name="tableRowClassName"
      class="indexes-table"
      max-height="500"
      size="small"
      style="width: 100%"
      @current-change="selectIndex">
      <el-table-column
        prop="acronym"
        width="120"
        label="Name" />
      <el-table-column
        prop="name"
        label="Description"
        width="420" />
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

import errorHandler from '@/utils/errorHandler'

export default {
  name: 'IndexesTable',
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
    selectIndex(area) {
      this.selectFormula(area)
      if (this.$route.query.layer != area.id) {
        this.$router.replace({query: {...this.$route.query, layer: area.id}})
        .catch(errorHandler.routerError)
      }
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
  .indexes-panel {
    position: relative;
    min-height: 400px;
    max-height: 100%;
    max-width: 100%;
  }

  .indexes-table {
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
