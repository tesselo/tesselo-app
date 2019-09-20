<template>
  <div
    class="map-export-wrapper">
    <template v-if="data.length">
      <el-table
        :data="data"
        size="mini">
        <el-table-column
          prop="id"
          label="Page"
          width="60" />
        <el-table-column
          prop="layer"
          label="Layer" />
        <el-table-column
          prop="moment"
          label="Time" />
      </el-table>
    </template>
    <el-button
      :disabled="processing"
      type="primary"
      icon="el-icon-delete"
      title="Clear export data"
      class="export-clear"
      @click="clear" />
    <el-button
     :disabled="processing"
      icon="el-icon-printer"
      class="export-print"
      title="Print to PDF and clear list"
      @click="print" />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    processing: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    print(){
      if(!this.processing) this.$emit('print-pdf')
    },
    clear(){
      if(!this.processing) this.$emit('clear-exports')
    }
  }
}
</script>


<style lang="scss">
  .map-export-wrapper {
    position: fixed;
    z-index: 1000;
    background: white;
    padding: 10px;
    border-radius: 3px;
  }
  .el-table {
    padding-bottom: 10px;
  }
  .el-button {
    cursor: pointer;
  }
  .export-print {
    padding-right: 10px;
    float: right;
  }
  .export-clear {
    padding-left: 10px;
    float: left;
  }
</style>
