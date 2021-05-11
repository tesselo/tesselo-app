<template>
  <transition 
    name="fade" 
    appear>
    <div class="map-export-wrapper">
      <template>
        <div class="title">PDF Export
          <el-button
            icon="el-icon-close"
            class="export-button export-close"
            @click="close" />
        </div>
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
        icon="el-icon-delete"
        title="Clear page list"
        class="export-button"
        @click="clear" />
      <el-button
        :loading="processing"
        class="export-button export-print"
        title="Add current view as Page"
        icon="el-icon-plus"
        @click="addPage" />
      <el-button
        :disabled="processing"
        icon="el-icon-download"
        class="export-button export-print"
        title="Download PDF"
        @click="print" />
    </div>
  </transition>
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
    },
    addPage(){
      if(!this.processing) this.$emit('add-page')
    },
    close(){
      this.$emit('close') 
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
    border: 2px solid rgba(0,0,0,0.2);
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
    .export-button {
      margin-top: 15px;
      font-size: 20px;
      color: #5683a2;
      padding: 0px !important;
      border: 0px;
      &.export-print {
        margin-left: 15px;
        float: right;
      }
      &.export-clear {
        margin-left: 10px;
        float: left;
      }
      &.export-close {
        float: right;
        margin-top: 0px; 
      }
      &:hover{
        background-color: #F1F1F1;
        border-color: #F1F1F1;
        color: #5683a2;
      }
    }
  }
  
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .4s ease-in-out;
  }

</style>
