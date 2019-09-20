<template>
  <div class="map-export-wrapper">
    <template>
      <div class="title">PDF Export</div>
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
      class="export-button export-clear"
      @click="clear" />
    <el-button
      :disabled="processing"
      icon="el-icon-printer"
      class="export-button export-print"
      title="Print to PDF and clear list"
      @click="print" />
    <el-button
      v-if="processing"
      type="primary"
      class="export-button export-print"
      icon="el-icon-loading" />
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
    left: 50%;
    margin-left: -180px;
    width: 360px;
    max-width: 100%;
    @media (min-width: 768px) {
      top: 54px;
    }
    @media (max-width: 767px) {
      bottom: 90px;
    }
    .title {
      font-size: 28px;
      color: #5683a2;
      font-weight: 300;
      text-transform: uppercase;
      margin-bottom: 15px;
    }
    .el-button {
      cursor: pointer;
    }
    .export-button {
      margin-top: 15px;
      font-size: 20px;
      color: #5683a2;
      &.export-print {
        padding-right: 10px;
        float: right;
      }
      &.export-clear {
        padding-left: 10px;
        float: left;
      }
    }

  }
</style>
