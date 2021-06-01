<template>
  <el-table
    :data="data">
    <el-table-column
      label=""
      width="50">
      <template slot-scope="scope">
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
  .el-table >>> .cell{
    text-overflow: initial;
  }
</style>