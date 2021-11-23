<template>
  <el-table
    :data="data">
    <el-table-column
      label=""
      width="50">
      <template v-slot="scope">
        <el-button
          :style="{backgroundColor: scope.row.color, borderColor: scope.row.color}"
          size="small"/>
      </template>
    </el-table-column>
    <el-table-column
      prop="category"
      label="Category"/>
    <el-table-column
      prop="area"
      label="Area [ha]"/>
    <el-table-column
      prop="percentage"
      label="%"/>
  </el-table>
</template>

<script>
import 'element-plus/theme-chalk/el-table-column.css'

export default {
  name: 'StatisticsTable',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
  .el-table :deep(.cell) {
    text-overflow: initial;
  }
</style>