<template>
  <el-table
    :data="data">
    <el-table-column
      prop="attribute"
      label="Attribute"/>
    <el-table-column
      prop="value"
      label="Value"/>
  </el-table>
</template>

<script>
export default {
  name: 'AttributeTable',
  props: {
    data: {
      type: Array,
      required: true
    }
  }
}
</script>
